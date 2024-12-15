import express from 'express'
import {isAuthenticated, login, logout, register, resetpassword, sendResetotp, sendVerifyOtp, verifyemail } from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyemail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetotp);
authRouter.post('/reset-password',resetpassword);

export default authRouter;

