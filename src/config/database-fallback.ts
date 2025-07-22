import mongoose from 'mongoose';

/**
 * Configuration MongoDB ultra-basique pour Render
 * Utilise uniquement les options les plus essentielles
 */
export const connectDBBasic = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
    
    console.log('🔄 Connexion basique à MongoDB...');
    
    // Connexion avec options minimales
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connecté (mode basique)');
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB (mode basique):', error);
    process.exit(1);
  }
};

export { connectDB } from './database';
