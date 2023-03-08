import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "./commonFun";
const validator = require('./helper');


const signup = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        "firstName": "required|string",        
        "email": "required|string|email|exist:registers,email",
        "password": "required|string|min:3|strict",     

    };

    await validator(req.body, validationRule, {},

        (err: any, status: any) => {
            if (!status) {
                const tempObj = err.errors
                let transformed: any = {};
                Object.keys(tempObj).forEach(function (key, index) {                                            
                    transformed[key] = tempObj[key]?.join('');
                })
                // console.log(transformed, 'transformed');

                ErrorMessage(req, res, transformed, 422)
                // res.status(422).json(e);

            } else {
                next();
            }
        }).catch((err: any) => console.log(err))
}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        "firstName": "required|string",
        "email": "required_without:PhoneNo|string|email",
        "password": "required|string|min:3|strict",
        
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        "otp": "required|string|min:6|max:7"        
    }
    await validator(req.body, validationRule, {}, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const reSendOtp = async (req: Request, res: Response,next: NextFunction) => {
    const validationRule = {
        "email": "required_without:PhoneNo|string|email"       
    }
    await validator(req.body, validationRule, {}, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const forgetPassword = async (req: Request, res: Response,next: NextFunction) => {
    const validationRule = {
        "token": "required|string",
        "password": "required|string|min:3|strict|confirmed",
        "password_confirmation": "required|string|min:3|strict",
        
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const getOTP = async (req: Request, res: Response,next: NextFunction) => {
    const validationRule = {
        "email": "required_without:PhoneNo|string|email"       
    }
    await validator(req.body, validationRule, {}, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const changePassword=async (req: Request, res: Response,next: NextFunction) => {
    const validationRule = {
       
        "password": "required|string|min:3|strict|confirmed",
        "password_confirmation": "required|string|min:3|strict",
        
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                // console.log(tempObj[key]?.join(''),'tempObj[key]?.join()');                                            
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))

}


// export { signup, login}
export {  signup, verifyUser, login,reSendOtp ,forgetPassword,getOTP,changePassword};