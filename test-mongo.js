#!/usr/bin/env node

/**
 * Script de test de connexion MongoDB
 * Utilisez ce script pour vérifier votre URI MongoDB avant le déploiement
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoConnection() {
    console.log('🔍 Test de connexion MongoDB...\n');
    
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        console.error('❌ Variable MONGO_URI non définie dans .env');
        console.log('💡 Créez un fichier .env avec : MONGO_URI=mongodb+srv://...');
        process.exit(1);
    }
    
    console.log(`🔗 URI MongoDB : ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    try {
        // Configuration de test avec timeouts courts
        const options = {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 10000,
        };
        
        console.log('🚀 Tentative de connexion...');
        await mongoose.connect(mongoURI, options);
        
        console.log('✅ Connexion MongoDB réussie !');
        console.log(`🎯 Connecté à : ${mongoose.connection.host}`);
        console.log(`📂 Base de données : ${mongoose.connection.name}`);
        console.log(`📊 État : ${mongoose.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'}`);
        
        // Test d'une opération simple
        console.log('\n🧪 Test d\'opération basique...');
        const collections = await mongoose.connection.db.admin().listCollections().toArray();
        console.log(`📚 Collections trouvées : ${collections.length}`);
        
        console.log('\n🎉 Test MongoDB réussi ! Votre configuration est correcte.');
        
    } catch (error) {
        console.error('\n❌ Erreur de connexion MongoDB :');
        console.error(`   ${error.message}`);
        
        console.log('\n🔧 Vérifications à faire :');
        console.log('1. ✓ IP Whitelist : Ajoutez 0.0.0.0/0 dans MongoDB Atlas');
        console.log('2. ✓ Utilisateur/Mot de passe : Vérifiez dans Database Access');
        console.log('3. ✓ Cluster actif : Le cluster ne doit pas être en pause');
        console.log('4. ✓ URI correcte : Format mongodb+srv://user:pass@cluster.net/db');
        
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Connexion fermée.');
    }
}

// Exécution du test
testMongoConnection();
