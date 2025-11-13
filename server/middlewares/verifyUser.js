export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    req.user = null;
    return res.status(401).json({ authenticated: false, message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data to request
    next(); // allow request to continue
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: "Invalid token" });
  }
};