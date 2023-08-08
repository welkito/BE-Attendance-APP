import { request } from "express"
import { ValidationError } from "yup"
import * as config from "../../config/index.js"
import handlebars from "handlebars"
import transporter from "../../helper/transporter.js"
import {User,Salary} from "../../model/relation.js"
import { Sequelize, Op } from "sequelize"
import db from "../../model/index.js"
import { hashPassword, comparePassword } from "../../helper/encryption.js"
import { createToken, verifyToken } from "../../helper/token.js"
import { USER_ALREADY_EXISTS, USER_DOES_NOT_EXISTS, INVALID_CREDENTIALS } from "../../middleware/error.handler.js"
import { LoginValidationSchema, RegisterValidationSchema,UpdateValidationSchema } from "./validation.js"
import fs from "fs"
import path from "path"

const cache = new Map();

export const showAll= async(req,res,next) =>{
    try{
        const users= await User?.findAll();
        res.status(200).json({users})
    }
    catch(error){
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}

// @register process
export const register = async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{      

        // @validation
        const { email, salary} = req.body;
        await RegisterValidationSchema.validate(req.body);
        //perlu email di user, salary di salary, 
        // @check if user already exists
        const userExists = await User?.findOne({ where: {email : email}});
        if (userExists) throw ({ status : 400, message : USER_ALREADY_EXISTS });

        // @create user 
        const user = await User?.create({
            email : email
        });

        //create new salary based on new user information
        await Salary?.create({
            salary_userId : user?.dataValues?.id,
            salary : salary
        })

        // @generate access token
     const accessToken = createToken({ id: user?.dataValues?.id, role : user?.dataValues?.roleId });

     const template = fs.readFileSync(path.join(process.cwd(), "template", "update.html"), "utf8");
     const html = handlebars.compile(template)({link :(config.REDIRECT_URL + `/profile/${accessToken}`) })
     
     const mailOptions = {
         from: `Team Support <${config.GMAIL}>`,
         to: email,
         subject: "Update Employee Profile",
         html: html}
         transporter.sendMail(mailOptions, (error, info) => {
             if (error) throw error;
             console.log("Email sent: " + info.response);
         })
     
     // @return response
     res
         .header("Authorization", `Bearer ${accessToken}`)
         .status(200)
         .json({
         message: "Employee created successfully. please check on newly sent email to update their account"
     });
        });  


    } catch (error) {

        // @check if error from validation
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}

// @login process
export const login = async (req, res, next) => {
    try {
        // @validation, we assume that username will hold either username or email
        const { email, password } = req.body;
        await LoginValidationSchema.validate(req.body);

        // @check if user exists
        const userExists = await User?.findOne({ where: {email : email}});
        if (!userExists) throw ({ status : 400, message : USER_DOES_NOT_EXISTS })
        
        // @check if password is correct
        const isPasswordCorrect = comparePassword(password, userExists?.dataValues?.password);
        if (!isPasswordCorrect) throw ({ status : 400, message : INVALID_CREDENTIALS });
        
        
        // @check token in chache
       const cachedToken = cache.get(userExists?.dataValues?.id)
       const isValid = cachedToken && verifyToken(cachedToken)
       let accessToken = null
       //@check if token exist and valid
       if (cachedToken && isValid) {
           accessToken = cachedToken
       } else {
           // @generate access token
           accessToken = createToken({ id: userExists?.dataValues?.id, role : userExists?.dataValues?.roleId });
           cache.set(userExists?.dataValues?.id, accessToken)
        }        
          
            // @return response
        res.header("Authorization", `Bearer ${accessToken}`)
            .status(200)
            .json({ user : userExists })
    } catch (error) {
        // @check if error from validation
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}

//keeplogin
export const keepLogin = async (req,res,next) => {
    try{

        //@find the user's data
        const userResult = await User?.findOne( { where : { id : req?.user?.id } });

        //send data via response
        res.status(200).json({userResult})


    } catch (error) {
        next(error)
    }

}

export const update = async (req, res, next) => {
    try {
        // @create transaction
        const transaction = await db.sequelize.transaction(async()=>{      

        // @validation
        const { password, fullname, dob} = req.body;
        await UpdateValidationSchema.validate(req.body);

        // @check if user exists
        const userExists = await User?.findOne({ where: {id: req?.user?.id}});
        if (!userExists) throw ({ status : 400, message : USER_DOES_NOT_EXISTS })
        if (userExists?.dataValues?.password !== "") throw ({ status : 400, message :"user data already updated"})

        // @create user -> encrypt password
        const hashedPassword = hashPassword(password);
        const user = await User?.update({
            fullname : fullname,
            password : hashedPassword,
            dob : dob,
        },{where:{id : req?.user?.id}});

        // const result = 
        res
        // .header("Authorization", `Bearer ${req?.token}`)
        .status(200)
        .json({ message : "Done! ready to login." })
        });  


    } catch (error) {

        // @check if error from validation
        if (error instanceof ValidationError) {
            return next({ status : 400, message : error?.errors?.[0] })
        }
        next(error)
    }
}
