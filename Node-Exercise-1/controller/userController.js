const { findById } = require("../model/userModel");
const User = require("../model/userModel")

    exports.createUser = async(req,res,next)=> {
        try {
            const newUser = await User.create({
                firstName:req.body.firstName,
                secondName:req.body.secondName,
            })
            return res.status(200).json({ data:newUser });
        } catch(err) {
            console.log(err.message);
            return res.status(400).send("Failed")
        }
    }

    exports.createMultipleUsers = async(req,res,next)=> {
        try {
            
            const users = req.body;
            const usersAdded = await User.insertMany(users);
            return res.status(200).send({data:usersAdded})
        } catch(err) {
            console.log(err.message);
            return res.status(400).send("Failed");
        }
    }

    exports.getUser = async(req,res,next) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json({
                status:"success",
                data: user
            })
        } catch(err) {
            res.status(404).json({msg:"Failed",msg2:err.message})
        }
    }

    exports.getAllUsers = async(req,res,next) => {
        try {
            const users = await User.find();
            res.status(200).json({
                status:"sucess",
                data:users
            })
        } catch(err) {
            res.status(404).json({msg:"Failed"})
        }

    }

    exports.deleteUser = async(req,res,next) => {
        try {
            const doc = await User.findByIdAndRemove(req.params.id);
            if(!doc) {
                throw new Error()
            }
            res.status(204).send();
        } catch(err) {
            res.status(404).json({msg:"Data not found"});
        }
    }

    exports.updateUser = async(req,res,next) => {
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:{
                    firstName:req.query.firstName,
                    secondName:req.query.secondName
                }
            },{new:true})
            res.status(200).json({msg:"success",data:user})
        } catch(err) {
            res.status(404).json({msg:"failed",reason:err.message})
        }
    }