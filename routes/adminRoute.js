import express from 'express';
import { 
    adminConnexion, 
    consulterListeChauffeurs, 
    consulterListeTaxis, 
    detailTaxiById, 
    ajouterTaxi, 
    desactiverTaxi, 
    mettreAjourTaxi, 
    creerNotification,
    recupererAdminById

} from './controllers/adminController.js';
import { verifyTokenAdmin } from './middlewares/authMiddleware.js'; // Assuming you have an authentication middleware for admin

const router = express.Router();

// Connexion d'un admin
router.post('/connexion', adminConnexion);

// Gestion des chauffeurs
router.get('/chauffeurs', verifyTokenAdmin, consulterListeChauffeurs);

// Récupération des taxis
router.get('/taxis', verifyTokenAdmin, consulterListeTaxis);

// Détails d'un taxi
router.get('/taxi/:id', verifyTokenAdmin, detailTaxiById);

// Recupere admin
router.get('/admin/:id', verifyTokenAdmin, recupererAdminById); //

// Ajout d'un taxi
router.post('/taxi', verifyTokenAdmin, ajouterTaxi);

// Désactivation d'un taxi
router.put('/taxi/:id/desactiver', verifyTokenAdmin, desactiverTaxi);

// Mise à jour d'un taxi
router.put('/taxi/:id', verifyTokenAdmin, mettreAjourTaxi);

// Création d'une notification
router.post('/notification', verifyTokenAdmin, creerNotification);

export default router;
