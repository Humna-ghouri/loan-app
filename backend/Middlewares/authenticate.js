// import jwt from 'jsonwebtoken';

// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ message: 'Access denied' });
//   }
//   try {
//     const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRETKEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// };

// export default authenticate;
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

export default authMiddleware;