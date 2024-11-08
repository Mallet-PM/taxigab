// controllers/driverController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Connexion d'un chauffeur
export const chauffeurConnexion = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const chauffeur = await prisma.chauffeur.findUnique({ where: { email } });
        if (!chauffeur || !(await bcrypt.compare(motDePasse, chauffeur.motDePasse))) {
            return res.status(401).json({ message: "Les identifiants du chauffeur sont invalides." });
        }
        const token = jwt.sign({ id: chauffeur.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion du chauffeur.", error });
    }
};

// Consulte le profil
export const consulterProfilChauffeur = async (req, res) => {
    const chauffeurId = req.user.id; // Assurez-vous que le middleware d'authentification est en place

    try {
        const chauffeur = await prisma.chauffeur.findUnique({ where: { id: chauffeurId } });
        res.json(chauffeur);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil du chauffeur.", error });
    }
};

// Liste des évaluations
export const consulterEvaluations = async (req, res) => {
    try {
        const evaluations = await prisma.course.findMany({
            where: { chauffeurId: req.user.id },
            select: { id: true, statut: true, client: { select: { nom: true, prenom: true } } },
        });
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des évaluations.", error });
    }
};

// Liste des demandes de course
export const consulterListeCourse = async (req, res) => {
    try {
        const demandes = await prisma.course.findMany({
            where: { statut: "en attente" },
            include: { client: true }, // Inclure les détails du client
        });
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des demandes courses.", error });
    }
};

// Acceptation d'une course
export const accepterCourse = async (req, res) => {
    const { id } = req.params; // ID de la course
    try {
        const course = await prisma.course.update({
            where: { id: Number(id) },
            data: { chauffeurId: req.user.id, statut: "acceptée" },
        });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'acceptation de la course.", error });
    }
};

// Indisponible pour une course
export const courseIndisponible = async (req, res) => {
    const { id } = req.params; // ID de la course

    try {
        await prisma.course.update({
            where: { id: Number(id) },
            data: { statut: "indisponible" },
        });
        res.json({ message: "Course marquée comme indisponible." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la course.", error });
    }
};

// Envoi de localisation
export const envoyerPosition = async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        
        res.json({ message: "Localisation reçue.", latitude, longitude });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi de la localisation.", error });
    }
};


// Historique des courses
export const consulterHistoriqueCourses = async (req, res) => {
    try {
        const historique = await prisma.course.findMany({
            where: { chauffeurId: req.user.id },
            include: { client: true },
        });
        res.json(historique);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'historique des courses.", error });
    }
};

// Récupération des notifications pour un chauffeur
export const consulterNotificationsChauffeur = async (req, res) => {
    const chauffeurId = req.user.id;

    try {
        const notifications = await prisma.notification.findMany({
            where: { chauffeurId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications.", error });
    }
};

// // Récupération de l'historique des courses pour un chauffeur
// export const historiqueCourseChauffeur = async (req, res) => {
//     const chauffeurId = req.user.id; // Assurez-vous que le middleware d'authentification est en place

//     try {
//         // Récupérer l'historique des courses pour un chauffeur donné
//         const historique = await prisma.course.findMany({
//             where: { chauffeurId: chauffeurId },
//             include: { client: true }, // Inclure les détails du client
//             orderBy: { id: 'desc' }, // Ordre décroissant par ID
//         });
//         res.json(historique);
//     } catch (error) {
//         res.status(500).json({ message: "Erreur lors de la récupération de l'historique des courses.", error });
//     }
// };






























// // controllers/driverController.js
// import Prisma from '@prisma/client';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { chauffeurConnexion } from './chauffeurController';
const Driver = require('../models/Driver');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Connexion d'un chauffeur
// export const chauffeurConnexion = async (req, res) => {
//     const { email, motDePasse } = req.body;

//     try {
//         const driver = await Driver.findOne({ where: { email } });
//         if (!driver || !(await bcrypt.compare(motDePasse, driver.motDePasse))) {
//             return res.status(401).json({ message: "Identifiants invalides." });
//         }

//         const token = jwt.sign({ id: driver.id }, 'secret', { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la connexion." });
//     }
// };

// // Récupération du profil
// exports.profil = async (req, res) => {
//     try {
//         const driver = await Driver.findByPk(req.user.id);
//         if (!driver) {
//             return res.status(404).json({ message: "Chauffeur non trouvé." });
//         }
//         res.json(driver);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la récupération du profil." });
//     }
// };

// // Liste des demandes (fonction à compléter selon votre logique métier)
// exports.demandes = async (req, res) => {
//     try {
//         // Logique pour récupérer les demandes de course
//         res.json({ message: "Liste des demandes." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la récupération des demandes." });
//     }
// };

// // Acceptation d'une course (fonction à compléter selon votre logique métier)
// exports.accepterCourse = async (req, res) => {
//     try {
//         // Logique pour accepter une course
//         res.json({ message: "Course acceptée." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de l'acceptation de la course." });
//     }
// };

// // Indisponible pour une course (fonction à compléter selon votre logique métier)
// exports.indisponible = async (req, res) => {
//     try {
//         // Logique pour marquer une course comme indisponible
//         res.json({ message: "Chauffeur marqué comme indisponible." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité." });
//     }
// };

// // Envoi de localisation (fonction à compléter selon votre logique métier)
// exports.localisation = async (req, res) => {
//     try {
//         // Logique pour envoyer la position en temps réel
//         res.json({ message: "Localisation envoyée." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de l'envoi de la localisation." });
//     }
// };

// // Liste des évaluations (fonction à compléter selon votre logique métier)
// exports.evaluations = async (req, res) => {
//     try {
//         // Logique pour récupérer les évaluations reçues
//         res.json({ message: "Liste des évaluations." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la récupération des évaluations." });
//     }
// };

// // Historique des courses (fonction à compléter selon votre logique métier)
// exports.historique = async (req, res) => {
//     try {
//         // Logique pour récupérer l'historique des courses
//         res.json({ message: "Historique des courses." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur lors de la récupération de l'historique." });
//     }
// };
