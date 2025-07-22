import mongoose from 'mongoose';

/**
 * Configuration MongoDB simplifiée et compatible avec toutes les versions
 * Optimisée spécialement pour le déploiement sur Render
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-game';
    
    // Configuration spéciale pour résoudre les problèmes SSL sur Render
    const options = {
      // Timeouts plus longs pour Render
      serverSelectionTimeoutMS: 30000, // 30 secondes pour sélectionner un serveur
      connectTimeoutMS: 30000, // 30 secondes pour se connecter
      socketTimeoutMS: 45000, // 45 secondes pour les opérations socket
      
      // Pool de connexions optimisé pour Render
      maxPoolSize: 3, // Réduction à 3 connexions max
      minPoolSize: 0, // Pas de connexion minimum
      
      // Options SSL/TLS pour résoudre les erreurs SSL
      tls: true, // Force TLS
      tlsInsecure: false, // Garde la sécurité
      tlsAllowInvalidCertificates: false, // Certificats valides requis
      tlsAllowInvalidHostnames: false, // Hostnames valides requis
      
      // Options de retry et stabilité
      retryWrites: true, // Retry automatique des écritures
      retryReads: true, // Retry automatique des lectures
      maxIdleTimeMS: 30000, // Ferme les connexions inactives
      heartbeatFrequencyMS: 10000, // Heartbeat toutes les 10 secondes
      
      // Options de buffering pour éviter les timeouts
      bufferCommands: false, // Désactive le buffering des commandes
    };
    
    console.log('🔄 Connexion sécurisée à MongoDB...');
    console.log('🔐 Configuration SSL/TLS activée');
    
    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connecté avec succès');
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`📂 Database: ${mongoose.connection.name}`);
    console.log(`🔒 SSL Status: ${mongoose.connection.readyState === 1 ? 'Sécurisé' : 'En cours'}`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    
    // Messages d'aide spécifiques selon l'erreur
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('IP')) {
      console.log('💡 Vérifiez la whitelist IP dans MongoDB Atlas');
      console.log('💡 Ajoutez 0.0.0.0/0 pour autoriser Render');
    }
    
    if (errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
      console.log('💡 Problème SSL détecté');
      console.log('💡 Vérifiez votre URI MongoDB (doit commencer par mongodb+srv://)');
    }
    
    if (errorMessage.includes('authentication')) {
      console.log('💡 Vérifiez vos identifiants MongoDB');
      console.log('💡 Username/Password dans Database Access');
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Redémarrage dans 15 secondes...');
      setTimeout(() => {
        process.exit(1);
      }, 15000);
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
