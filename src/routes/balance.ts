import { Router } from 'express';
import { getBalance } from '../controllers/gameController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Solde
 *   description: Gestion du solde de points des utilisateurs
 */

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Récupérer le solde actuel de l'utilisateur
 *     description: |
 *       Permet à un utilisateur connecté de consulter son solde de points actuel.
 *       Le solde est utilisé pour jouer des parties et est modifié selon les résultats :
 *       - Parties gagnées : +10 à +100 points selon les tentatives
 *       - Parties perdues : -5 points
 *       - Solde initial : 100 points
 *     tags: [Solde]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Solde récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: Solde actuel en points
 *                   example: 150
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de l'utilisateur
 *                     name:
 *                       type: string
 *                       description: Nom de l'utilisateur
 *                       example: "Jean Dupont"
 *                 lastGameResult:
 *                   type: object
 *                   nullable: true
 *                   description: Résultat de la dernière partie jouée
 *                   properties:
 *                     won:
 *                       type: boolean
 *                       example: true
 *                     score:
 *                       type: number
 *                       example: 75
 *                     balanceChange:
 *                       type: number
 *                       example: 25
 *                     createdAt:
 *                       type: string
 *                       format: date-time
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
 *       500:
 *         description: Erreur lors de la récupération du solde
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/balance - Récupérer le solde actuel de l'utilisateur connecté (nécessite authentification)
// Réponse : { "balance": 150 }
router.get('/', authenticateToken, getBalance);

export default router;
