const express = require('express')
//const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { User, validateUser } = require('../models/user')
const _ = require('lodash');
const autherization = require('../middlewares/authorization')
const router = express.Router()



router.get('/', (req, res) => {
    res.send('auth hellow')
})



router.post('/register', async (req, res) => {

    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        user = new User({ // _.pick(req.body, ['name', 'email', 'password', 'role'])
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            pic:req.body.pic
        });

        // const salt = await bcrypt.genSalt(10);===>10
        user.password = await bcrypt.hash(user.password, 10);

        await user.save().then(user => {
            const newtoken = user.generateAuthToken();
            res
                .header('x-auth-token', newtoken)
                .header("access-control-expose-headers", "x-auth-token")
                .send(_.pick(user, ['_id', 'name', 'email']));

        }).catch(err => console.log('err in register save', err.message))

    } catch (err) {
        console.log('err in register', err.message)
    }




})


router.post('/signin', async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send('Invalid email or password.'); //custom validate


    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);




    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).send('Invalid email or password.');

            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        const newtoken = user.generateAuthToken();
                        const { _id, name, email,followers,following,pic} = user
                        console.log(newtoken)
                        res.json({ newtoken, user: { _id, name, email,followers,following,pic} })

                    } else {
                        return res.status(400).send('Invalid email or password.');
                    }
                }).catch(err => console.log('err', err.message))


        })
})




//get this for signin if we want to validator


// function validate(user) {
//     const schema = Joi.object().keys({

//         email: Joi.string().max(255).required().email(),
//         password: Joi.string().min(5).max(255).required()
//     });

//     return schema.validate(user);
// }

module.exports = router