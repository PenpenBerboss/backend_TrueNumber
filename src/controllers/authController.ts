/**
 * Contrôleur d'authentification pour l'API TrueNumber Game
 * 
 * Gère l'inscription, la connexion et la déconnexion des utilisateurs
 * avec génération et validation de tokens JWT
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

/**
 * Génère un token JWT pour un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Token JWT signé
 */
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET non défini dans les variables d\'environnement');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

/**
 * POST /api/auth/register - Création d'un nouveau compte utilisateur
 * @param req - Requête contenant les données utilisateur (name, email, password)
 * @param res - Réponse avec le token et les informations utilisateur ou message d'erreur
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, phone } = req.body;

    // Validation des champs obligatoires
    if (!name || !username || !email || !password) {
      return res.status(400).json({ 
        message: 'Le nom, nom d\'utilisateur, email et mot de passe sont obligatoires' 
      });
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Vérification de l'unicité de l'email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ 
        message: 'Un utilisateur existe déjà avec cette adresse email' 
      });
    }

    // Vérification de l'unicité du nom d'utilisateur
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ 
        message: 'Ce nom d\'utilisateur est déjà utilisé' 
      });
    }

    // Création du nouvel utilisateur
    const user = await User.create({ name, username, email, password, phone });
    const token = generateToken(user.id.toString());

    // Réponse avec les données utilisateur et le token
    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur lors de la création du compte' 
    });
  }
};

/**
 * POST /api/auth/login - Connexion d'un utilisateur existant
 * @param req - Requête contenant email et mot de passe
 * @param res - Réponse avec le token et les informations utilisateur
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('Tentative de connexion pour:', email);

    // Validation des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'L\'email et le mot de passe sont obligatoires' 
      });
    }

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Identifiants invalides' 
      });
    }

    // Vérification du mot de passe
    const isValidPassword = await user.comparePassword(password);
    console.log('Mot de passe valide:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Identifiants invalides' 
      });
    }

    // Génération du token JWT
    const token = generateToken(user.id.toString());
    console.log('Token généré avec succès');

    // Réponse avec le token et les données utilisateur
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    console.error('Trace d\'erreur:', (error as Error).stack);
    res.status(500).json({ 
      message: 'Erreur interne du serveur lors de la connexion', 
      error: (error as Error).message 
    });
  }
};

/**
 * POST /api/auth/logout - Déconnexion de l'utilisateur
 * Note: La déconnexion se fait principalement côté client en supprimant le token
 * @param req - Requête de déconnexion
 * @param res - Confirmation de déconnexion
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // Dans cette implémentation simple, la déconnexion confirme seulement l'action
    // L'invalidation du token JWT se fait côté client en le supprimant
    // Pour une sécurité renforcée, on pourrait implémenter une blacklist de tokens
    res.json({ 
      message: 'Déconnexion réussie. Votre session a été fermée.' 
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur lors de la déconnexion' 
    });
  }
};