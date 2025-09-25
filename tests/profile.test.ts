import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';
import profileRoutes from '../src/routes/profile';
import { pool } from '../src/db';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/', profileRoutes);

describe('Profile Routes', () => {
  let authToken: string;

  beforeAll(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `);
  });

  afterAll(async () => {
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM users');

    await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return error without authorization header', async () => {
      const response = await request(app)
        .get('/profile')
        .expect(401);

      expect(response.body.error).toBe('No valid token provided');
    });

    it('should return error with invalid token format', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'InvalidTokenFormat')
        .expect(401);

      expect(response.body.error).toBe('No valid token provided');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      expect(response.body.error).toBe('Invalid token');
    });

    it('should return error without Bearer prefix', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', authToken)
        .expect(401);

      expect(response.body.error).toBe('No valid token provided');
    });
  });
});