"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Fonction de connexion à la base de données MongoDB
 * Configure la connexion MongoDB avec gestion d'erreurs appropriée
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connecté avec succès');
    }
    catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
/**
 * Gestionnaire d'événements de connexion MongoDB
 * Surveille l'état de la connexion à la base de données
 */
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB déconnecté');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ Erreur MongoDB:', error);
});
