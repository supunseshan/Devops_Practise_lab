const { v4: uuidv4 } = require('uuid');

let tasks = [
    { id: uuidv4(), title: 'Set up AWS VPC', status: 'done', priority: 'high', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Configure Jenkins CI/CD', status: 'in-progress', priority: 'high', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Write Ansible playbooks', status: 'todo', priority: 'medium', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Deploy to EKS cluster', status: 'todo', priority: 'high', createdAt: new Date().toISOString() }
    ];

const getAll = () => tasks;

const getById = (id) => tasks.find(t => t.id === id) || null;

const create = ({ title, status = 'todo', priority = 'medium' }) => {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        throw new Error('Title is required');
        }
const validStatuses = ['todo', 'in-progress', 'done'];
const validPriorities = ['low', 'medium', 'high'];
if (!validStatuses.includes(status)) throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
if (!validPriorities.includes(priority)) throw new Error(`Priority must be one of: ${validPriorities.join(', ')}`);

const task = { id: uuidv4(), title: title.trim(), status, priority, createdAt: new Date().toISOString() };
tasks.push(task);
return task;
};

const update = (id, updates) => {
const index = tasks.findIndex(t => t.id === id);
if (index === -1) return null;
const validStatuses = ['todo', 'in-progress', 'done'];
const validPriorities = ['low', 'medium', 'high'];
if (updates.status && !validStatuses.includes(updates.status)) throw new Error('Invalid status');
if (updates.priority && !validPriorities.includes(updates.priority)) throw new Error('Invalid priority');
tasks[index] = { ...tasks[index], ...updates, id, updatedAt: new Date().toISOString() };
return tasks[index];
};

const remove = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
    };

const reset = () => { tasks = []; };

module.exports = { getAll, getById, create, update, remove, reset };