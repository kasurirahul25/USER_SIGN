import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const existinUser = await userModel.findOne({ email });

        if (existinUser) {
            return res.json({ success: false, message: "User Already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // SENDING THE MAIL TO USER FOR AUTHENTICATION
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to : email,
            subject : 'Welcome to My Portal',
            text : `Welcome to the website, Your account has been created with email id: ${email} `
        
        }
        await transporter.sendMail(mailOptions)

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid Email' });
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged out' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const sendVerifyOtp = async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isaccountverified){
            return res.json({success:false,message:'Account alrready Verified'})
        }

        const otp =String(Math.floor (100000+Math.random() * 900000))
        user.verifyotp = otp;
        user.verifyotpexpireat = Date.now() + 24 *60 *60 *1000
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to : user.email,
            subject : 'Account Verification OTP',
            text : `Your otp is  ${otp}. Verify account by using this OTP `
        

        }
        await transporter.sendMail(mailOptions)
        res.json({success:true, message:'Verification otp sent on Email'})


    }catch(error){
            res.json({success:false, message:error.message});
    }
}

export const verifyemail= async(req,res)=>{
    const {userId,otp} = req.body;
    if(!userId || !otp){
        return res.json({success:false, message:'Missing details'});
    }
    try{
            const user = await userModel.findById(userId);
            if(!user){
                return res.json({success:false,message:'user not find'});
            }

            if(user.verifyotp==='' || user.verifyotp !==otp){
                return res.json({success:false, message:'Invalid otp'})
            }

            if(user.verifyotpexpireat < Date.now()){
                return res.json({success:false,message:'Otp is Expired'});
            }
            user.isaccountverified= true;
            user.verifyotp = '';
            user.verifyotpexpireat = 0;

            await user.save();
            return res.json({success:true, message:"Email verified Sucessfully"})

    }
    catch(error){
        return res.json({success:false,message: error.message});

    }

}


export const isAuthenticated = async(req,res)=>{
    try{
            return res.json({success:true});

    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

// Send Password Reset OTP
export const sendResetotp = async (req, res)=>{

    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"})

    }
    try{
            const user = await userModel.findOne({email});
            if(!user){
                return res.json({success:false,message:'User not found'})
            }

            const otp =String(Math.floor (100000+Math.random() * 900000))
            user.resetotp = otp;
            user.resetotpexpireat = Date.now() + 15 *60 *1000
            await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to : user.email,
            subject : 'Password Reset OTP',
            text : `Your OTP for resetting your password is ${otp}.
Use this OTP to proceed with resetting your password.`
        };
        await transporter.sendMail(mailOptions);
        return res.json({success:true, message:'otp sent to your email'});



    }
    catch(error){
        return res.json({success:false, message: error.message})
    }
}


//Reset user password.
export const resetpassword = async(req,res)=>{
    const{email,otp,newpassword} = req.body;
    if(!email||!otp||!newpassword){
        return res.json({success:false,message:'email,otp and new password are required'});

    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            res.json({success:false, message:'User not found'});
        }
        if(user.resetotp===''|| user.resetotp!==otp){
            return res.json({success:false, message:'Invalid otp'});
        }
        if(user.resetotpexpireat <Date.now()){
            return res.json({success:false, message:'OTP Expired'});
        }
        const hashedPassword = await bcrypt.hash(newpassword,10);
        user.password = hashedPassword;
        user.resetotp ='';
        user.resetotpexpireat = 0;
        await user.save();
        res.json({success:true,message:'password is sucessfully changed'})

    }catch(error){
        return res.json({success:false,message:error.message});

    }

}