"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const game_1 = __importDefault(require("./routes/game"));
const users_1 = __importDefault(require("./routes/users"));
const balance_1 = __importDefault(require("./routes/balance"));
const history_1 = __importDefault(require("./routes/history"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.connectDB)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes API RESTful selon les spécifications
app.use('/api/auth', auth_1.default); // Authentification
app.use('/api/users', users_1.default); // Utilisateurs
app.use('/api/game', game_1.default); // Jeu "TrueNumber"
app.use('/api/balance', balance_1.default); // Solde
app.use('/api/history', history_1.default); // Historique des parties
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
