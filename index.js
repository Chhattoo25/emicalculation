const express = require("express");
var cors = require('cors')
const { connection } = require("./config/db");
const { UserModel } = require("./models/UserModel");
const {EMIMode} = require("./models/EMIModel")
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const { authentication } = require("./middleware/authentication");
require("dotenv").config()
const app = express();
const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(cors())
app.get("/", (req, res) => {
  res.send("WELCOME");
});

//SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    res.send({"msg":"User already exist,logging in"});
  }
  else{

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        res.send({msg:"Something went wrong, please try again later"});
      }
      const new_user = new UserModel({
        name,
        email,
        password: hash,
      });
  
      try {
        await new_user.save();
        res.send({ msg: "signup successfully", password: hash });
      } catch (err) {
        res.send({"msg":"something went wrong please try again"})
      }
    });
  }
});

//LOGIN

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
   const hashed_password = user.password
const user_id = user._id

  bcrypt.compare(password, hashed_password, function (err, result) {
if(err){
 res.send({"mag":"something went wrong,try again later"})
}
const token = jwt.sign({ user_id: user_id }, process.env.SECRET_KEY);
if(result){
 res.send({msg:"Login successfully",token})
}
else{
res.send({"msg":"Login Failed"})
}
  });
});


app.get("/getprofile", authentication, async(req,res)=>{
 const {user_id} = req.body
 const user = await UserModel.findOne({_id:user_id})
const {name,email} = user
 res.send({name,email})
})

app.post("/calculateEMI",authentication,async(req,res)=>{
  const {amount,intrest_rate,tenure, user_id} = req.body;
  const loan_amount  = Number(amount)
   const  EMI = loan_amount * intrest_rate *( 1 + intrest_rate )**tenure/ ( ( 1 + intrest_rate )**tenure - 1 ) 
  const new_EMI = new EMIModel({
     EMI,
    amount:amount,
    intrest_rate,
    tenure,
    user_id:user_id
  })
  await new_EMI.save()
  console.log(EMI)
  res.send({EMI})
  })



app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db successfully");
  } catch (err) {
    console.log(err);
    console.log("err from connected to DB");
  }
  console.log("http://localhost:8080");
});
