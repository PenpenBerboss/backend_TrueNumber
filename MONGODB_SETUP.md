# Configuration MongoDB Atlas pour Render

## 🚨 Résolution de l'erreur "Could not connect to any servers"

### 1. Configuration IP Whitelist sur MongoDB Atlas

**SOLUTION PRINCIPALE** : Autoriser toutes les IPs pour Render

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com/)
2. Allez dans votre cluster → **Network Access**
3. Cliquez sur **"+ ADD IP ADDRESS"**
4. Sélectionnez **"ALLOW ACCESS FROM ANYWHERE"**
5. Ou ajoutez manuellement : `0.0.0.0/0`

> ⚠️ **Important** : Render utilise des IPs dynamiques, il faut autoriser toutes les IPs.

### 2. Vérification de l'URI MongoDB

Votre URI doit ressembler à :
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Vérifications** :
- ✅ Remplacez `username` par votre vrai nom d'utilisateur
- ✅ Remplacez `password` par votre vrai mot de passe
- ✅ Remplacez `cluster` par le nom de votre cluster
- ✅ Vérifiez qu'il n'y a pas de caractères spéciaux non-encodés dans le mot de passe

### 3. Variables d'environnement sur Render

Dans votre dashboard Render :
1. Allez dans **Environment**
2. Ajoutez la variable : `MONGO_URI`
3. Valeur : Votre URI MongoDB Atlas complète

### 4. Test de connexion

Utilisez cet URI pour tester :
```bash
# Test basique (remplacez par vos vraies valeurs)
mongodb+srv://username:password@your-cluster.mongodb.net/truenumber?retryWrites=true&w=majority&appName=TrueNumber
```

### 5. Dépannage avancé

Si le problème persiste :

1. **Vérifiez le nom d'utilisateur/mot de passe** :
   - Allez dans Atlas → Database Access
   - Vérifiez que l'utilisateur existe et a les bonnes permissions

2. **Créez un nouvel utilisateur** :
   - Nom : `render-user`
   - Rôle : `readWrite` sur votre base de données

3. **Vérifiez le cluster** :
   - Le cluster doit être en cours d'exécution (pas en pause)
   - Région compatible (Oregon pour Render)

### 6. Configuration recommandée

**Variables d'environnement Render** :
```
MONGO_URI=mongodb+srv://render-user:your-password@cluster.mongodb.net/truenumber?retryWrites=true&w=majority&appName=TrueNumber
NODE_ENV=production
JWT_SECRET=your-jwt-secret
```

### 7. Monitoring

Les logs Render vous montreront :
```
✅ MongoDB connecté avec succès
🔗 Connecté à: cluster-shard-00-00.mongodb.net
🟢 MongoDB: Connexion établie
```

## 🔧 Commandes de debug

Pour tester votre connexion MongoDB localement :
```bash
# Test avec votre URI
node -e "
const mongoose = require('mongoose');
mongoose.connect('VOTRE_URI_ICI')
  .then(() => console.log('✅ Connexion réussie'))
  .catch(err => console.error('❌ Erreur:', err.message));
"
```
