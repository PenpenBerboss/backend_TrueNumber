import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface définissant la structure d'un historique de jeu
 * Étend le Document Mongoose pour inclure les propriétés TypeScript
 */
export interface IGameHistory extends Document {
  userId: mongoose.Types.ObjectId;
  randomNumber: number;
  result: 'Gagné' | 'Perdu';
  pointsChange: number;
  newBalance: number;
  createdAt: Date;
}

/**
 * Interface étendue pour les requêtes avec population des données utilisateur
 * Utilisée pour les vues d'administration et les rapports détaillés
 */
export interface IGameHistoryWithUser extends IGameHistory {
  user: {
    name: string;
    email: string;
  };
}

/**
 * Schéma MongoDB pour la collection d'historique des jeux
 * Enregistre chaque partie jouée avec tous les détails pertinents
 */
const gameHistorySchema = new Schema<IGameHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  randomNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  result: {
    type: String,
    enum: ['Gagné', 'Perdu'],
    required: true
  },
  pointsChange: {
    type: Number,
    required: true
  },
  newBalance: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

/**
 * Modèle Mongoose pour la collection d'historique des jeux
 * Exporte le modèle GameHistory configuré avec le schéma et l'interface IGameHistory
 */
export const GameHistory = mongoose.model<IGameHistory>('GameHistory', gameHistorySchema);