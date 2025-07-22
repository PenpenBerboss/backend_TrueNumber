import mongoose from 'mongoose';

/**
 * Fonction de connexion à la base de données MongoDB
 * Configure la connexion MongoDB avec gestion d'erreurs appropriée
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Gestionnaire d'événements de connexion MongoDB
 * Surveille l'état de la connexion à la base de données
 */
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB déconnecté');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Erreur MongoDB:', error);
});