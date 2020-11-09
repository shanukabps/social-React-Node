const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config');
const { ObjectId } = mongoose.Schema.Types;


const userSchema = new mongoose.Schema({
    name: {
        type: String,

        default: 'user',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }, role: {
        type: Number,
        default: 0,
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
       following:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
         default:"https://res.cloudinary.com/dcfrl1b41/image/upload/v1604859654/default_zshjyn.png" 
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, 'bpsk')
    return token;
}


function validateUser(user) {
    const schema = Joi.object().keys({
        name: Joi.string().max(50),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(255).required(),
        pic:Joi.string()
    });

    return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;