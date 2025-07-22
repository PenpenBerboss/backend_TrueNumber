#!/usr/bin/env node

/**
 * Script de diagnostic SSL/TLS pour MongoDB
 * Teste spécifiquement les problèmes de connexion SSL sur Render
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testSSLConnection() {
    console.log('🔒 === Test SSL/TLS MongoDB Atlas ===\n');
    
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        console.error('❌ Variable MONGO_URI non définie');
        process.exit(1);
    }
    
    // Masquer les credentials pour l'affichage
    const maskedURI = mongoURI.replace(/\/\/.*@/, '//***:***@');
    console.log(`🔗 URI: ${maskedURI}`);
    
    // Vérification du format URI
    if (!mongoURI.startsWith('mongodb+srv://')) {
        console.error('❌ URI doit commencer par mongodb+srv:// pour SSL');
        console.log('💡 Format correct: mongodb+srv://user:pass@cluster.mongodb.net/db');
        process.exit(1);
    }
    
    console.log('✅ Format URI correct (mongodb+srv)');
    
    // Test avec configuration SSL complète
    const sslOptions = {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        
        // Configuration SSL stricte
        tls: true,
        tlsInsecure: false,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        
        // Pool minimal pour le test
        maxPoolSize: 1,
        minPoolSize: 0,
        
        // Options de retry
        retryWrites: true,
        retryReads: true,
        
        // Buffering désactivé
        bufferCommands: false,
    };
    
    try {
        console.log('🚀 Test de connexion SSL...');
        console.log('⏱️  Timeout: 30 secondes');
        
        const startTime = Date.now();
        await mongoose.connect(mongoURI, sslOptions);
        const endTime = Date.now();
        
        console.log(`✅ Connexion SSL réussie en ${endTime - startTime}ms`);
        console.log(`🔗 Host: ${mongoose.connection.host}`);
        console.log(`📂 Database: ${mongoose.connection.name}`);
        console.log(`🔒 Ready State: ${mongoose.connection.readyState}`);
        
        // Test d'une opération basique
        console.log('\n🧪 Test opération SSL...');
        const admin = mongoose.connection.db.admin();
        const buildInfo = await admin.buildInfo();
        console.log(`📊 MongoDB Version: ${buildInfo.version}`);
        
        // Test des collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📚 Collections: ${collections.length} trouvée(s)`);
        
        console.log('\n🎉 Test SSL complet réussi !');
        console.log('✅ Votre configuration est compatible avec Render');
        
    } catch (error) {
        console.error('\n❌ Erreur SSL détectée:');
        console.error(`   ${error.message}`);
        
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.log('\n🔧 Solutions SSL:');
            console.log('1. Vérifiez que l\'URI commence par mongodb+srv://');
            console.log('2. Ajoutez &ssl=true à la fin de l\'URI');
            console.log('3. Vérifiez que le cluster MongoDB est actif');
            console.log('4. Testez avec un nouvel utilisateur MongoDB');
        }
        
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('\n🌐 Solutions IP:');
            console.log('1. MongoDB Atlas → Network Access');
            console.log('2. Add IP Address → Allow Access From Anywhere');
            console.log('3. IP: 0.0.0.0/0');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n🔑 Solutions Auth:');
            console.log('1. Vérifiez username/password');
            console.log('2. Database Access → Vérifiez les permissions');
            console.log('3. Créez un nouvel utilisateur avec role readWrite');
        }
        
        console.log('\n📖 Consultez MONGODB_SSL_FIX.md pour plus de détails');
        process.exit(1);
        
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Connexion fermée');
        }
    }
}

testSSLConnection();
