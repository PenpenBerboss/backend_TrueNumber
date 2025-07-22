import { Router } from 'express';
import { 
  getCurrentUser,
  getAllUsers, 
  getUserById,
  createUser, 
  updateUser, 
  deleteUser
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs et administration
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     description: Permet à un utilisateur connecté de récupérer ses propres informations
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/users/me - Récupérer les informations de l'utilisateur connecté (nécessite authentification)
router.get('/me', authenticateToken, getCurrentUser);

// Routes admin seulement (nécessitent authentification + rôle admin)
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs (Admin seulement)
 *     description: Permet aux administrateurs de voir tous les utilisateurs enregistrés
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: number
 *                   description: Nombre total d'utilisateurs
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/users - Récupérer la liste de tous les utilisateurs (Admin seulement)
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (Admin seulement)
 *     description: Permet aux administrateurs de récupérer les détails d'un utilisateur spécifique
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l'utilisateur
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/users/:id - Récupérer les informations d'un utilisateur spécifique par ID (Admin seulement)
router.get('/:id', getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur (Admin seulement)
 *     description: Permet aux administrateurs de créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['name', 'email', 'password']
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Marie Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "marie.dupont@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "motdepasse123"
 *               isAdmin:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides ou utilisateur déjà existant
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 */
// POST /api/users - Créer un nouvel utilisateur (par l'administrateur)
router.post('/', createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifier un utilisateur (Admin seulement)
 *     description: Permet aux administrateurs de modifier les informations d'un utilisateur, y compris le rôle
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Marie Dupont Modifié"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "marie.nouveau@example.com"
 *               isAdmin:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur modifié avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     summary: Supprimer un utilisateur (Admin seulement)
 *     description: Permet aux administrateurs de supprimer définitivement un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *       404:
 *         description: Utilisateur non trouvé
 */
// PUT /api/users/:id - Modifier les informations d'un utilisateur (y compris le rôle) (Admin seulement)
router.put('/:id', updateUser);

// DELETE /api/users/:id - Supprimer un utilisateur (Admin seulement)
router.delete('/:id', deleteUser);

export default router;