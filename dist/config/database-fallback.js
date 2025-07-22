"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.connectDBBasic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Configuration MongoDB ultra-basique pour Render
 * Utilise uniquement les options les plus essentielles
 */
const connectDBBasic = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
        console.log('🔄 Connexion basique à MongoDB...');
        // Connexion avec options minimales
        await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        console.log('✅ MongoDB connecté (mode basique)');
        console.log(`🔗 Host: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.error('❌ Erreur connexion MongoDB (mode basique):', error);
        process.exit(1);
    }
};
exports.connectDBBasic = connectDBBasic;
var database_1 = require("./database");
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return database_1.connectDB; } });
