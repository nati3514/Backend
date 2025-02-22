const jwt = require ('jsonwebtoken');
const config = require ('../config/index');
const JWT_SECRET = config.JWTSECRET;

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header
  
    if (token == null) {
      return res.status(401).json({message:'Unauthorized'}); // Unauthorized
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({message:'Forbidden'}); // Forbidden
      }
      
      req.user = user; // Attach user information to the request object
      next();
    });
  };