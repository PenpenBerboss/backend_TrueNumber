"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jsonwebtoken_1.default.sign({ id: userId }, secret, { expiresIn: '30d' });
};
// POST /api/auth/register - Création d'un nouveau compte utilisateur
// Corps de la requête : { "username": "...", "email": "...", "password": "...", "phone": "..." }
// Réponse : { "message": "Compte créé avec succès", "user": { ... } } ou erreur
const register = async (req, res) => {
    try {
        const { name, username, email, password, phone } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'Name, username, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        // Vérifier si l'email existe déjà
        const existingUserByEmail = await User_1.User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        // Vérifier si le username existe déjà
        const existingUserByUsername = await User_1.User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'User already exists with this username' });
        }
        const user = await User_1.User.create({ name, username, email, password, phone });
        const token = generateToken(user.id.toString());
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
// POST /api/auth/login - Connexion d'un utilisateur
// Corps de la requête : { "email": "...", "password": "..." }
// Réponse : { "token": "...", "user": { "id": "...", "username": "...", "role": "..." } } ou erreur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Log de débogage
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User_1.User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No'); // Log de débogage
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await user.comparePassword(password);
        console.log('Password valid:', isValidPassword); // Log de débogage
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user.id.toString());
        console.log('Token generated successfully'); // Log de débogage
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        console.error('Error stack:', error.stack); // Stack trace complet
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.login = login;
// POST /api/auth/logout - Déconnexion de l'utilisateur (peut invalider le token côté serveur si implémenté)
const logout = async (req, res) => {
    try {
        // Pour l'instant, logout côté serveur ne fait que confirmer la déconnexion
        // L'invalidation du token se fait côté client
        // Dans une implémentation plus avancée, on pourrait maintenir une blacklist des tokens
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = logout;
