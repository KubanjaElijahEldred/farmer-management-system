import { Request, Response } from 'express';
import { getDb } from '../config/db';
import { User } from '../models/User';

export class AuthController {
  async login(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }

      const db = getDb();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // In a real app, you would hash and compare passwords
      // For now, we'll do a simple comparison (not secure for production)
      if (user.password_hash !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // Remove password from response
      const { password_hash, ...userResponse } = user;

      res.json({
        success: true,
        message: 'Login successful',
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async register(req: Request, res: Response): Promise<Response | void> {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password || !role) {
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
      }

      const validRoles = ['farmer', 'field_officer', 'finance', 'manager'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid role specified' 
        });
      }

      const db = getDb();
      
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }

      // Create new user
      const newUser: Omit<User, '_id'> = {
        name,
        email,
        role,
        password_hash: password, // In production, hash this password
        created_at: new Date()
      };

      const result = await db.collection('users').insertOne(newUser);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        userId: result.insertedId
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
