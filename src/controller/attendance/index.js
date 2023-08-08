import { request } from "express"
import { ValidationError } from "yup"
import * as config from "../../config/index.js"
import handlebars from "handlebars"
import transporter from "../../helper/transporter.js"
import {User,Salary, Attendance} from "../../model/relation.js"
import { Sequelize, Op } from "sequelize"
import db from "../../model/index.js"
import { hashPassword, comparePassword } from "../../helper/encryption.js"
import { createToken, verifyToken } from "../../helper/token.js"
import { USER_ALREADY_EXISTS, USER_DOES_NOT_EXISTS, INVALID_CREDENTIALS } from "../../middleware/error.handler.js"
// import { LoginValidationSchema, RegisterValidationSchema,UpdateValidationSchema } from "./validation.js"
import moment from "moment/moment.js";
import fs from "fs"
import path from "path"
import { addHours } from "date-fns"
// show data based on id
export const showAttendances= async(req,res,next) =>{
    try{
        const result= await Attendance?.findAll({where : {attendance_userId : req?.user?.id},limit : 20, order : [["id","DESC"]],attributes: { exclude: ['clockInDeduction',"clockOutDeduction"]}});
        res.status(200).json({result})
    }
    catch(error){
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}
// clock in (create data baru)
///lakukan perhitungan deduction (?)create data baru, kalau clock in, 
//terus masukkan date now. bs kirim result id attendancenay or no result
export const clockIn= async(req,res,next) =>{
    try{
        const time = new Date();
        const result= await Attendance?.create({clockIn : addHours(time,7),
        attendance_userId : req?.user?.id});
        const attendance = await Attendance?.findOne({where :{id : result?.dataValues?.id}}) 
        res.status(200).json({message : "new attendance has been created." , id : result?.dataValues?.id, attendance})
    }
    catch(error){
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}

//clock out (perlu id clock in)
export const clockOut= async(req,res,next) =>{
    try{
        const {id} = req.body;
        const time = new Date()
        await Attendance?.update({clockOut : addHours(time,7)},
        {where : {id : id}});
        const attendance = await Attendance?.findOne({where :{id : id}}) 
        res.status(200).json({attendance})
    }
    catch(error){
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}