const categoryModel = require("../model/category");
const slugify = require ('slugify');


//create category
exports.createCategory = async (req, res)=>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({success : false, message : 'Name is required '})
        }
        const exitingCategory = await categoryModel.findOne({name});
        if(exitingCategory){
            return res.status(400).send({success : false, message : 'Category Alredy Exit',exitingCategory});
        }
        const categorySave =  new categoryModel({name, slug:slugify(name)});
        await categorySave.save();
        res.status(201).send({success : true, message : 'New Category Created',categorySave})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false, message : 'Error while creating category',error})
        
    }

}



//get all category
exports.getAllCategory = async (req, res)=>{
    try {
        const allCategory = await categoryModel.find({});
        res.status(200).send({success : true, message : 'All Category List !', allCategory})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false, message : 'Error while getting all Category',error})
        
    }

}

//get single category 
exports.singleCategory = async (req, res)=>{
    // const {id} = req.params;
    const {id} = req.params;
    const singleCategory = await categoryModel.findById(id);
    res.status(200).send({success : true, message : 'Single category list', singleCategory});
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false , message : 'Error while getting single category'})
        
    }
}



//update category
exports.updateCategory = async (req, res)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const updateCategory = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true});
        res.status(200).send({success : true, message : 'Category Upated !', updateCategory})
         
    } catch (error) {
        console.log(error)
        res.status(500).send({sucess : false , message : 'Error while  updating category'})
        
    }

}

//delete category
exports.deleteCategory = async (req, res)=>{
    try {
        const {id} = req.params;
        const deleteCategory = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({success : true, message : 'Category Deleted !'})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false, message : 'Error while Deleteing category'})
        
    }

}