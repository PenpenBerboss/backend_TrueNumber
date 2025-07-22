# TrueNumber Backend API

Backend pour le jeu TrueNumber développé avec Node.js, Express, TypeScript et MongoDB.

## 🚀 Déploiement sur Render

### Prérequis
1. Compte MongoDB Atlas configuré
2. Compte Render.com
3. Repository GitHub

### Variables d'environnement requises sur Render :
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/truenumber
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Configuration automatique
Le serveur est configuré pour :
- ✅ Utiliser `process.env.PORT` (requis par Render)
- ✅ Routes de base `/` et `/api` pour les tests de santé
- ✅ Health check endpoint `/api/health`
- ✅ Build automatique avec TypeScript

### Endpoints principaux
- `GET /` - Test de base (retourne "TrueNumber API is running!")
- `GET /api` - Test API (retourne "API endpoint working!")
- `GET /api/health` - Health check complet
- `GET /api-docs` - Documentation Swagger

### Scripts disponibles
```bash
npm run dev     # Développement avec hot reload
npm run build   # Compilation TypeScript
npm start       # Production (après build)
```

### Test local
```bash
node test-api.js
```

## 🔧 Dépannage 404 sur Render

Si vous obtenez une erreur 404 :

1. **Vérifiez les logs de build** sur Render
2. **Assurez-vous que** `npm run build` fonctionne localement
3. **Vérifiez** que le dossier `dist/` est créé
4. **Testez** les endpoints `/` et `/api` après déploiement

### Cold start
Les services gratuits Render s'endorment après 15 minutes d'inactivité. Le premier accès peut prendre 30-60 secondes.
