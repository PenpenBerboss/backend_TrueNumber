import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface définissant la structure d'un utilisateur
 * Étend le Document Mongoose pour inclure les propriétés TypeScript
 */
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'admin';
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schéma MongoDB pour la collection des utilisateurs
 * Définit la structure et les validations pour les documents utilisateur
 */
const userSchema = new Schema<IUser>({
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
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    next(error as Error);
  }
});

/**
 * Méthode d'instance pour comparer un mot de passe candidat avec le mot de passe hashé
 * @param candidatePassword - Le mot de passe à vérifier
 * @returns Promise<boolean> - true si les mots de passe correspondent
 */
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Modèle Mongoose pour la collection des utilisateurs
 * Exporte le modèle User configuré avec le schéma et l'interface IUser
 */
export const User = mongoose.model<IUser>('User', userSchema);