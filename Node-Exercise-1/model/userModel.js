const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: [true,"First Name is reuired"]
    },
    secondName:{
        type:String,
        required: [true,"First Name is reuired"]
    }
})

const User = mongoose.model('User',userSchema);

module.exports = User;

