import jwt from "jsonwebtoken";


const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false, message: 'Not authorized. Login Again'})

    }
    try{

        const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokendecoded.id){
            req.body.userId = tokendecoded.id

        }
        else{
            return res.json({success:false,message:'Not Authorized. Login Again'})
        }
        next();
    }

    catch(error){
        return res.json({success:false, message: error.message});

    }
}

export default userAuth;