const express = require ('express');
const productController = require ('../controller/productController')
const { requireLoggedIn, isAdmin } = require('../middleware/userAuthMiddleware');
const router = express.Router();


const multer = require ('multer');
// // Setting up multer for file uploads
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'public', 'image'), // Use an absolute path (public folder on root path)
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  

const upload = multer({ storage });




// router.post('/createProduct', requireLoggedIn, isAdmin, productController.createProduct);
router.post('/createProduct', upload.single('image'), requireLoggedIn, isAdmin, productController.createProduct);
router.get('/allProduct', productController.allProducts);
router.get('/singleProduct/:id', productController.singleProduct);
router.put('/updateProduct/:id', requireLoggedIn, isAdmin, productController.updateProduct);
router.delete('/deleteProduct/:id',requireLoggedIn, isAdmin, productController.deleteProduct);

//product filter
router.post('/productFilter', productController.productFilter);
//search Product
router.get('/searchProduct/:keyword', productController.searchProduct);


//payement gateway token
router.get('/braintree/token', productController.braintreeToken)

//payements
router.post('/braintree/payment', requireLoggedIn, productController.braintreePayment)




module.exports = router;