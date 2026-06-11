const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    node: process.version
    });
});

router.get('/ready', (req, res) => {
    res.json({ status: 'ready' });
});

module.exports = router;