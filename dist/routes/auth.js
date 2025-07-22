"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /api/auth/register - Création d'un nouveau compte utilisateur
router.post('/register', authController_1.register);
// POST /api/auth/login - Connexion d'un utilisateur
router.post('/login', authController_1.login);
// POST /api/auth/logout - Déconnexion de l'utilisateur
router.post('/logout', authController_1.logout);
exports.default = router;
