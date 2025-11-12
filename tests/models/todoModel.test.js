import Todo from 'server/models/todoModel.js';
import mongoose from 'mongoose';

describe('Todo Model', () => {
  it('should create a todo with required fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    const todo = await Todo.create({
      text: 'Test todo',
      date: '2024-01-15',
      user: userId,
    });

    expect(todo.text).toBe('Test todo');
    expect(todo.date).toBe('2024-01-15');
    expect(todo.user).toEqual(userId);
  });

  it('should use default values', async () => {
    const userId = new mongoose.Types.ObjectId();
    const todo = await Todo.create({
      text: 'Test',
      date: '2024-01-15',
      user: userId,
    });

    expect(todo.rating).toBe(2);
    expect(todo.checked).toBe(false);
    expect(todo.sets).toBe(4);
    expect(todo.reps).toBe(10);
    expect(todo.hpRemaining).toBe(2);
    expect(todo.exercise).toBe('');
    expect(todo.weight).toBe('');
  });

  it('should fail without required fields', async () => {
    const todo = new Todo({});
    
    await expect(todo.save()).rejects.toThrow();
  });

  it('should have timestamps', async () => {
    const userId = new mongoose.Types.ObjectId();
    const todo = await Todo.create({
      text: 'Test',
      date: '2024-01-15',
      user: userId,
    });

    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });
});