"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameHistory = exports.getBalance = exports.playGame = void 0;
const User_1 = require("../models/User");
const GameHistory_1 = require("../models/GameHistory");
const playGame = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.balance < 100) {
            return res.status(400).json({ message: 'Insufficient balance. Minimum 100 points required to play.' });
        }
        // Generate random number between 1 and 100
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        // Game logic: Win if number is > 50, lose if <= 50
        const isWin = randomNumber > 50;
        const result = isWin ? 'Gagné' : 'Perdu';
        const pointsChange = isWin ? 200 : -100; // Win +200, Lose -100
        const newBalance = user.balance + pointsChange;
        // Update user balance
        user.balance = newBalance;
        await user.save();
        // Create game history record
        const gameRecord = await GameHistory_1.GameHistory.create({
            userId: user.id,
            randomNumber: randomNumber,
            result,
            pointsChange,
            newBalance
        });
        // Réponse selon les spécifications API : { "result": "gagné" | "perdu", "generatedNumber": 75, "newBalance": 125 }
        res.json({
            result: result.toLowerCase(), // "gagné" ou "perdu" en minuscules selon les specs
            generatedNumber: randomNumber,
            newBalance
        });
    }
    catch (error) {
        console.error('Game play error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.playGame = playGame;
const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            balance: user.balance
        });
    }
    catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getBalance = getBalance;
// GET /api/history - Récupérer l'historique des parties jouées par l'utilisateur connecté
// Réponse : [ { "gameId": "...", "date": "...", "generatedNumber": 50, "result": "perdu", "balanceChange": -35, "newBalance": 65 }, ... ]
const getGameHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await GameHistory_1.GameHistory.find({ userId }).sort({ createdAt: -1 });
        // Formater la réponse selon les spécifications API
        const formattedHistory = history.map(game => ({
            gameId: game.id,
            date: game.createdAt,
            generatedNumber: game.randomNumber,
            result: game.result,
            balanceChange: game.pointsChange,
            newBalance: game.newBalance
        }));
        res.json(formattedHistory);
    }
    catch (error) {
        console.error('Get game history error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGameHistory = getGameHistory;
