const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"name is required"]
  },
  username:{
    type:String,
    required:[true,"username is required"],
    minLength:[3,"the username must be 3 charecters or more"],
    unique:[true,"The username is taken, try another one"]
  },
  passwordHash:{
    type:String,
    required:[true,"password is required"]
  },
  blogs:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Blog'
    }
  ]
})

const User = mongoose.model('User',userschema)

module.exports = User