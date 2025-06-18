const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get todos
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add todo
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const newTodo = {
            id: Date.now().toString(),
            text: req.body.text,
            completed: false
        };
        user.todos.push(newTodo);
        await user.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle todo
router.put('/:id/toggle', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const todo = user.todos.find(t => t.id === req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todo.completed = !todo.completed;
        await user.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete todo
router.delete('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.todos = user.todos.filter(t => t.id !== req.params.id);
        await user.save();
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;