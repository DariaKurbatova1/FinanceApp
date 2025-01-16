import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors'; 
import Expense from './models/Expense.js'; 
import Income from "./models/Income.js";
import FinancialGoal from './models/FinancialGoal.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//connect to db
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

//define user model
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

//route to register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    //check if user exists already
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    //create user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
  
    await newUser.save()
      .then(() => {
        res.status(201).json({ message: 'User created successfully' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error creating user' });
      });
});

//route for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  //verify user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  //check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Access denied' });
    req.user = user;
    next();
  });
};
//route to get expenses for user
app.get('/api/expenses', verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const expenses = await Expense.find({
      userId: req.user.userId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

//route to add expense
app.post('/api/expenses', verifyToken, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!['food', 'transportation', 'entertainment', 'shopping'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const newExpense = new Expense({
      userId: req.user.userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

//route to delete expense
app.delete('/api/expenses/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, userId: req.user.userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.deleteOne({ _id: id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

//add income route 
app.post('/api/incomes', verifyToken, async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    if (!source || !amount) {
      return res.status(400).json({ message: 'Source and amount are required.' });
    }

    const newIncome = new Income({
      userId: req.user.userId,
      source,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});
//get incomes route
app.get('/api/incomes', verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {
      userId: req.user.userId,
    };

    if (month && year) {
      query.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }

    const incomes = await Income.find(query);
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});
//delete income route
app.delete('/api/incomes/:id', async (req, res) => {
  try {
    const incomeId = req.params.id;
    const result = await Income.deleteOne({ _id: incomeId });
    if (result.deletedCount > 0) {
      res.status(200).send({ message: 'Income deleted successfully' });
    } else {
      res.status(404).send({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting income', error });
  }
});
//add financial goal route
app.post('/api/financial-goals', verifyToken, async (req, res) => {
  try {
    const { name, targetAmount, startDate, endDate } = req.body;

    const newGoal = new FinancialGoal({
      userId: req.user.userId,
      name,
      targetAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: 'Error adding financial goal', error: err });
  }
});
//update goal route
app.put('/api/financial-goals/:id', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await FinancialGoal.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.progress += amount;
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Error updating goal progress', error: err });
  }
});
//get goals route
app.get('/api/financial-goals', verifyToken, async (req, res) => {
  try {
    const goals = await FinancialGoal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching goals', error: err });
  }
});
//delete goal route
app.delete('/api/financial-goals/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await FinancialGoal.findOne({ _id: id, userId: req.user.userId });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await FinancialGoal.deleteOne({ _id: id });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting goal', error: err });
  }
});

//start server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
