const mongoose = require("mongoose");

const emiSchema = new mongoose.Schema(
  {
    EMI: { type: Number, required: true },
    principal: { type: Number, required: true },
    rate: { type: Number, required: true },
    time: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const EMIModel = mongoose.model("emi", emiSchema);

module.exports = { EMIModel };
