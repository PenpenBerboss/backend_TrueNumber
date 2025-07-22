"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/balance - Récupérer le solde actuel de l'utilisateur connecté (nécessite authentification)
// Réponse : { "balance": 150 }
router.get('/', authMiddleware_1.authenticateToken, gameController_1.getBalance);
exports.default = router;
