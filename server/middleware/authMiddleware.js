// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smarthire_jwt_secret_super_secure_key_2026_dev');
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User account not found.',
        data: null
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated by the Administrator.',
        data: null
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Token is invalid or expired.',
      data: null
    });
  }
};

// RBAC Middleware (FR1: Role-based Access Control)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Allowed roles: ${roles.join(', ')}`,
        data: null
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
