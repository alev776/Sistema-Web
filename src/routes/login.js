const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const { sendWelcomeEmail } = require('../emails/account');
const auth = require('../middlewares/auth');

router.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });

    } catch (error) {
        res.status(400).send(error);
    }

});

router.post('/user/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.post('/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(x => x.token !== req.token);
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/user/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await res.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/user', auth, async(req, res) => {

    try {
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;