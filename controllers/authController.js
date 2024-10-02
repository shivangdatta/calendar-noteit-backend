const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'I_dont_want_extra_security';

const loginHandler = asyncHandler(async (req, res) => {
    // const authHeader = req.headers.authorization || '';
    // const idToken = authHeader.split(' ')[1]; 

    // if (!idToken) {
    //     return res.status(400).json({ message: 'Access id token was not sent in the body' });
    // }

    const idToken = req.user

    try{
        const idJWT = jwt.sign(
            { 
                idToken ,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );   
        res.cookie('jwt', idJWT, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });  
        return res.status(200).json({ message: 'Login successful' });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message : err})
    }
});

const logoutHandler = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });

    res.json({ message: 'Cookie cleared' });
});

module.exports = { loginHandler, logoutHandler };
