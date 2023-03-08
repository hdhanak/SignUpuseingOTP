import { NextFunction, Request, Response } from "express"
import tokenModel from "../models/token";

import { ErrorMessage } from "./commonFun"
const jwt = require('jsonwebtoken')

declare global {
    namespace Express {
        interface Request {
            userId: any;
            userType:any;
            empId:any;
        }
    }
}


const auth = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers?.authorization
    const token = bearer?.split(' ')[1]
   

    await jwt.verify(token, process.env.SECRET_KEY, {}, async (error: any, data: any) => {
        if (error) {
            ErrorMessage(req, res, error, 401)
        }
        else {
            console.log(data,'data')
            
            const user = await tokenModel.findOne({ userId: data._id })

            if (user?.token == token) {
                    req.userId =  user?.userId
                // req.userType = user?.userType  
                // req.userId = user?.userType ? user.userId : user?.mangerId 
                // req.empId =  user?.userType ? undefined : data?._id          
                

            } else {
                return ErrorMessage(req, res, 'tokne not avilable or update your token', 422)
            }
           
            next()

        }
    })

    // }

}

export default auth