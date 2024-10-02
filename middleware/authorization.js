const admin = require("firebase-admin");
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; 
 

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    // console.log(req.user)
    next();
  } catch (error){
    console.error('Error verifying Firebase token:', error);
    return res.status(401).json({ message: 'Unauthorized, invalid token' });
  }
};


// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');

const verifyFirebaseCookie = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  // console.log(req.cookies)

  if (!token) {
    return res.status(400).json({ message: 'Bad request: no cookies found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log('Decoded JWT:', req.user);
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
});

module.exports = { verifyFirebaseCookie };


module.exports = { verifyFirebaseToken , verifyFirebaseCookie };
