const jwt = require('jsonwebtoken');
const { User } = require('../models/user')


const auth = async (req, res, next) => {

    const token = await req.header('x-auth-token');
    //console.log('btoken', token)
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = await jwt.verify(token, 'bpsk');
        const { _id } = decoded
        await User.findById(_id).then(userdata => {
            userdata.password = undefined
            req.user = userdata;

            next();
        })

    }
    catch (ex) {
        res.status(400).send('Invalid token.');
        console.log(ex.message)
    }
}

module.exports = auth