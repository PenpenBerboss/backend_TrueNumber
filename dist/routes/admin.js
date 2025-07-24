"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Middleware pour toutes les routes admin
router.use(authMiddleware_1.authenticateToken);
router.use(authMiddleware_1.requireAdmin);
/**
 * @swagger
 * tags:
 *   name: Administration
 *   description: Routes d'administration pour le dashboard admin
 */
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (Dashboard admin)
 *     description: Endpoint spécifique pour la page d'administration frontend
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs pour le dashboard admin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *                   balance:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
// GET /api/admin/users - Récupérer tous les utilisateurs pour le dashboard
router.get('/users', userController_1.getAllUsers);
/**
 * @swagger
 * /admin/history:
 *   get:
 *     summary: Récupérer l'historique global des parties (Dashboard admin)
 *     description: Endpoint spécifique pour la page d'administration frontend
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Historique global des parties pour le dashboard admin
 */
// GET /api/admin/history - Récupérer l'historique global pour le dashboard
router.get('/history', userController_1.getAllGameHistory);
/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Récupérer les statistiques complètes (Dashboard admin)
 *     description: Endpoint principal pour le dashboard admin avec toutes les statistiques
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques complètes pour le dashboard admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                     totalGames:
 *                       type: number
 *                     totalWins:
 *                       type: number
 *                     totalLosses:
 *                       type: number
 *                     winRate:
 *                       type: number
 *                     averageScore:
 *                       type: number
 *                     activeUsers:
 *                       type: number
 *                     recentGames:
 *                       type: number
 *                 recentGamesData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 */
// GET /api/admin/stats - Récupérer toutes les statistiques pour le dashboard
router.get('/stats', userController_1.getAdminStats);
/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (Dashboard admin)
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 */
// GET /api/admin/users/:id - Récupérer un utilisateur spécifique
router.get('/users/:id', userController_1.getUserById);
/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Créer un nouvel utilisateur (Dashboard admin)
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 */
// POST /api/admin/users - Créer un nouvel utilisateur
router.post('/users', userController_1.createUser);
/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur (Dashboard admin)
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 */
// PUT /api/admin/users/:id - Modifier un utilisateur
router.put('/users/:id', userController_1.updateUser);
/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (Dashboard admin)
 *     tags: [Administration]
 *     security:
 *       - BearerAuth: []
 */
// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete('/users/:id', userController_1.deleteUser);
exports.default = router;
