"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.getAllGameHistory = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = exports.getCurrentUser = void 0;
const User_1 = require("../models/User");
const GameHistory_1 = require("../models/GameHistory");
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 balance:
 *                   type: number
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur interne
 */
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            balance: user.balance
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
        res.status(500).json({ message: 'Erreur serveur interne' });
    }
};
exports.getCurrentUser = getCurrentUser;
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs (Admin seulement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *       403:
 *         description: Accès refusé - Administrateur requis
 *       500:
 *         description: Erreur serveur interne
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.User.find().select('-password').sort({ createdAt: -1 });
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            balance: user.balance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        res.json(formattedUsers);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur interne' });
    }
};
exports.getAllUsers = getAllUsers;
// GET /api/users/:id - Récupérer les informations d'un utilisateur spécifique par ID (Admin seulement)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            balance: user.balance,
            createdAt: user.createdAt
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserById = getUserById;
// POST /api/users - Créer un nouvel utilisateur (par l'administrateur)
// Corps de la requête : { "username": "...", "email": "...", "password": "...", "phone": "...", "role": "client" }
const createUser = async (req, res) => {
    try {
        const { name, username, email, password, phone, role } = req.body;
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
        const user = await User_1.User.create({
            name,
            username,
            email,
            password,
            phone,
            role: role || 'user' // Par défaut 'user' au lieu de 'client'
        });
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createUser = createUser;
// PUT /api/users/:id - Modifier les informations d'un utilisateur (y compris le rôle) (Admin seulement)
// Corps de la requête : { "username": "...", "email": "...", "phone": "...", "role": "admin" } (les champs à modifier)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, phone, password, role, balance } = req.body;
        const user = await User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already taken by another user' });
            }
        }
        // Check if username is already taken by another user
        if (username && username !== user.username) {
            const existingUser = await User_1.User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken by another user' });
            }
        }
        // Update user fields
        if (name)
            user.name = name;
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (phone !== undefined)
            user.phone = phone;
        if (password)
            user.password = password; // Will be hashed by pre-save middleware
        if (role)
            user.role = role;
        if (balance !== undefined)
            user.balance = balance;
        await user.save();
        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateUser = updateUser;
// DELETE /api/users/:id - Supprimer un utilisateur (Admin seulement)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Don't allow admin to delete themselves
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        await User_1.User.findByIdAndDelete(id);
        res.json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteUser = deleteUser;
const getAllGameHistory = async (req, res) => {
    try {
        const history = await GameHistory_1.GameHistory.find()
            .populate('userId', 'name email username')
            .sort({ createdAt: -1 });
        // Formater les données pour correspondre au format attendu par le frontend
        const formattedHistory = history.map(game => ({
            id: game.id,
            playerName: game.userId ? game.userId.name || game.userId.username : 'Utilisateur Inconnu',
            playerEmail: game.userId ? game.userId.email : 'email@inconnu.com',
            targetNumber: game.randomNumber,
            generatedNumber: game.randomNumber,
            attempts: 1, // Dans votre jeu actuel, il n'y a qu'une tentative par partie
            won: game.result === 'Gagné',
            result: game.result.toLowerCase(),
            score: game.newBalance,
            balanceChange: game.pointsChange,
            newBalance: game.newBalance,
            createdAt: game.createdAt,
            created_at: game.createdAt // Alternative naming pour compatibilité
        }));
        res.json(formattedHistory);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'historique global:', error);
        res.status(500).json({ message: 'Erreur serveur interne' });
    }
};
exports.getAllGameHistory = getAllGameHistory;
/**
 * GET /api/admin/stats - Récupérer les statistiques d'administration
 * Endpoint pour obtenir toutes les statistiques nécessaires au dashboard admin
 */
const getAdminStats = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs et l'historique des parties
        const [users, gameHistory] = await Promise.all([
            User_1.User.find().select('-password'),
            GameHistory_1.GameHistory.find().populate('userId', 'name email username')
        ]);
        // Calculer les statistiques
        const totalUsers = users.length;
        const totalGames = gameHistory.length;
        const totalWins = gameHistory.filter(game => game.result === 'Gagné').length;
        const totalLosses = totalGames - totalWins;
        const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
        // Calculer la moyenne des scores (balance finale)
        const averageScore = totalGames > 0
            ? gameHistory.reduce((sum, game) => sum + (game.newBalance || 0), 0) / totalGames
            : 0;
        // Utilisateurs actifs (dernière activité dans les 7 derniers jours)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUsers = users.filter(user => new Date(user.updatedAt) > weekAgo).length;
        // Parties récentes (dernières 24h)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentGames = gameHistory.filter(game => new Date(game.createdAt) > dayAgo).length;
        // Parties récentes formatées pour l'affichage
        const recentGamesFormatted = gameHistory
            .filter(game => new Date(game.createdAt) > dayAgo)
            .slice(0, 10)
            .map(game => ({
            id: game.id,
            playerName: game.userId ? game.userId.name || game.userId.username : 'Utilisateur Inconnu',
            playerEmail: game.userId ? game.userId.email : 'email@inconnu.com',
            targetNumber: game.randomNumber,
            attempts: 1,
            won: game.result === 'Gagné',
            score: game.newBalance,
            createdAt: game.createdAt
        }));
        res.json({
            stats: {
                totalUsers,
                totalGames,
                totalWins,
                totalLosses,
                winRate: Math.round(winRate * 10) / 10,
                averageScore: Math.round(averageScore * 10) / 10,
                activeUsers,
                recentGames
            },
            recentGamesData: recentGamesFormatted,
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des statistiques admin:', error);
        res.status(500).json({ message: 'Erreur serveur interne' });
    }
};
exports.getAdminStats = getAdminStats;
