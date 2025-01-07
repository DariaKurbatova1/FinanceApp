import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors'; 
import Expense from './models/Expense.js'; 

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

//start server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
