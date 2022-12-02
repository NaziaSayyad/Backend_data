require("dotenv").config();
const express = require(`express`);
const mongoose = require("mongoose")
const UserModel = require("./user.model");
const jwt = require("jsonwebtoken");

const app = express();
const SIGN = process.env.SIGN

app.use(express.json());
app.use(express.urlencoded({ extended :true}))

app.get(`/` ,(req,res) => res.send(`Hello World I am going to start my blogging Site `) );

app.get(`/users` ,(req,res) => res.send(`This is user page  `) );

app.post("/signup", async (req,res) =>{
    const {name,email,password} = req.body;
    const user = new UserModel({ name,email,password});
    await user.save();
    return res.status(201).send("User created sucessfully");
});

app.post("/signup/writer" ,async (req,res) =>{
    const {name,email,password} = req.body;
    const token = req.headers['authorization'];
    if(!token){
        return res.status(403).send("You do not have acess to create a writer");
    }
        try{
            const decoded = jwt.decode(token);
            // console.log(decoded.role);
            if(decoded && decoded.role === 'admin'){
                const writer =  new UserModel({name,email,password, role : 'writter'});
                await writer.save();
                return res.send("Writer Created Sucessfully")
            }
            else{
                return res.status(403).send("not allow to create a writer ")
            }
        } 
        catch(e){
            console.log("erroris:", e);
            res.send("Non Admin try to create a writer");
        }
    
    

})

app.post("/login" ,async (req,res) =>{
    const {email, password}  = req.body;
    const find_user = await UserModel.findOne({email,password});
     if(find_user){
    const token = jwt.sign(
        {id: find_user.id, name : find_user.name, role : find_user.role},
        SIGN,
        {
            expiresIn : "5 days"
        }
    );
    return res.send({message : "Login Sucess", token});

    }
        return res.status(401).send("Invalid Credentials");
});

// mongodb+srv://Nazia:Dob1062000@cluster0.p4xc33c.mongodb.net/?retryWrites=true&w=majority

// mongodb://localhost:27017/Bloging  
mongoose.connect("mongodb+srv://Nazia:Dob1062000@cluster0.p4xc33c.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: "true",
  useUnifiedTopology: "true"
}).then(() =>{
    app.listen(8080 , () => 
    {console.log(`Server started on port 8080`);
 })
}).catch((err) => console.log(err));
   