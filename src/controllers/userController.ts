import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { GameHistory } from '../models/GameHistory';

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 balance:
 *                   type: number
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur interne
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      balance: user.balance
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs (Admin seulement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *       403:
 *         description: Accès refusé - Administrateur requis
 *       500:
 *         description: Erreur serveur interne
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};

// GET /api/users/:id - Récupérer les informations d'un utilisateur spécifique par ID (Admin seulement)
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      balance: user.balance,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/users - Créer un nouvel utilisateur (par l'administrateur)
// Corps de la requête : { "username": "...", "email": "...", "password": "...", "phone": "...", "role": "client" }
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, username, email, password, phone, role } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Vérifier si l'email existe déjà
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Vérifier si le username existe déjà
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'User already exists with this username' });
    }

    const user = await User.create({ 
      name, 
      username, 
      email, 
      password, 
      phone,
      role: role || 'user' // Par défaut 'user' au lieu de 'client'
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/users/:id - Modifier les informations d'un utilisateur (y compris le rôle) (Admin seulement)
// Corps de la requête : { "username": "...", "email": "...", "phone": "...", "role": "admin" } (les champs à modifier)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, email, phone, password, role, balance } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken by another user' });
      }
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken by another user' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (password) user.password = password; // Will be hashed by pre-save middleware
    if (role) user.role = role;
    if (balance !== undefined) user.balance = balance;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/users/:id - Supprimer un utilisateur (Admin seulement)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow admin to delete themselves
    if (id === req.user!.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllGameHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await GameHistory.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      history
    });
  } catch (error) {
    console.error('Get all game history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};