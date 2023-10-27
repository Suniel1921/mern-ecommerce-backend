const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const databse = require("./database/dbConn");
const router = require("./routes/router");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoute");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());
app.use("", router);
app.use("", categoryRoutes);
app.use("", productRoutes);

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

//for fontend and backend deployment (this is bad practice )
app.use(express.static("dist"));

// app.use('*', function(req ,res){
//   res.sendFile(path.join(__dirname, './dist/index.html'))
// })

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port no : ${PORT}`);
});
