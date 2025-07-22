import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrueNumber Game API',
      version: '1.0.0',
      description: 'API complète pour le jeu de devinette de nombres avec authentification et gestion des scores',
      contact: {
        name: 'Support API',
        email: 'support@truenumber.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT pour l\'authentification. Format: Bearer {token}'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur'
            },
            name: {
              type: 'string',
              description: 'Nom complet de l\'utilisateur',
              example: 'Jean Dupont'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur',
              example: 'jean.dupont@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Mot de passe de l\'utilisateur (minimum 6 caractères)',
              example: 'motdepasse123'
            },
            isAdmin: {
              type: 'boolean',
              description: 'Statut administrateur',
              default: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        GameHistory: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de la partie'
            },
            userId: {
              type: 'string',
              description: 'ID de l\'utilisateur qui a joué'
            },
            targetNumber: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              description: 'Nombre à deviner',
              example: 42
            },
            guesses: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Liste des tentatives du joueur',
              example: [50, 25, 37, 42]
            },
            attempts: {
              type: 'number',
              description: 'Nombre total de tentatives',
              example: 4
            },
            won: {
              type: 'boolean',
              description: 'Indique si le joueur a gagné',
              example: true
            },
            score: {
              type: 'number',
              description: 'Score obtenu pour cette partie',
              example: 75
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de la partie'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email',
              example: 'jean.dupont@example.com'
            },
            password: {
              type: 'string',
              description: 'Mot de passe',
              example: 'motdepasse123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Nom complet',
              example: 'Jean Dupont'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email',
              example: 'jean.dupont@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Mot de passe (minimum 6 caractères)',
              example: 'motdepasse123'
            }
          }
        },
        GuessRequest: {
          type: 'object',
          required: ['guess'],
          properties: {
            guess: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              description: 'Nombre deviné par le joueur',
              example: 42
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            error: {
              type: 'string',
              description: 'Détails de l\'erreur'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message de succès'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './dist/routes/*.js',
    './dist/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
