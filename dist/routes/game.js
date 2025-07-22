"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// POST /api/game/play - Lancer une partie du jeu TrueNumber (nécessite authentification)
// Description : Générer un nombre, mettre à jour le solde et enregistrer l'historique
// Réponse : { "result": "gagné" | "perdu", "generatedNumber": 75, "newBalance": 125 }
router.post('/play', gameController_1.playGame);
exports.default = router;
