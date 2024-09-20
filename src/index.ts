import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors'; // Import cors
import authRoutes from './routes/authRoutes';
import './middleware/passport';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(session({ secret: process.env.JWT_SECRET as string, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res)=>{
  res.json({ message: 'Welcome to interviwe.ps!' });
});
app.use('/auth', authRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
