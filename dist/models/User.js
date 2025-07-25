"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Schéma MongoDB pour la collection des utilisateurs
 * Définit la structure et les validations pour les documents utilisateur
 */
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
/**
 * Middleware pré-sauvegarde pour hasher le mot de passe
 * Exécuté automatiquement avant chaque sauvegarde d'un document utilisateur
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
        const salt = await bcryptjs_1.default.genSalt(saltRounds);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        console.error('Erreur lors du hashage du mot de passe:', error);
        next(error);
    }
});
/**
 * Méthode d'instance pour comparer un mot de passe candidat avec le mot de passe hashé
 * @param candidatePassword - Le mot de passe à vérifier
 * @returns Promise<boolean> - true si les mots de passe correspondent
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
/**
 * Modèle Mongoose pour la collection des utilisateurs
 * Exporte le modèle User configuré avec le schéma et l'interface IUser
 */
exports.User = mongoose_1.default.model('User', userSchema);
