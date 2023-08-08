import { request } from "express"
import { ValidationError } from "yup"
import * as config from "../../config/index.js"
import handlebars from "handlebars"
import transporter from "../../helper/transporter.js"
import {User,Salary} from "../../model/relation.js"
import { Sequelize, Op,QueryTypes } from "sequelize"
import db from "../../model/index.js"
import { hashPassword, comparePassword } from "../../helper/encryption.js"
import { createToken, verifyToken } from "../../helper/token.js"
import { USER_ALREADY_EXISTS, USER_DOES_NOT_EXISTS, INVALID_CREDENTIALS } from "../../middleware/error.handler.js"
import fs from "fs"
import path from "path"
import calculateBusinessDays from "./calculate.js"
import moment from "moment/moment.js";

//ada obejct isinya nama user, data

async function count (userId, year,parseMonth,year2,parseNextMonth){
    return await db.sequelize.query(`
    select count(clockIn) as totalIn, count(clockOut) as totalOut from attendances
where attendance_userId = ${userId} and (clockIn >= CAST('${year}-${parseMonth}-01' AS DATE) or clockOut >= CAST('${year}-${parseMonth}-01' AS DATE) )
AND ( clockIn < CAST('${year2}-${parseNextMonth}-01' AS DATE) or clockOut < CAST('${year2}-${parseNextMonth}-01' AS DATE));`,{
        type: QueryTypes.SELECT
    })
    }

export const report = async(req,res,next) =>{
    try{
        //generate salary report
        //get user information
        const salary = await Salary.findOne({where : {salary_userId : req?.user?.id}})
        // console.log("jalan")
        //get year and mont
        //assume month = 8, next month = month+1 year 2023
        let month = 8
        let nextMonth = month+1
        let year = 2022
        const a = []
        //looping 12 bulan dari agustus 2022 - juli 2023
        for (let i = 0; i < 12; i++){
            month === 13 ? month = 1 : month 
            nextMonth === 13 ? nextMonth = 1 : nextMonth
            let parseMonth = ""+month
            let parseNextMonth = ""+ nextMonth
            if(month < 10){
                parseMonth = "0" + month
            }
            if(nextMonth < 10){
                parseNextMonth = "0"+nextMonth
            }
            let counts = await count(req?.user?.id, year,parseMonth,year,parseNextMonth)
            let businessDays = calculateBusinessDays(`${year}-${parseMonth}-01`,`${year}-${parseNextMonth}-01`)
            if(month === 1){
                year++;
                counts = await count(req?.user?.id, year,parseMonth,year,parseNextMonth)
                businessDays = calculateBusinessDays(`${year}-${parseMonth}-01`,`${year}-${parseNextMonth}-01`)
            }
            else if(nextMonth == 1){
                counts = await count(req?.user?.id, year,parseMonth,(year+1),parseNextMonth)
                businessDays = calculateBusinessDays(`${year}-${parseMonth}-01`,`${year+1}-${parseNextMonth}-01`)
            }
            else{

            }
            const total = +counts[0].totalIn + +counts[0].totalOut
            //asumsi total ceklok sebanyak 2x business days
            //potong brp
            // console.log(salary)
            const receive = parseInt((total/(businessDays * 2)) * salary?.dataValues?.salary,10)
            //salary brp
            const deduction = salary?.dataValues?.salary - receive

            //total = salary - potongan
            a.push({period : `${moment.months(month - 1)} ${year}`, 
            salary : salary?.dataValues?.salary,
            deduction : +deduction, 
            amount : receive,
            businessDays : businessDays,
            attendance : total
        })

            month++
            nextMonth++
        }
        //dalam range 1 bulan tertentu : 
        //hitung deduction berdasarkan smua deduction di bulan terkait
        //dpt salary si user, totalbulanan = salary - deduction
        //masukin 3 data itu ke 1 object, plus nama bulan dan tahunnya dalam string
        // const result= await Attendance?.findAll({where : {id : req?.user?.id},limit : 20, order : [["id","DESC"]],attributes: { exclude: ['clockInDeduction',"clockOutDeduction"]}});
        res.status(200).json({message : "report successful", result : a})
    }
    catch(error){
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}