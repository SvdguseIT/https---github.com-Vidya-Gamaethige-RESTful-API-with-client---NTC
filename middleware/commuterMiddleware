const commuterMiddleware = (req, res, next) => {
    if (req.user.role !== 'commuter') {
      return res.status(403).json({ error: 'Access denied. Commuter privileges required.' });
    }
    next();
  };
  
  module.exports = { commuterMiddleware };
  
