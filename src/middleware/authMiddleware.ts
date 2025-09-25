import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No valid token provided" });
  }

  const token = authHeader.substring(7);

  try {
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
