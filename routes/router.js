const express = require ('express');
const router = express.Router();
const controller = require ('../controller/userController');
const { requireLoggedIn, isAdmin } = require('../middleware/userAuthMiddleware');
const path = require ('path')

router.use(express.static(path.join(__dirname, 'routes/public'))); 

router.post('/register', controller.register);
router.post('/login', controller.login);


//protected user routes 
router.get('/userAuth', requireLoggedIn, (req ,res)=>{
    res.status(200).send({ok : true});
})
//protected admin routes 
router.get('/adminAuth', requireLoggedIn, isAdmin, (req ,res)=>{
    res.status(200).send({ok : true});
})


//user profile update route
router.put('/userProfile', requireLoggedIn, controller.userProfile)
  


module.exports = router;