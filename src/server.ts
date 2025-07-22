/**
 * Serveur principal de l'application TrueNumber Game
 * 
 * Ce fichier configure et démarre le serveur Express avec :
 * - Connexion à MongoDB
 * - Middleware CORS et parsing JSON
 * - Documentation Swagger
 * - Routes API organisées
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { swaggerUi, specs } from './config/swagger';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import userRoutes from './routes/users';
import balanceRoutes from './routes/balance';
import historyRoutes from './routes/history';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données MongoDB (non-bloquante)
connectDB().catch(error => {
  console.error('❌ Échec de la connexion initiale MongoDB:', error.message);
  // Le serveur continue de fonctionner même si MongoDB n'est pas disponible au démarrage
});

// Configuration des middlewares
app.use(cors()); // Activation CORS pour les requêtes cross-origin
app.use(express.json()); // Parsing automatique du JSON dans les requêtes

// Configuration de la documentation Swagger avec interface personnalisée
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
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
  res.send(specs);
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
      history: '/api/history'
    }
  });
});

// Configuration des routes API selon l'architecture RESTful
app.use('/api/auth', authRoutes);        // Authentification (inscription, connexion)
app.use('/api/users', userRoutes);       // Gestion des utilisateurs
app.use('/api/game', gameRoutes);        // Logique du jeu TrueNumber
app.use('/api/balance', balanceRoutes);  // Consultation du solde
app.use('/api/history', historyRoutes);  // Historique des parties

// Endpoint de vérification de l'état du serveur
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap: { [key: number]: string } = {
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
      host: mongoose.connection.host || 'Non connecté'
    }
  });
});

// Endpoint spécifique pour le statut MongoDB
app.get('/api/db-status', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap: { [key: number]: string } = {
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
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
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

export default app;