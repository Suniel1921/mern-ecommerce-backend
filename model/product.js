const mongoose = require ('mongoose');
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    // slug: {
    //     type : String,
    //     required : true,
    // },
    description : {
        type : String,
        required : true,
    },
    price : {
        type : String,
        required : true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
      },
      
    quantity : {
        type : Number,
        required : true,
    },
    image : {
        // data : Buffer,
        // contentType : String,
        type : String,
    },
    shipping : {
        type : Boolean,
    }


},{timestamps: true})


const productModel = mongoose.model('product', productSchema);
module.exports = productModel;