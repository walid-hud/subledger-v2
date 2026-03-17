import { validateToken, verifyToken } from "../services/jwt.service.js";
import { UnauthorizedError } from "../utils/errors.js";
import { JwtUserSchema } from "../schemas/index.js";

export const authenticate = async (req, res, next) => {
  const token = req.token;
  if (!token) throw new UnauthorizedError("No token provided");
  const decoded = verifyToken(token);
  if (!decoded) return next(new UnauthorizedError("Invalid token"));
  const user = validateToken(decoded, JwtUserSchema);
  
  Object.assign(req, { user }); 
  next();
};

export const authorize = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role))
      return next(new UnauthorizedError("User not authorized"));
    next();
  };
};

export const requireToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new UnauthorizedError("No token provided"));
  Object.assign(req, { token }); 
  next();
};
