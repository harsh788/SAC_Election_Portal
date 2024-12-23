const jwt = require('jsonwebtoken');

// Middleware function to check authorization
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Extract the token from the "Bearer <token>" format
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {return res.status(401).json({message: "Access denied: No token provided"});}

    jwt.verify(token, 'helloworld' /*JWT_SECRET*/ , (err, user) => {
        if(err) {return res.status(403).json({message: 'Invalid token'});}

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;