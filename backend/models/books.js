const mongoose= require("mongoose");
const order= new mongoose.Schema({
    url:{
        type:String,
        required:true,
    },
    tittle:{
        type:String,
        required :true,
    },
    author:{
        type:String,
        required :true,
    },
    desc:{
        type:String,
        required :true,
    },
    language:{
        type:String,
        required :true,
    },
    price:{
        type:Number,
        required :true,
    },
},{timestamps:true});
module.exports = mongoose.model("books",books);