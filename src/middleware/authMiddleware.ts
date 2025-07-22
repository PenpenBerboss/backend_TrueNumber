import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

/**
 * Interface pour les requêtes authentifiées
 * Étend la requête Express standard avec les informations utilisateur
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware d'authentification par token JWT
 * Vérifie la validité du token d'accès et ajoute les informations utilisateur à la requête
 * 
 * @param req - Requête HTTP avec interface AuthRequest
 * @param res - Réponse HTTP
 * @param next - Fonction next pour passer au middleware suivant
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Token invalide - utilisateur non trouvé' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware de vérification des droits administrateur
 * Vérifie que l'utilisateur authentifié possède le rôle admin
 * 
 * @param req - Requête HTTP avec interface AuthRequest
 * @param res - Réponse HTTP
 * @param next - Fonction next pour passer au middleware suivant
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  next();
};