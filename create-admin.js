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

async function createAdmin() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@truenumber.com' });
    if (existingAdmin) {
      console.log('Un administrateur existe déjà avec cet email.');
      process.exit(0);
    }

    // Créer un nouvel administrateur
    const admin = new User({
      name: 'Administrator',
      username: 'admin',
      email: 'admin@truenumber.com',
      phone: '+1234567890',
      password: 'admin123456', // Sera hashé automatiquement
      role: 'admin',
      balance: 10000
    });

    await admin.save();
    console.log('✅ Administrateur créé avec succès!');
    console.log('📧 Email: admin@truenumber.com');
    console.log('🔑 Password: admin123456');
    console.log('👤 Username: admin');
    console.log('💰 Balance: 10000 points');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
