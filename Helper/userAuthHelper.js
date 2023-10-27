const brcypt = require ('bcrypt');

//hasing user password

exports.hashPassword = async (password)=>{
    try {
        const rounds = 10;
        const hashedPassword = brcypt.hash(password,rounds);
        return hashedPassword;
        
    } catch (error) {
        console.log(error)
        
    }
}

//comparing user password with db password

exports.comparePassword = async (password , hashedPassword) =>{
    return brcypt.compare(password, hashedPassword)

}


// module.exports = {hashPassword,comparePassword};