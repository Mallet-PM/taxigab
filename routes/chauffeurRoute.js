import express from 'express';
import { 
    chauffeurConnexion, 
    consulterProfilChauffeur, 
    consulterEvaluations, 
    consulterListeCourse, 
    accepterCourse, 
    courseIndisponible, 
    envoyerPosition, 
    consulterHistoriqueCourses, 
    consulterNotificationsChauffeur 
} from './controllers/driverController.js';
import { verifyToken } from './middlewares/authMiddleware.js'; // Assuming you have an authentication middleware

const router = express.Router();

// Connexion d'un chauffeur
router.post('/connexion', chauffeurConnexion);

// Consulte le profil
router.get('/profil', verifyToken, consulterProfilChauffeur);

// Liste des évaluations
router.get('/evaluations', verifyToken, consulterEvaluations);

// Liste des demandes de course
router.get('/demandes', verifyToken, consulterListeCourse);

// Acceptation d'une course
router.put('/course/:id/accepter', verifyToken, accepterCourse);

// Indisponible pour une course
router.put('/course/:id/indisponible', verifyToken, courseIndisponible);

// Envoi de localisation
router.post('/position', verifyToken, envoyerPosition);

// Historique des courses
router.get('/historique-courses', verifyToken, consulterHistoriqueCourses);

// Récupération des notifications pour un chauffeur
router.get('/notifications', verifyToken, consulterNotificationsChauffeur);

export default router;
