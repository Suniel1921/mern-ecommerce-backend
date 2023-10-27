const productModel = require("../model/product");
const braintree = require("braintree");
const dotenv = require("dotenv");
const orderModel = require("../model/order");
dotenv.config();

//payment gateway integration (key)
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//payment gateway token
exports.braintreeToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment gateway payment
exports.braintreePayment = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {total += i.price});

    let newTransaction = gateway.transaction.sale({
        amount : total,
        PaymentMethodNonce : nonce,
        options : {
            submitForSettlement : true
        }
    },
    function (error, result){
        if(result){
            const order = new orderModel({
                products : cart,
                payment : result,
                buyer : req.user._id,
            }).save();
            res.json({ok :true})
        }
        else{
            res.status(500).send(error)

        }

    }
    )

  } catch (error) {
    console.log(error);
  }
};

// create products

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return res
        .status(400)
        .send({ success: false, message: "All Fields are required " });
    }

    if (!req.file || !req.file.filename) {
      return res
        .status(400)
        .send({ success: false, message: "Image file is required" });
    }

    const createProduct = await productModel({
      name,
      description,
      price,
      quantity,
      category,
      image: req.file.filename,
    });

    await createProduct.save();
    res
      .status(201)
      .send({ success: true, message: "Product Created", createProduct });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error While Creating Products ${error} `,
      });
  }
};

//get all product route
exports.allProducts = async (req, res) => {
  try {
    const allProduct = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({
        totalProduct: allProduct.length,
        success: true,
        message: "All products list",
        allProduct,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error while getting all products ${error}`,
      });
  }
};

// get single products
exports.singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProduct = await productModel.findById(id);
    res
      .status(200)
      .send({
        success: true,
        message: "single product sucessfully !",
        singleProduct,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while getting single products" });
  }
};

// //upate product route
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, quantity, price, image, category, shipping } =
      req.body;
    const { id } = req.params;
    const updateProduct = await productModel.findByIdAndUpdate(
      id,
      { name, description, quantity, price, category, image, shipping },
      { new: true }
    );
    res
      .status(200)
      .send({
        success: true,
        message: "Product updated successfully !",
        updateProduct,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error While Updating Products ${error}`,
      });
  }
};

//delete products
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await productModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "Product Deleted Successfully !" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while deleting Products !" });
  }
};

// //product filter
exports.productFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const productData = await productModel.find(args);
    res.status(200).send({ success: true, productData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error while filtering products ${error}`,
      });
  }
};

//search product

exports.searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: new RegExp(keyword, "i") } },
          { description: { $regex: new RegExp(keyword, "i") } },
        ],
      })
      .select("-image");
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Error while rearching product ${error}`,
      });
  }
};
