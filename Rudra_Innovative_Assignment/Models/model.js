const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({
    userName:{type:String,required:true},
    password:{type:String,required:true},
    token:{type:String,default:''}
})
const userModel=mongoose.model('RudraUser',userSchema);
module.exports={userModel}