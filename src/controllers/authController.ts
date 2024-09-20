import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password || '')) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
};
