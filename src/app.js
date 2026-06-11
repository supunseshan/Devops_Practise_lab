const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({
    app: 'TaskFlow',
    version: '1.0.0',
    status: 'running',
    docs: '/api/tasks'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
    console.log(`TaskFlow running on port ${PORT}`);
});

module.exports = { app, server };