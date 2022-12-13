const mongoose = require('mongoose');

const emiSchema = new mongoose.Schema({
 EMI :{type:Number,required:true},
 amount :{type:Number,required:true},
 intrest_rate :{type:String,required:true},
 tenure :{type:String,required:true},
 user_id:{type:String,required:true}
},{
 timestamps:true,
 versionKey:false
})
const EMIModel = mongoose.model("emi",emiSchema)

module.exports = {
EMIModel
}