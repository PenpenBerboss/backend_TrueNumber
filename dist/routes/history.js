"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/history - Récupérer l'historique des parties jouées par l'utilisateur connecté (nécessite authentification)
// Réponse : [ { "gameId": "...", "date": "...", "generatedNumber": 50, "result": "perdu", "balanceChange": -35, "newBalance": 65 }, ... ]
router.get('/', authMiddleware_1.authenticateToken, gameController_1.getGameHistory);
// GET /api/history/all - Récupérer l'historique de toutes les parties jouées par tous les utilisateurs (Admin seulement)
router.get('/all', authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin, userController_1.getAllGameHistory);
exports.default = router;
