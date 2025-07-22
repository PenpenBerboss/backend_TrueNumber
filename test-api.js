#!/usr/bin/env node

const BASE_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

// Fonction utilitaire pour les requêtes HTTP
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const url = endpoint.startsWith('/api') ? `${BASE_URL}${endpoint}` : `${API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...(data && { body: JSON.stringify(data) })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(`${response.status}: ${result.message || result.error}`);
        }
        
        return result;
    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}

// Tests principaux
async function runTests() {
    console.log('🚀 === Test API TrueNumber Game ===\n');
    
    let token = null;
    const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
    
    try {
        // Test 0: Route racine
        console.log('0. 🏠 Test Route Racine...');
        const root = await apiRequest('/', 'GET', null, null);
        console.log(`✅ ${root.message}\n`);
        
        // Test 0.1: Route API de base
        console.log('0.1. 🔌 Test Route API de base...');
        const apiBase = await apiRequest('/api', 'GET', null, null);
        console.log(`✅ ${apiBase.message}\n`);
        
        // Test 1: Health Check
        console.log('1. 🏥 Test Health Check...');
        const health = await apiRequest('/health');
        console.log(`✅ ${health.message}\n`);
        
        // Test 2: Inscription
        console.log('2. 📝 Test Inscription...');
        const registerData = {
            name: `Test User ${Math.floor(Math.random() * 1000)}`,
            email: testEmail,
            password: 'password123'
        };
        
        const register = await apiRequest('/auth/register', 'POST', registerData);
        token = register.token;
        console.log(`✅ Compte créé: ${register.user.name}\n`);
        
        // Test 3: Connexion
        console.log('3. 🔑 Test Connexion...');
        const loginData = {
            email: testEmail,
            password: 'password123'
        };
        
        const login = await apiRequest('/auth/login', 'POST', loginData);
        token = login.token;
        console.log(`✅ Connexion réussie: ${login.user.name}\n`);
        
        // Test 4: Profil utilisateur
        console.log('4. 👤 Test Profil Utilisateur...');
        const profile = await apiRequest('/users/me', 'GET', null, token);
        console.log(`✅ Profil récupéré: ${profile.user.name}\n`);
        
        // Test 5: Solde
        console.log('5. 💰 Test Solde...');
        const balance = await apiRequest('/balance', 'GET', null, token);
        console.log(`✅ Solde actuel: ${balance.balance} points\n`);
        
        // Test 6: Jeu - Plusieurs tentatives
        console.log('6. 🎮 Test Jeu - Simulation d\'une partie...');
        const guesses = [50, 25, 75, 62, 56, 59, 57, 58];
        
        for (const guess of guesses) {
            const gameData = { guess };
            const game = await apiRequest('/game/play', 'POST', gameData, token);
            
            console.log(`  🎯 Tentative ${guess}: ${game.message}`);
            
            if (game.gameCompleted) {
                const status = game.won ? '🎉 GAGNÉ' : '💔 PERDU';
                console.log(`  ${status}! Nombre cible: ${game.targetNumber}, Score: ${game.score || 0}`);
                break;
            }
        }
        console.log();
        
        // Test 7: Historique
        console.log('7. 📊 Test Historique...');
        const history = await apiRequest('/history', 'GET', null, token);
        console.log(`✅ Historique récupéré: ${history.stats.totalGames} parties jouées`);
        console.log(`  📈 Taux de victoire: ${history.stats.winRate.toFixed(1)}%`);
        console.log(`  🏆 Score moyen: ${history.stats.averageScore.toFixed(1)}\n`);
        
        // Test 8: Solde après jeu
        console.log('8. 💰 Test Solde Final...');
        const finalBalance = await apiRequest('/balance', 'GET', null, token);
        console.log(`✅ Solde final: ${finalBalance.balance} points\n`);
        
        // Test 9: Déconnexion
        console.log('9. 🚪 Test Déconnexion...');
        const logout = await apiRequest('/auth/logout', 'POST', null, token);
        console.log(`✅ ${logout.message}\n`);
        
        console.log('🎉 === Tous les tests réussis! ===');
        console.log('📚 Documentation complète: http://localhost:5000/api-docs');
        console.log('🌐 Interface Swagger: http://localhost:5000/docs');
        
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        process.exit(1);
    }
}

// Exécuter les tests
if (require.main === module) {
    // Vérifier si node-fetch est disponible
    if (typeof fetch === 'undefined') {
        console.log('⚠️  Installation de node-fetch requise:');
        console.log('npm install node-fetch@2');
        console.log('\nOu utilisez Node.js 18+ qui inclut fetch nativement.');
        process.exit(1);
    }
    
    runTests().catch(console.error);
}

module.exports = { apiRequest, runTests };
