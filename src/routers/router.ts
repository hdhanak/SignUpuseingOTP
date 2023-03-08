import express, { Request, Response, Router } from "express";
import { aggragtionEx, changePassword, findgioLocation, forgetPassword, getOTP, getProfile, gioLocation, login, logOut, print, reSendOtp, signUp, verifyUser } from "../controller/logic";
import auth from "../middleware/auth";
const router = express.Router()
const V = require('../middleware/validation')

router.get('/',print)
router.post('/signUp',V.signup,signUp)
router.post("/confirm",V.verifyUser, verifyUser)
router.post('/login',V.login,login)
router.post('/reSendOtp',V.reSendOtp,reSendOtp)
router.patch('/forgetPassword',V.forgetPassword,forgetPassword)
router.post('/getOTP',V.getOTP,getOTP)
router.patch('/changePassword',V.changePassword,auth,changePassword)
router.patch('/logOut',auth,logOut)
router.get('/getProfile',getProfile)
router.get('/aggragtionEx/:id',aggragtionEx)
router.post('/gioLocation',gioLocation)
router.get('/findgioLocation',findgioLocation)
// router.get("/api/auth/confirm/:confirmationCode", verifyUser)

export  {router}