exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    return res.status(401).json({ message: 'Belum login' });
  };
  
exports.isAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Hanya admin yang diizinkan' });
  };
  