// tests/routes/todoRoutes.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import todoRoutes from 'server/routes/todo.js';
import User from 'server/models/userModel.js';
import Todo from 'server/models/todoModel.js';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Todo Routes Integration', () => {
  let token;
  let userId;
  let user;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
    user = await User.create({
      _id: userId,
      email: 'test@example.com',
      password: 'hashedpassword',
    });
    token = jwt.sign({ _id: userId }, process.env.SECRET);
  });

  describe('GET /api/todos/all', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/todos/all');
      expect(res.status).toBe(401);
    });

    it('should get all todos with valid token', async () => {
      await Todo.create({
        text: 'Test todo',
        date: '2024-01-15',
        user: userId,
      });

      const res = await request(app)
        .get('/api/todos/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].text).toBe('Test todo');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'New todo',
          date: '2024-01-15',
          exercise: 'Running',
        });

      expect(res.status).toBe(201);
      expect(res.body.text).toBe('New todo');
      expect(res.body.exercise).toBe('Running');
    });

    it('should require text and date', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'New todo',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = await Todo.create({
        text: 'To delete',
        date: '2024-01-15',
        user: userId,
      });

      const res = await request(app)
        .delete(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Todo deleted');

      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('should update a todo', async () => {
      const todo = await Todo.create({
        text: 'Original',
        date: '2024-01-15',
        user: userId,
      });

      const res = await request(app)
        .patch(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 'Updated', checked: true });

      expect(res.status).toBe(200);
      expect(res.body.text).toBe('Updated');
      expect(res.body.checked).toBe(true);
    });
  });
});