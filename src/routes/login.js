const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const { sendWelcomeEmail } = require('../emails/account');
const auth = require('../middlewares/auth');
const request = require('request');

router.post('/users', async(req, res) => {

    try {
        console.log(req.body)
        const exist = await User.findOne({email: req.body.email});
        if (exist) {
            const token = await exist.generateAuthToken();
            return res.send({ user: exist, token })
        } else {
            const user = new User(req.body);
 
            await user.save();
            // sendWelcomeEmail(user.email, user.name);
            const token = await user.generateAuthToken();
            res.status(201).send({ user, token });
        }

    } catch (error) {
        res.status(400).send(error);
    }

});

router.post('/user/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        console.log(req.body)
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.patch('/user/me', auth, async(req, res) => {
    const _id = req.user._id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'direccion', 'cuidad', 'nombre_empresa'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        // const user = await User.findById(_id);

        updates.forEach((x) => req.user[x] = req.body[x]);

        await req.user.save();

        //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        res.send(req.user);
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

router.get('/image', (req, res) => {
    const url = "http://localhost:8080/api/files/login.jpg";
    let er;

    request({ url, json: true }, (error, { body }) => {
        try {
            res.end(body)
        } catch (er) {

        }

    });
})



module.exports = router;