const express = require('express');
const router = express.Router();
const control = require("../controllers/users");
const { authenticateJWT } = require("../middleware/authentication");

// Route to create a new user
router.post('/', async(req, res, next) => {
    try {
        const result = await control.createUser(req.knex, req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error('Failed to create account:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to update user
router.put('/:username', authenticateJWT, async(req, res, next) => {
    try {
        if (req.params.username !== req.user.username) {
            throw new Error(`${ req.user.username } cannot update the account ${ req.params.username }`);
        }
        const result = await control.updateUser(req.knex, req.params.username, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update account:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

// Route to get a user by their username
router.get('/:username', async(req, res, next) => {
    try {
        const result = await control.findUserByUsername(req.knex, req.params.username)
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to get account:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});


// Route to delete a user
router.delete('/:username', authenticateJWT, async(req, res, next) => {
    try {
        if (req.params.username !== req.user.username) {
            throw new Error(`${ req.user.username } cannot delete the account ${ req.params.username }`);
        }
        const result = await control.deleteUser(req.knex, req.user.username);
        res.status(204).end();
    } catch (err) {
        console.error('Failed to delete account:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

module.exports = router;