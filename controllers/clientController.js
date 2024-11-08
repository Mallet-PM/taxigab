// controllers/clientController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Inscription d'un client
export const inscriptionClient = async (req, res) => {
    const { nom, prenom, telephone, email, motDePasse } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        const client = await prisma.client.create({
            data: {
                nom,
                prenom,
                telephone,
                email,
                motDePasse: hashedPassword,
            },
        });
        res.status(201).json({ message: "Client inscrit avec succès.", client });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription.", error });
    }
};

// Connexion d'un client
export const clientConnexion = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const client = await prisma.client.findUnique({ where: { email } });
        if (!client || !(await bcrypt.compare(motDePasse, client.motDePasse))) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }
        const token = jwt.sign({ id: client.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion.", error });
    }
};

// Demande d'une course
export const demanderUneCourse = async (req, res) => {
    const { pointDepart, destination } = req.body;
    const clientId = req.user.id; // ID du client

    try {
        const course = await prisma.course.create({
            data: {
                clientId,
                pointDepart,
                destination,
                statut: "en attente",
            },
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la demande de course.", error });
    }
};

// Détails d'une course spécifique
export const consulterDetailCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await prisma.course.findUnique({
            where: { id: Number(id) },
            include: { client: true, chauffeur: true },
        });
        if (!course) {
            return res.status(404).json({ message: "Course non trouvée." });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des détails de la course.", error });
    }
};

// Récupération de l'historique des courses pour un client
export const consulterHistoriqueCoursesClient = async (req, res) => {
    const clientId = req.user.id; // Assurez-vous que le middleware d'authentification est en place

    try {
        // Récupérer l'historique des courses pour un client donné
        const historique = await prisma.course.findMany({
            where: { clientId: clientId },
            include: { chauffeur: true }, // Inclure les détails du chauffeur
            orderBy: { id: 'desc' }, // Ordre décroissant par ID
        });
        res.json(historique);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'historique des courses.", error });
    }
};


// Annulation d'une course
export const annulerCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await prisma.course.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Course annulée.", course });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'annulation de la course.", error });
    }
};

// Récupération du profil
export const consulterProdilClient = async (req, res) => {
    const clientId = req.user.id; // Assurez-vous que le middleware d'authentification est en place

    try {
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil.", error });
    }
};

// Mise à jour du profil
export const mettreAjourProfil = async (req, res) => {
    const clientId = req.user.id; // Assurez-vous que le middleware d'authentification est en place
    const { nom, prenom, telephone } = req.body;

    try {
        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: { nom, prenom, telephone },
        });
        res.json({ message: "Profil mis à jour.", updatedClient });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil.", error });
    }
};

// Liste des évaluations d'un chauffeur
export const evaluerChauffeur = async (req, res) => {
    const chauffeurId = req.user.id;

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { course: { chauffeurId } },
            include: { course: true },
        });
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des évaluations.", error });
    }
};

// Évaluation d'une course
export const evaluerCourse = async (req, res) => {
    const { id } = req.params;
    const { note, commentaire } = req.body;

    try {
        const evaluation = await prisma.evaluation.create({
            data: {
                courseId: Number(id),
                note,
                commentaire,
            },
        });
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'évaluation de la course.", error });
    }
};

// Ajout d'un paiement
export const ajouterPaiement = async (req, res) => {
    const { montant } = req.body;
    const clientId = req.user.id; // Assurez-vous que le middleware d'authentification est en place

    try {
        const paiement = await prisma.paiement.create({
            data: {
                montant,
                clientId,
            },
        });
        res.status(201).json(paiement);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du paiement.", error });
    }
};

// Récupération des notifications pour un client
export const consulterNotificationsClients = async (req, res) => {
    const clientId = req.user.id;

    try {
        const notifications = await prisma.notification.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications.", error });
    }
};


// Mot de passe oublié
export const motDePasseOublier = async (req, res) => {
    // Logique de réinitialisation de mot de passe (ex: envoi d'email)
    res.status(501).json({ message: "Fonctionnalité non implémentée." });
};

// Réinitialisation du mot de passe
export const reinitialiserMotDePasse = async (req, res) => {
    const { email, nouveauMotDePasse } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
        await prisma.client.update({
            where: { email },
            data: { motDePasse: hashedPassword },
        });
        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe.", error });
    }
};





















