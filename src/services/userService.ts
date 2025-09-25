import { pool } from '../db';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

export class UserService {
  async createUser(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hashedPassword]
      );
    } catch (error) {
      throw new Error('User already exists');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}