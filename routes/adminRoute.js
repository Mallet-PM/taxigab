import express from 'express';
import { 
    adminConnexion, 
    consulterListeChauffeurs, 
    consulterListeTaxis, 
    detailTaxiById, 
    ajouterTaxi, 
    desactiverTaxi, 
    mettreAjourTaxi, 
    creerNotification 
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js'; // Assuming you have an authentication middleware for admin

const router = express.Router();

// Connexion d'un admin
router.post('/connexion', adminConnexion);

// Gestion des chauffeurs
router.get('/chauffeurs', verifyTokenA, consulterListeChauffeurs);

// Récupération des taxis
router.get('/taxis', verifyToken, consulterListeTaxis);

// Détails d'un taxi
router.get('/taxi/:id', verifyToken, detailTaxiById);

// Ajout d'un taxi
router.post('/taxi', verifyToken, ajouterTaxi);

// Désactivation d'un taxi
router.put('/taxi/:id/desactiver', verifyToken, desactiverTaxi);

// Mise à jour d'un taxi
router.put('/taxi/:id', verifyToken, mettreAjourTaxi);

// Création d'une notification
router.post('/notification', verifyToken, creerNotification);

export default router;
