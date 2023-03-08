import express, {
  application,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { ObjectId } from "mongodb";
// import mongoose from "mongoose";
var mongoose = require('mongoose');

import { tokenToString } from "typescript";
import sendConfirmationEmail from "../config/nodemail";
import { agenda } from "../conn/db";
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commonFun";
import otpModel from "../models/authOPT";
import gioModel from "../models/gioLocation";
import regisetModel from "../models/regisetModel";
import tokenModel from "../models/token";
// import signUpModel from "../models/signupModel";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require("../config/auth.ts");
// import config from '../config/auth'
const Appstring = require("../Appstring");
const Str = require("@supercharge/strings");

const print = (req: Request, res: Response) => {
  res.send("hello api");
};

const signUp = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const randomToken = Str.random(50);
    console.log(randomToken, "randomToken");
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 6);
    }

    const user = await regisetModel.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
    });
    // console.log(user, "user");

    // await user.save()
    user.save(async (err) => {
      if (err) {
        ErrorMessage(req, res, err, 500);
        return;
      }

      MessageResponse(req, res, Appstring.REGISTER_SUCCESSFULLY, 201);

      const otpUser = await otpModel.create({
        userId: user._id,
        otp: otp,
        token: randomToken,
        signedUp: 0,
      });

      await otpUser.save();
      agenda.define("log me", async (job: any) => {
        const { id } = job.attrs.data;
        console.log(id, "id");

        const findid = await otpModel.findOne({ _id: id });
        console.log(findid, "findid");

        const user = await regisetModel.findOne({ _id: findid?.userId });
        console.log(user, "userrrrrrrr---");

        if (!user!.isVerify) {
          console.log("ge");

          const upadteOTP = await otpModel.updateOne(
            { userId: user?._id },
            { otp: "" },
            { new: true }
          );
          findid!.signedUp = 0;
          findid?.save();
        }

        console.log(user, "user---");
      });

      await agenda.start(); // Start Agenda instance

      await agenda.schedule("2 minute", "log me", { id: otpUser._id });
      sendConfirmationEmail(user.firstName, user.email, otp);
    });

    // MessageResponse(req, res, Appstring.REGISTER_SUCCESSFULLY, 201)
  } catch (error) {
    console.log(error, "er");

    ErrorMessage(req, res, error, 400);
  }
};
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  otpModel
    .findOne({
      otp: req.body.otp,
    })
    .then(async (user) => {
      if (!user) {
        return ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
      }

      const signUpData = await regisetModel.findOne({ _id: user.userId });

      signUpData!.isVerify = true;

      signUpData!.save(async (err) => {
        if (err) {
          // console.log("err save");

          ErrorMessage(req, res, err, 400);

          return;
        }
        if (user?.signedUp == 0) {
          user!.signedUp = 1;
          await user.save();
          return MessageResponse(req, res, Appstring.VERIFY_SUUCESSFULL, 200);
        } else {
          return MessageResponse(req, res, user?.token, 200);
        }
      });
    })
    .catch((e) => console.log("error", e));
};

const reSendOtp = async (req: Request, res: Response) => {
  try {
    // const characters ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 6);
    }

    const user = await regisetModel.findOne({ email: req.body.email });
    if (user) {
      const tokenAvalible = await otpModel.findOne({ userId: user._id });
      if (tokenAvalible) {
        const tokenUpdate = await otpModel.updateOne(
          { userId: user._id },
          { otp: otp },
          { new: true }
        );
        const userUpadte = await regisetModel.updateOne(
          { _id: user._id },
          { isVerify: true },
          { new: true }
        );
        sendConfirmationEmail(user.firstName, user.email, otp);
        MessageResponse(req, res, Appstring.CHECK_MAIL, 200);
        agenda.define("log me", async (job: any) => {
          const { id } = job.attrs.data;

          const findid = await otpModel.findOne({ _id: id });

          const user = await regisetModel.findOne({ _id: findid?.userId });

          if (!user!.isVerify) {
            const upadteOTP = await otpModel.updateOne(
              { userId: user?._id },
              { otp: "" },
              { new: true }
            );
            findid!.signedUp = 0;
            findid?.save();
          }
        });
        await agenda.start(); // Start Agenda instance

        await agenda.schedule("2 minute", "log me", { id: tokenAvalible._id });
      } else {
        ErrorMessage(req, res, Appstring.NOT_FOUND_TOKEN, 404);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const otpToken = await otpModel.findOne({ token: req.body.token });
    console.log(otpToken, "hh");

    if (otpToken?.token == req.body.token) {
      const user = await regisetModel.updateOne(
        { _id: otpToken?.userId },
        { password: hashPassword },
        { new: true }
      );
    } else {
      return ErrorMessage(req, res, "token not from this user", 200);
    }
    // const validPassword = await bcrypt.compare(req.body.confirmPassword, hashPassword)
    MessageResponse(req, res, Appstring.PASSWORD_CHANGED, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const getOTP = async (req: Request, res: Response) => {
  try {
    // const characters =
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 6);
    }
    const user = await regisetModel.findOne({ email: req.body.email });
    if (user) {
      const tokenAvalible = await otpModel.findOne({ userId: user._id });
      if (tokenAvalible) {
        const tokenUpdate = await otpModel.updateOne(
          { userId: user._id },
          { otp: otp },
          { new: true }
        );
        const userUpadte = await regisetModel.updateOne(
          { _id: user._id },
          { isVerify: true },
          { new: true }
        );
        sendConfirmationEmail(user.firstName, user.email, otp);
        MessageResponse(req, res, Appstring.CHECK_MAIL, 200);
        agenda.define("log me", async (job: any) => {
          const { id } = job.attrs.data;

          const findid = await otpModel.findOne({ _id: id });

          const user = await regisetModel.findOne({ _id: findid?.userId });

          if (!user!.isVerify) {
            const upadteOTP = await otpModel.updateOne(
              { userId: user?._id },
              { otp: "" },
              { new: true }
            );
            // user!.isVerify=false
            // await user?.save()
          }
        });
        await agenda.start(); // Start Agenda instance

        await agenda.schedule("2 minute", "log me", { id: tokenAvalible._id });
      } else {
        ErrorMessage(req, res, Appstring.NOT_FOUND_TOKEN, 404);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const isLogin = await regisetModel.findOne({ email: req.body.email });
    if (isLogin) {
      if (isLogin.isVerify) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          isLogin.password
        );
        if (validPassword) {
          let params = {
            _id: isLogin._id,
            firstName: req.body.firstName,
            email: req.body?.email,
          };

          const isToken = await tokenModel.findOne({ userId: isLogin._id });
          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          if (!isToken) {
            const userLogin = await tokenModel.create({
              userId: isLogin._id,
              token: token,
            });
            res.send(userLogin);
          } else {
            const userLogin = await tokenModel.updateOne(
              { userId: isLogin._id },
              { token: token },
              { new: true }
            );

            tokenAccess(req, res, token, 201);
          }
        } else {
          return ErrorMessage(req, res, Appstring.NOT_VALID_INFO, 400);
        }
      } else {
        console.log("verify ypur account first");
        ErrorMessage(req, res, Appstring.NOT_VERIFY, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);
    ErrorMessage(req, res, error, 400);
  }
};
const changePassword = async (req: Request, res: Response) => {
  console.log(req.userId, "userIs");
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = await regisetModel.updateOne(
    { _id: req.userId },
    { password: hashPassword },
    { new: true }
  );
  MessageResponse(req, res, "password have been changed", 200);
};

const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.userId) {
      const user = await tokenModel.updateOne(
        { userId: req.userId },
        { $unset: { token: 1 } },
        { new: true }
      );
      console.log("user");
      MessageResponse(req, res, "logout", 200);
    }
  } catch (error) {
    console.log(error);
    ErrorMessage(req, res, error, 400);
  }
};
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await regisetModel.find();
  MessageResponse(req, res, users, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400); 
  }
};

