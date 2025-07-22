"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Fonction de connexion à la base de données MongoDB
 * Configure la connexion MongoDB avec gestion d'erreurs et reconnexion automatique
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
        // Configuration optimisée pour la production et Render
        const options = {
            maxPoolSize: 10, // Limite le nombre de connexions simultanées
            serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
            socketTimeoutMS: 45000, // Timeout des sockets
            bufferMaxEntries: 0, // Désactive le buffering des opérations
            retryWrites: true, // Active les retry writes
            retryReads: true, // Active les retry reads
            connectTimeoutMS: 10000, // Timeout de connexion
        };
        await mongoose_1.default.connect(mongoURI, options);
        console.log('✅ MongoDB connecté avec succès');
        console.log(`🔗 Connecté à: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error);
        // En production, on essaie de redémarrer après un délai
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 Tentative de reconnexion dans 5 secondes...');
            setTimeout(() => {
                process.exit(1);
            }, 5000);
        }
        else {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
/**
 * Gestionnaire d'événements de connexion MongoDB
 * Surveille l'état de la connexion à la base de données
 */
mongoose_1.default.connection.on('connected', () => {
    console.log('🟢 MongoDB: Connexion établie');
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('🔴 MongoDB: Connexion perdue');
    // Tentative de reconnexion automatique en production
    if (process.env.NODE_ENV === 'production') {
        console.log('🔄 Tentative de reconnexion automatique...');
        setTimeout(() => {
            (0, exports.connectDB)();
        }, 5000);
    }
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ Erreur MongoDB:', error);
});
mongoose_1.default.connection.on('reconnected', () => {
    console.log('🟡 MongoDB: Reconnexion réussie');
});
