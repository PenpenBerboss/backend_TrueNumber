import mongoose from 'mongoose';

/**
 * Configuration MongoDB simplifiée et compatible avec toutes les versions
 * Optimisée spécialement pour le déploiement sur Render
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
    
    // Configuration minimale mais robuste pour Render
    const options = {
      // Timeouts essentiels
      serverSelectionTimeoutMS: 10000, // 10 secondes pour sélectionner un serveur
      connectTimeoutMS: 10000, // 10 secondes pour se connecter
      socketTimeoutMS: 30000, // 30 secondes pour les opérations socket
      
      // Pool de connexions
      maxPoolSize: 5, // Maximum 5 connexions simultanées
      minPoolSize: 1, // Minimum 1 connexion
      
      // Autres options essentielles
      retryWrites: true, // Retry automatique des écritures
    };
    
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connecté avec succès');
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`📂 Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Redémarrage dans 10 secondes...');
      setTimeout(() => {
        process.exit(1);
      }, 10000);
    } else {
      process.exit(1);
    }
  }
};

/**
 * Gestionnaires d'événements MongoDB optimisés pour la production
 */
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB: Connexion établie');
});

mongoose.connection.on('disconnected', () => {
  console.log('🔴 MongoDB: Connexion perdue');
  
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Tentative de reconnexion...');
    setTimeout(async () => {
      try {
        await connectDB();
      } catch (error) {
        console.error('❌ Échec de la reconnexion:', error);
      }
    }, 5000);
  }
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Erreur MongoDB:', error);
});

mongoose.connection.on('reconnected', () => {
  console.log('🟡 MongoDB: Reconnexion réussie');
});

// Fermeture propre de la connexion
process.on('SIGINT', async () => {
  console.log('🔌 Fermeture de la connexion MongoDB...');
  await mongoose.connection.close();
  process.exit(0);
});