const aggragtionEx = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await regisetModel.aggregate([
    {
      $lookup: {
        from: "otpverifies",
        localField: "_id",
        foreignField: "userId",
        as: "data",
      },
    },
    {
      $unwind: "$data",
    },
    {
      $project: {
        _id: 1,
        email: "$email",
        signedUp: "$data.signedUp",
        token: "$data.token",
        otp: "$data.otp",
        userID: "$data.userID",
      },
    },
  ]);
  // const updateUser = await regisetModel.updateOne({_id:req.params.id},[{ $set :{'test':83,'date':"$$NOW"}}],{new:true})
  const lastName = await regisetModel.updateMany(
    {},
    [{ $set: { lastName: "soni" } }, { $unset: "date" }],
    { new: true }
  );
  MessageResponse(req, res, user, 200);
};

const gioLocation = async (req: Request, res: Response, next: NextFunction) => {
  const loc = await gioModel.create({
    name: req.body.name,
    location: {
      type: "Point",
      coordinates: req.body.coordinates.map((d: any) => {
        console.log(d, "d");

        return d;
      }),
    },
  });
  MessageResponse(req, res, loc, 201);
};
const findgioLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { longitude, latitude, range, id ,name} = req.query;
  const r = 1000 * Number(range);

  // const findLoc = await gioModel.find({
  //   location: {  
  //     $nearSphere: {
  //       $geometry: {
  //         type: "Point",
  //         coordinates: [longitude,latitude],
  //       },
  //       $maxDistance:r ,
  //       $distanceField: 'dist'

  //     },
  //   },
  // });
  console.log(typeof mongoose.Types.ObjectId.createFromHexString(id),'id');


const _id = mongoose.Types.ObjectId.createFromHexString(id)

  const findLoc2 = await gioModel.aggregate([
   
    // {
    //   $geoNear: {
    //     near: {
    //       type: "Point",
    //       coordinates: [Number(longitude), Number(latitude)],
    //     },
    //     maxDistance: r,
    //     spherical: true,
    //     distanceField: "distance",
    //     distanceMultiplier: 0.001,
    //   },
    // },
    
     {
      $match: {
        _id: { $ne :_id },
      },
    },
  ]);
  MessageResponse(req, res, findLoc2, 200);
};

export {
  findgioLocation,
  gioLocation,
  aggragtionEx,
  getProfile,
  print,
  logOut,
  signUp,
  verifyUser,
  login,
  reSendOtp,
  forgetPassword,
  getOTP,
  changePassword,
};

// {
//   "firstName": "text",
//   "email": "textonly49412@gmail.com",
//   "password": "TextOnly$$!@123"
// // }
// "userId":633e8cb9bb8d0ac8fd7f15c0,
// "otp":"114013",
// "token":"wViBNVgOnFzuqTOIBXU-hStW86y8Wt181o6mv0eKQwwj6JGUXQ",
// "signedUp":1,
// "createdAt":2022-10-06T08:07:21.675+00:00,
// "updatedAt":2022-10-06T09:17:52.525+00:00  