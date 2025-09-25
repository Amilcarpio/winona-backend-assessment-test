import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      
      const user = await this.userService.findUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}