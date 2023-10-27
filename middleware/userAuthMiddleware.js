const JWT = require ('jsonwebtoken');
const userModel = require ('../model/userModel');

//Token based protected routes
exports.requireLoggedIn = async (req, res, next)=>{
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.SECRATE_KEY);
        req.userExit = decode;
        next();        
    
    } catch (error) {
        console.log(error)
        res.status(500).send({sucess: false, message : `Login First`})
        
    }


}


//admin access

exports.isAdmin = async (req, res, next)=>{
    try {
        const user = await userModel.findById(req.userExit._id);
        if(user.role !== 1){
            return res.status(401).send({sucess : false, message : 'unAuthorized Acess !'})
        }
        else{
            next();
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).send({success : false, messagae : 'error while accesing admin route'})
        
    }

}