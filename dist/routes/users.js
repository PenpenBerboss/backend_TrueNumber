"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/users/me - Récupérer les informations de l'utilisateur connecté (nécessite authentification)
router.get('/me', authMiddleware_1.authenticateToken, userController_1.getCurrentUser);
// Routes admin seulement (nécessitent authentification + rôle admin)
router.use(authMiddleware_1.authenticateToken);
router.use(authMiddleware_1.requireAdmin);
// GET /api/users - Récupérer la liste de tous les utilisateurs (Admin seulement)
router.get('/', userController_1.getAllUsers);
// GET /api/users/:id - Récupérer les informations d'un utilisateur spécifique par ID (Admin seulement)
router.get('/:id', userController_1.getUserById);
// POST /api/users - Créer un nouvel utilisateur (par l'administrateur)
router.post('/', userController_1.createUser);
// PUT /api/users/:id - Modifier les informations d'un utilisateur (y compris le rôle) (Admin seulement)
router.put('/:id', userController_1.updateUser);
// DELETE /api/users/:id - Supprimer un utilisateur (Admin seulement)
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
