const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log(token);
  if (!token) {
    return res.json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.username = decoded.username;
    next();
  });
};
