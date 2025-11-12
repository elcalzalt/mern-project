import mongoose from 'mongoose';
import todoController from 'server/controllers/todoController.js';
import Todo from 'server/models/todoModel.js';

const {
  createTodo,
  deleteTodo,
  getTodosByDate,
  updateTodo,
  getAllTodos,
  updateHpByDate,
} = todoController;

describe('Todo Controller', () => {
  let mockReq;
  let mockRes;
  let userId;

  beforeEach(() => {
    userId = new mongoose.Types.ObjectId();
    mockReq = {
      user: { _id: userId },
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createTodo', () => {
    it('should create a new todo successfully', async () => {
      mockReq.body = {
        text: 'Complete workout',
        date: '2024-01-15',
        exercise: 'Push-ups',
        sets: 3,
        reps: 15,
      };

      await createTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Complete workout',
          date: '2024-01-15',
          user: userId,
        })
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = null;
      mockReq.body = { text: 'Test', date: '2024-01-15' };

      await createTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
    });

    it('should return 400 if text is missing', async () => {
      mockReq.body = { date: '2024-01-15' };

      await createTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Text and date are required',
      });
    });

    it('should return 400 if date is missing', async () => {
      mockReq.body = { text: 'Test todo' };

      await createTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Text and date are required',
      });
    });

    it('should use default values for optional fields', async () => {
      mockReq.body = {
        text: 'Simple todo',
        date: '2024-01-15',
      };

      await createTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: 2,
          checked: false,
          sets: 4,
          reps: 10,
          hpRemaining: 2,
        })
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      const todo = await Todo.create({
        text: 'Test todo',
        date: '2024-01-15',
        user: userId,
      });

      mockReq.params = { id: todo._id.toString() };

      await deleteTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Todo deleted',
        todo: expect.objectContaining({ text: 'Test todo' }),
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = null;
      mockReq.params = { id: new mongoose.Types.ObjectId().toString() };

      await deleteTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
    });

    it('should return 400 if id is invalid', async () => {
      mockReq.params = { id: 'invalid-id' };

      await deleteTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid todo id',
      });
    });

    it('should return 404 if todo not found', async () => {
      mockReq.params = { id: new mongoose.Types.ObjectId().toString() };

      await deleteTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Todo not found',
      });
    });

    it('should not delete todo belonging to another user', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const todo = await Todo.create({
        text: 'Other user todo',
        date: '2024-01-15',
        user: otherUserId,
      });

      mockReq.params = { id: todo._id.toString() };

      await deleteTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Todo not found',
      });
    });
  });

  describe('getTodosByDate', () => {
    it('should get todos by date successfully', async () => {
      await Todo.create([
        { text: 'Todo 1', date: '2024-01-15', user: userId },
        { text: 'Todo 2', date: '2024-01-15', user: userId },
        { text: 'Todo 3', date: '2024-01-16', user: userId },
      ]);

      mockReq.params = { date: '2024-01-15' };

      await getTodosByDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Todo 1' }),
          expect.objectContaining({ text: 'Todo 2' }),
        ])
      );
      expect(mockRes.json.mock.calls[0][0]).toHaveLength(2);
    });

    it('should handle URL encoded dates', async () => {
      await Todo.create({
        text: 'Test',
        date: '2024-01-15',
        user: userId,
      });

      mockReq.params = { date: encodeURIComponent('2024-01-15') };

      await getTodosByDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ text: 'Test' })])
      );
    });

    it('should return empty array if no todos for date', async () => {
      mockReq.params = { date: '2024-01-15' };

      await getTodosByDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should return 401 if not authenticated', async () => {
      mockReq.user = null;
      mockReq.params = { date: '2024-01-15' };

      await getTodosByDate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      const todo = await Todo.create({
        text: 'Original text',
        date: '2024-01-15',
        user: userId,
      });

      mockReq.params = { id: todo._id.toString() };
      mockReq.body = { text: 'Updated text', checked: true };

      await updateTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Updated text',
          checked: true,
        })
      );
    });

    it('should return 404 if todo not found', async () => {
      mockReq.params = { id: new mongoose.Types.ObjectId().toString() };
      mockReq.body = { text: 'Updated' };

      await updateTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if id is invalid', async () => {
      mockReq.params = { id: 'invalid' };
      mockReq.body = { text: 'Updated' };

      await updateTodo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllTodos', () => {
    it('should get all todos for user', async () => {
      await Todo.create([
        { text: 'Todo 1', date: '2024-01-15', user: userId },
        { text: 'Todo 2', date: '2024-01-16', user: userId },
        { text: 'Todo 3', date: '2024-01-14', user: userId },
      ]);

      await getAllTodos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json.mock.calls[0][0]).toHaveLength(3);
    });

    it('should sort todos by date', async () => {
      await Todo.create([
        { text: 'Todo 1', date: '2024-01-16', user: userId },
        { text: 'Todo 2', date: '2024-01-14', user: userId },
        { text: 'Todo 3', date: '2024-01-15', user: userId },
      ]);

      await getAllTodos(mockReq, mockRes);

      const todos = mockRes.json.mock.calls[0][0];
      expect(todos[0].date).toBe('2024-01-14');
      expect(todos[1].date).toBe('2024-01-15');
      expect(todos[2].date).toBe('2024-01-16');
    });

    it('should only return todos for authenticated user', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      await Todo.create([
        { text: 'My todo', date: '2024-01-15', user: userId },
        { text: 'Other todo', date: '2024-01-15', user: otherUserId },
      ]);

      await getAllTodos(mockReq, mockRes);

      const todos = mockRes.json.mock.calls[0][0];
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('My todo');
    });
  });

  describe('updateHpByDate', () => {
    it('should update HP for all todos on a date', async () => {
      await Todo.create([
        { text: 'Todo 1', date: '2024-01-15', user: userId, hpRemaining: 2 },
        { text: 'Todo 2', date: '2024-01-15', user: userId, hpRemaining: 2 },
        { text: 'Todo 3', date: '2024-01-16', user: userId, hpRemaining: 2 },
      ]);

      mockReq.params = { date: '2024-01-15' };
      mockReq.body = { hpRemaining: 5 };

      await updateHpByDate(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        hpRemaining: 5,
      });

      const updatedTodos = await Todo.find({ date: '2024-01-15', user: userId });
      updatedTodos.forEach((todo) => {
        expect(todo.hpRemaining).toBe(5);
      });

      const unchangedTodo = await Todo.findOne({ date: '2024-01-16' });
      expect(unchangedTodo.hpRemaining).toBe(2);
    });

    it('should successfully update when no matching todos exist', async () => {
  mockReq.params = { date: '2024-01-15' };
  mockReq.body = { hpRemaining: 5 };

  await updateHpByDate(mockReq, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({
    success: true,
    hpRemaining: 5,
        });
    });
  });
});