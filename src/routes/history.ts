import { Router } from 'express';
import { getGameHistory } from '../controllers/gameController';
import { getAllGameHistory } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Historique
 *   description: Gestion de l'historique des parties jouées
 */

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Récupérer l'historique personnel des parties
 *     description: Permet à un utilisateur connecté de voir toutes ses parties précédentes
 *     tags: [Historique]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre de parties par page
 *       - in: query
 *         name: won
 *         schema:
 *           type: boolean
 *         description: Filtrer par parties gagnées (true) ou perdues (false)
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameHistory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                       example: 1
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *                     totalGames:
 *                       type: number
 *                       example: 87
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalGames:
 *                       type: number
 *                       example: 87
 *                     gamesWon:
 *                       type: number
 *                       example: 42
 *                     gamesLost:
 *                       type: number
 *                       example: 45
 *                     winRate:
 *                       type: number
 *                       format: float
 *                       example: 48.3
 *                     averageScore:
 *                       type: number
 *                       format: float
 *                       example: 67.5
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur lors de la récupération de l'historique
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/history - Récupérer l'historique des parties jouées par l'utilisateur connecté (nécessite authentification)
// Réponse : [ { "gameId": "...", "date": "...", "generatedNumber": 50, "result": "perdu", "balanceChange": -35, "newBalance": 65 }, ... ]
router.get('/', authenticateToken, getGameHistory);

/**
 * @swagger
 * /history/all:
 *   get:
 *     summary: Récupérer l'historique global de toutes les parties (Admin seulement)
 *     description: Permet aux administrateurs de voir l'historique complet de tous les utilisateurs
 *     tags: [Historique]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre de parties par page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'utilisateur spécifique
 *       - in: query
 *         name: won
 *         schema:
 *           type: boolean
 *         description: Filtrer par parties gagnées (true) ou perdues (false)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les parties (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les parties (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Historique global récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/GameHistory'
 *                       - type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalGames:
 *                       type: number
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *                 globalStats:
 *                   type: object
 *                   properties:
 *                     totalGames:
 *                       type: number
 *                       example: 1287
 *                     totalUsers:
 *                       type: number
 *                       example: 156
 *                     gamesWon:
 *                       type: number
 *                       example: 642
 *                     gamesLost:
 *                       type: number
 *                       example: 645
 *                     globalWinRate:
 *                       type: number
 *                       format: float
 *                       example: 49.9
 *                     averageAttemptsPerGame:
 *                       type: number
 *                       format: float
 *                       example: 5.3
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *       403:
 *         description: Accès refusé - privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur lors de la récupération de l'historique global
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/history/all - Récupérer l'historique de toutes les parties jouées par tous les utilisateurs (Admin seulement)
router.get('/all', authenticateToken, requireAdmin, getAllGameHistory);

export default router;
