import express from 'express';
import { 
    inscriptionClient, 
    clientConnexion, 
    demanderUneCourse, 
    consulterDetailCourse, 
    consulterHistoriqueCoursesClient, 
    annulerCourse, 
    consulterProfilClient, 
    mettreAjourProfil, 
    consulterEvaluationsChauffeur, 
    evaluerCourse, 
    ajouterPaiement, 
    consulterNotificationsClients, 
    motDePasseOublier, 
    reinitialiserMotDePasse 
} from './controllers/clientController.js';
import { verifyToken } from './middlewares/authMiddleware.js'; // Assume you have an authentication middleware

const router = express.Router();

// Inscription d'un client
router.post('/inscription', inscriptionClient);

// Connexion d'un client
router.post('/connexion', clientConnexion);

// Demande d'une course
router.post('/course/demander', verifyToken, demanderUneCourse);

// Détails d'une course spécifique
router.get('/course/:id', verifyToken, consulterDetailCourse);

// Récupération de l'historique des courses pour un client
router.get('/historique-courses', verifyToken, consulterHistoriqueCoursesClient);

// Annulation d'une course
router.delete('/course/:id', verifyToken, annulerCourse);

// Récupération du profil
router.get('/profil', verifyToken, consulterProfilClient);

// Mise à jour du profil
router.put('/profil', verifyToken, mettreAjourProfil);

// Récupération des évaluations d'un chauffeur
router.get('/chauffeur/:chauffeurId/evaluations', consulterEvaluationsChauffeur);

// Évaluation d'une course
router.post('/course/:id/evaluer', verifyToken, evaluerCourse);

// Ajout d'un paiement
router.post('/paiement', verifyToken, ajouterPaiement);

// Récupération des notifications pour un client
router.get('/notifications', verifyToken, consulterNotificationsClients);

// Mot de passe oublié
router.post('/mot-de-passe-oublie', motDePasseOublier);

// Réinitialisation du mot de passe
router.put('/reinitialiser-mot-de-passe', reinitialiserMotDePasse);

export default router;
