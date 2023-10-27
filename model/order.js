const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        // type : mongoose.objectId,
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    payment: {},

    buyer: {
      // type : mongoose.objectId,
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },

    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Deliverd", "Cancel"],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
