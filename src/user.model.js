
const { Schema, model} = require("mongoose");
const UserSchema = new Schema({
    name:String,
    email: {
        type:String,
        unique :true
    },
    password : String,
    role:{
        type :String,
        enum : ["admin" , "writter", "user"],
        default : "user",
    },
});
const UserModel = model("user", UserSchema);

module.exports= UserModel;
