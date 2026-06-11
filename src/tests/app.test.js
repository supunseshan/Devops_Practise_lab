const request = require('supertest');
const { app, server } = require('../src/server');
const Task = require('../src/models/task');

afterAll(done => {
  server.close(done);
});

beforeEach(() => {
  Task.reset();
});

describe('GET /health', () => {
  test('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('version');
  });

  test('GET /health/ready returns ready', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});

describe('GET /', () => {
  test('returns app info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.app).toBe('TaskFlow');
  });
});

describe('POST /api/tasks', () => {
  test('creates a task with valid data', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Deploy to EKS', status: 'todo', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Deploy to EKS');
    expect(res.body.status).toBe('todo');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
  });

  test('uses default status and priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Setup Ansible' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('todo');
    expect(res.body.priority).toBe('medium');
  });

  test('rejects missing title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ status: 'todo' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('rejects invalid status', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test', status: 'invalid' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/tasks', () => {
  test('returns empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  test('returns all created tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task A' });
    await request(app).post('/api/tasks').send({ title: 'Task B' });
    const res = await request(app).get('/api/tasks');
    expect(res.body.count).toBe(2);
  });

  test('filters by status', async () => {
    await request(app).post('/api/tasks').send({ title: 'T1', status: 'done' });
    await request(app).post('/api/tasks').send({ title: 'T2', status: 'todo' });
    const res = await request(app).get('/api/tasks?status=done');
    expect(res.body.count).toBe(1);
    expect(res.body.tasks[0].title).toBe('T1');
  });
});

describe('GET /api/tasks/:id', () => {
  test('returns task by id', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Find me' });
    const res = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find me');
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/tasks/nonexistent-id');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/tasks/:id', () => {
  test('updates a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Update me' });
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/tasks/bad-id').send({ status: 'done' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  test('deletes a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/tasks/bad-id');
    expect(res.status).toBe(404);
  });
});

describe('404 handler', () => {
  test('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});
