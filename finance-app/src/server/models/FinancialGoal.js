import mongoose from 'mongoose';

const FinancialGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  progress: { type: Number, default: 0 },
});

const FinancialGoal = mongoose.model('FinancialGoal', FinancialGoalSchema);

export default FinancialGoal;
