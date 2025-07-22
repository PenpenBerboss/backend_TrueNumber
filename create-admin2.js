require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modèle User simplifié pour ce script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 100 }
}, { timestamps: true });

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

async function createSecondAdmin() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Vérifier si cet admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin2@truenumber.com' });
    if (existingAdmin) {
      console.log('Un administrateur existe déjà avec cet email: admin2@truenumber.com');
      process.exit(0);
    }

    // Vérifier si le username existe déjà
    const existingUsername = await User.findOne({ username: 'admin2' });
    if (existingUsername) {
      console.log('Un utilisateur existe déjà avec ce nom d\'utilisateur: admin2');
      process.exit(0);
    }

    // Créer le deuxième administrateur
    const admin2 = new User({
      name: 'Second Administrator',
      username: 'admin2',
      email: 'admin2@truenumber.com',
      phone: '+1234567891',
      password: 'admin2023', // Sera hashé automatiquement
      role: 'admin',
      balance: 10000
    });

    await admin2.save();
    console.log('✅ Deuxième administrateur créé avec succès!');
    console.log('📧 Email: admin2@truenumber.com');
    console.log('🔑 Password: admin2023');
    console.log('👤 Username: admin2');
    console.log('👨‍💼 Nom: Second Administrator');
    console.log('💰 Balance: 10000 points');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du deuxième administrateur:', error.message);
    if (error.code === 11000) {
      console.error('Erreur: Un utilisateur avec cet email ou username existe déjà.');
    }
  } finally {
    mongoose.disconnect();
  }
}

createSecondAdmin();
