const express = require ('express');
const categoryController = require ('../controller/categoryController');
const { requireLoggedIn, isAdmin } = require('../middleware/userAuthMiddleware');
const router = express.Router();


//routes
router.post('/createCategory', requireLoggedIn, isAdmin, categoryController.createCategory)
router.get('/allCategory', categoryController.getAllCategory); // requireloggedIn is not require here bcz we can show all category on display even user is loggin or not
router.get('/singleCategory/:id', categoryController.singleCategory);
router.put('/updateCategory/:id', requireLoggedIn, isAdmin, categoryController.updateCategory);
router.delete('/deleteCategory/:id', requireLoggedIn, isAdmin, categoryController.deleteCategory);



module.exports = router;