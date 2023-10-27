const userModel = require("../model/userModel");
const { hashPassword, comparePassword } = require("../Helper/userAuthHelper");
const bcrypt = require("bcrypt");
const { sendMail } = require("../Helper/sendMail");
const JWT = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required !" });
  }
  //checking user email already exit or not
  const userExit = await userModel.findOne({ email });
  if (userExit) {
    return res
      .status(409)
      .send({ success: false, message: "Email Already Exists!" });
  } else {
    //hashing user password

    const hashedPassword = await hashPassword(password); //OR
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel({ name, email, password: hashedPassword });
    await newUser.save(); //OR
    // const newUser = await userModel.create({name, email, password})
    //sending mail to register user
    sendMail(
      email,
      "Welcome to Hamro Store",
      `Hi ${name} Thanks for Register on HamroStore`
    );
    res
      .status(201)
      .send({ success: true, message: "User Register Successfully !" });
  }
};

//login routes

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .send({ success: false, message: "All Fields are required !" });
    }

    //cheking user email register or not
    const userExit = await userModel.findOne({ email });
    if (!userExit) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Email or Password" });
      // return res.status(400).send({success : false, message : 'Email Not Exit'});
    }
    //cheking user password with db Password
    // const passMatch = await comparePassword(password, userExit.password); //or
    const passMatch = await bcrypt.compare(password, userExit.password);
    if (!passMatch) {
      return res
        .status(200)
        .send({ sucess: false, message: "Invalid Email or Password" });
    }

    //generating user Token
    const token = JWT.sign({ _id: userExit._id }, process.env.SECRATE_KEY, {
      expiresIn: "3d",
    });
    res
      .status(200)
      .send({
        success: true,
        message: "Log in successfully !",
        userExit,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "error while logged in" });
  }
};



//update user profile route
exports.userProfile = async (req, res) => {
  try {
    const { name, email,password } = req.body;
    const user = await userModel.findById(req.user._id)
    if(password && password.length >6){
        return res.json({error : 'Password must be greater than 6 character '})
    }

    const hashedPassword = password ? await hashPassword(password): undefined

    const updatedUserProfile = await userModel.findByIdAndUpdate(req.user._id,{ name: name || user.name, 
        email : email || user.email,
        password : hashedPassword || user.password,
        // phone : phone || user.phone,
    },{ new: true });    
    res.status(200).send({ success: true, message: "profile Updated",updatedUserProfile});

  } catch (error) {
    console.log(error);
    res.status(500).send({ sucess: false, message: `Error while updaring user profile ${error}` });
  }
};
