"use strict";
/**
 * Serveur principal de l'application TrueNumber Game
 *
 * Ce fichier configure et démarre le serveur Express avec :
 * - Connexion à MongoDB
 * - Middleware CORS et parsing JSON
 * - Documentation Swagger
 * - Routes API organisées
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const swagger_1 = require("./config/swagger");
const auth_1 = __importDefault(require("./routes/auth"));
const game_1 = __importDefault(require("./routes/game"));
const users_1 = __importDefault(require("./routes/users"));
const balance_1 = __importDefault(require("./routes/balance"));
const history_1 = __importDefault(require("./routes/history"));
const admin_1 = __importDefault(require("./routes/admin"));
// Chargement des variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connexion à la base de données MongoDB (non-bloquante)
(0, database_1.connectDB)().catch(error => {
    console.error('❌ Échec de la connexion initiale MongoDB:', error.message);
    // Le serveur continue de fonctionner même si MongoDB n'est pas disponible au démarrage
});
// Configuration des middlewares
app.use((0, cors_1.default)()); // Activation CORS pour les requêtes cross-origin
app.use(express_1.default.json()); // Parsing automatique du JSON dans les requêtes
// Configuration de la documentation Swagger avec interface personnalisée
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
    customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .scheme-container { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      padding: 20px; 
      border-radius: 10px; 
    }
    .swagger-ui .info { 
      margin: 20px 0; 
    }
    .swagger-ui .info .title { 
      color: #2c3e50; 
      font-size: 2.5em; 
    }
  `,
    customSiteTitle: 'Documentation API TrueNumber',
    customfavIcon: '/favicon.ico',
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true
    }
}));
// Route pour servir la spécification Swagger en JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.specs);
});
// Route de redirection vers la documentation
app.get('/docs', (req, res) => {
    res.redirect('/api-docs');
});
// Route d'accueil avec informations sur l'API
app.get('/', (req, res) => {
    res.json({ message: 'TrueNumber API is running!' });
});
// Route API de base pour vérifier le fonctionnement
app.get('/api', (req, res) => {
    res.json({ message: 'API endpoint working!' });
});
// Route détaillée pour les informations complètes de l'API
app.get('/api/info', (req, res) => {
    res.json({
        message: 'API TrueNumber Game - Documentation disponible',
        documentation: {
            swagger: '/api-docs',
            redirection: '/docs'
        },
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            game: '/api/game',
            balance: '/api/balance',
            history: '/api/history',
            admin: '/api/admin'
        }
    });
});
// Configuration des routes API selon l'architecture RESTful
app.use('/api/auth', auth_1.default); // Authentification (inscription, connexion)
app.use('/api/users', users_1.default); // Gestion des utilisateurs
app.use('/api/game', game_1.default); // Logique du jeu TrueNumber
app.use('/api/balance', balance_1.default); // Consultation du solde
app.use('/api/history', history_1.default); // Historique des parties
app.use('/api/admin', admin_1.default); // Administration (dashboard admin)
// Endpoint de vérification de l'état du serveur
app.get('/api/health', (req, res) => {
    const mongoStatus = mongoose_1.default.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    const mongoStatusText = statusMap[mongoStatus] || 'unknown';
    res.json({
        message: 'Serveur backend opérationnel !',
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: {
            status: mongoStatusText,
            host: mongoose_1.default.connection.host || 'Non connecté'
        }
    });
});
// Endpoint spécifique pour le statut MongoDB
app.get('/api/db-status', (req, res) => {
    const mongoStatus = mongoose_1.default.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    const mongoStatusText = statusMap[mongoStatus] || 'unknown';
    res.json({
        database: {
            status: mongoStatusText,
            readyState: mongoStatus,
            host: mongoose_1.default.connection.host || null,
            name: mongoose_1.default.connection.name || null,
            connected: mongoStatus === 1
        }
    });
});
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur TrueNumber démarré sur le port ${PORT}`);
    console.log(`📚 Documentation Swagger : http://localhost:${PORT}/api-docs`);
    console.log(`🔍 Health Check : http://localhost:${PORT}/api/health`);
});
exports.default = app;
