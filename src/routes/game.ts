import { Router } from 'express';
import { playGame } from '../controllers/gameController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Jeu
 *   description: Gestion du jeu TrueNumber - devinez le bon nombre entre 1 et 100
 */

/**
 * @swagger
 * /game/play:
 *   post:
 *     summary: Jouer une partie de TrueNumber
 *     description: |
 *       Lance une partie du jeu de devinette de nombres. Le joueur doit deviner un nombre entre 1 et 100.
 *       - Le système génère un nombre aléatoire
 *       - Le joueur propose sa devinette
 *       - Le système indique si c'est plus haut, plus bas ou correct
 *       - La partie se termine quand le bon nombre est trouvé ou après 10 tentatives
 *       - Un score est calculé basé sur le nombre de tentatives
 *     tags: [Jeu]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuessRequest'
 *           example:
 *             guess: 42
 *     responses:
 *       200:
 *         description: Tentative enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: ["Trop petit!", "Trop grand!", "Félicitations! Vous avez trouvé!", "Game Over! Nombre de tentatives dépassé"]
 *                   example: "Félicitations! Vous avez trouvé!"
 *                 result:
 *                   type: string
 *                   enum: ["too_low", "too_high", "correct", "game_over"]
 *                   example: "correct"
 *                 attempts:
 *                   type: number
 *                   description: "Nombre de tentatives utilisées"
 *                   example: 5
 *                 maxAttempts:
 *                   type: number
 *                   description: "Nombre maximum de tentatives autorisées"
 *                   example: 10
 *                 gameCompleted:
 *                   type: boolean
 *                   description: "Indique si la partie est terminée"
 *                   example: true
 *                 won:
 *                   type: boolean
 *                   description: "Indique si le joueur a gagné"
 *                   example: true
 *                 score:
 *                   type: number
 *                   description: "Score obtenu (seulement si la partie est terminée)"
 *                   example: 75
 *                 targetNumber:
 *                   type: number
 *                   description: "Le nombre à deviner (révélé seulement en fin de partie)"
 *                   example: 42
 *                 guessHistory:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: "Historique de toutes les tentatives"
 *                   example: [50, 25, 37, 42]
 *       400:
 *         description: Données invalides (nombre hors limites, partie déjà terminée, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token d'authentification manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur lors du traitement de la partie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/game/play - Lancer une partie du jeu TrueNumber (nécessite authentification)
// Description : Générer un nombre, mettre à jour le solde et enregistrer l'historique
// Réponse : { "result": "gagné" | "perdu", "generatedNumber": 75, "newBalance": 125 }
router.post('/play', playGame);

export default router;