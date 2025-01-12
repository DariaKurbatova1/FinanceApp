import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model("Income", IncomeSchema);
