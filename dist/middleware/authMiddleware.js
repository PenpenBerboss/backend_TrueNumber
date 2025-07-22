"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
/**
 * Middleware d'authentification par token JWT
 * Vérifie la validité du token d'accès et ajoute les informations utilisateur à la requête
 *
 * @param req - Requête HTTP avec interface AuthRequest
 * @param res - Réponse HTTP
 * @param next - Fonction next pour passer au middleware suivant
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token d\'accès requis' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Token invalide - utilisateur non trouvé' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        console.error('Erreur de vérification du token:', error);
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware de vérification des droits administrateur
 * Vérifie que l'utilisateur authentifié possède le rôle admin
 *
 * @param req - Requête HTTP avec interface AuthRequest
 * @param res - Réponse HTTP
 * @param next - Fonction next pour passer au middleware suivant
 */
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès administrateur requis' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
