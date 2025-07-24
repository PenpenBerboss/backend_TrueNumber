"use strict";
/**
 * Contrôleur de jeu pour l'API TrueNumber Game
 *
 * Gère la logique du jeu de devinette de nombres avec :
 * - Génération de nombres aléatoires
 * - Système de tentatives et scoring
 * - Gestion du solde utilisateur
 * - Historique des parties
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameHistory = exports.getBalance = exports.playGame = void 0;
const User_1 = require("../models/User");
const GameHistory_1 = require("../models/GameHistory");
/**
 * POST /api/game/play - Jouer une partie de TrueNumber
 * Permet à un utilisateur authentifié de jouer au jeu de devinette
 * @param req - Requête avec guess (nombre deviné) et utilisateur authentifié
 * @param res - Réponse avec le résultat de la tentative
 */
const playGame = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }
        // Vérification du solde minimum requis pour éviter un solde négatif excessif
        if (user.balance < 0) {
            return res.status(400).json({
                message: 'Solde insuffisant pour jouer.'
            });
        }
        // Génération d'un nombre aléatoire entre 0 et 100
        const randomNumber = Math.floor(Math.random() * 101); // 0 à 100 inclus
        // Logique de jeu selon les spécifications exactes :
        // - Si nombre ≤ 70 : Défaite (-35 points)
        // - Si nombre > 70 : Victoire (+50 points)
        const isWin = randomNumber > 70;
        const result = isWin ? 'Gagné' : 'Perdu';
        const pointsChange = isWin ? 50 : -35; // Victoire +50, Défaite -35
        const newBalance = user.balance + pointsChange;
        // Mise à jour du solde utilisateur
        user.balance = newBalance;
        await user.save();
        // Création de l'enregistrement d'historique de partie
        const gameRecord = await GameHistory_1.GameHistory.create({
            userId: user.id,
            randomNumber: randomNumber,
            result,
            pointsChange,
            newBalance
        });
        // Réponse formatée selon les spécifications API
        res.json({
            result: result.toLowerCase(), // "gagné" ou "perdu" en minuscules
            generatedNumber: randomNumber,
            newBalance,
            message: isWin ?
                `🎉 Félicitations ! Vous avez gagné ${pointsChange} points !` :
                `😔 Dommage ! Vous perdez ${Math.abs(pointsChange)} points.`
        });
    }
    catch (error) {
        console.error('Erreur lors de la partie:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur lors de la partie'
        });
    }
};
exports.playGame = playGame;
/**
 * GET /api/balance - Récupérer le solde actuel de l'utilisateur
 * @param req - Requête avec utilisateur authentifié
 * @param res - Réponse avec le solde en points
 */
const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }
        res.json({
            balance: user.balance,
            message: `Votre solde actuel est de ${user.balance} points`
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du solde:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur lors de la récupération du solde'
        });
    }
};
exports.getBalance = getBalance;
/**
 * GET /api/history - Récupérer l'historique des parties de l'utilisateur connecté
 * @param req - Requête avec utilisateur authentifié
 * @param res - Liste des parties jouées avec détails
 */
const getGameHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        // Récupération de l'historique trié par date décroissante
        const history = await GameHistory_1.GameHistory.find({ userId }).sort({ createdAt: -1 });
        // Calcul des statistiques utilisateur
        const totalGames = history.length;
        const gamesWon = history.filter(game => game.result === 'Gagné').length;
        const gamesLost = totalGames - gamesWon;
        const winRate = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;
        // Formatage de la réponse selon les spécifications API
        const formattedHistory = history.map(game => ({
            gameId: game.id,
            date: game.createdAt,
            generatedNumber: game.randomNumber,
            result: game.result.toLowerCase(), // "gagné" ou "perdu"
            balanceChange: game.pointsChange,
            newBalance: game.newBalance
        }));
        res.json({
            games: formattedHistory,
            stats: {
                totalGames,
                gamesWon,
                gamesLost,
                winRate: Math.round(winRate * 10) / 10, // Arrondi à 1 décimale
                message: totalGames === 0 ?
                    'Aucune partie jouée pour le moment' :
                    `${totalGames} partie${totalGames > 1 ? 's' : ''} jouée${totalGames > 1 ? 's' : ''}`
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur lors de la récupération de l\'historique'
        });
    }
};
exports.getGameHistory = getGameHistory;
