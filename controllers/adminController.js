// controllers/adminController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Connexion d'un admin
export const adminConnexion = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin || !(await bcrypt.compare(motDePasse, admin.motDePasse))) {
            return res.status(401).json({ message: "Les identifiants de l'admin sont invalides." });
        }
        const token = jwt.sign({ id: admin.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion.", error });
    }
};


// Gestion des chauffeurs
export const consulterLiteChauffeurs = async (req, res) => {
    try {
        const chauffeurs = await prisma.chauffeur.findMany();
        res.json(chauffeurs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des chauffeurs.", error });
    }
};



// Récupération des taxis
export const consulterListeTaxis = async (req, res) => {
    try {
        const taxis = await prisma.taxi.findMany();
        res.json(taxis);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des taxis.", error });
    }
};

// Détails d'un taxi
export const detailTaxiById = async (req, res) => {
    const { id } = req.params;

    try {
        const taxi = await prisma.taxi.findUnique({ where: { id: Number(id) } });
        if (!taxi) {
            return res.status(404).json({ message: "Taxi non trouvé." });
        }
        res.json(taxi);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du taxi.", error });
    }
};


// Ajout d'un taxi
export const ajouterTaxi = async (req, res) => {
    const { plaque, modele } = req.body;

    try {
        const taxi = await prisma.taxi.create({
            data: { plaque, modele },
        });
        res.status(201).json(taxi);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du taxi.", error });
    }
};

// Désactivation d'un taxi
export const desactiverTaxi = async (req, res) => {
    const { id } = req.params;

    try {
        const taxi = await prisma.taxi.update({
            where: { id: Number(id) },
            data: { statut: "indisponible" },
        });
        res.json({ message: "Taxi désactivé.", taxi });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la désactivation du taxi.", error });
    }
};


// Mise à jour d'un taxi
export const mettreAjourTaxi = async (req, res) => {
    const { id } = req.params;
    const { plaque, modele, statut } = req.body;

    try {
        const updatedTaxi = await prisma.taxi.update({
            where: { id: Number(id) },
            data: { plaque, modele, statut },
        });
        res.json({ message: "Informations Taxi mises à jour.", updatedTaxi });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du taxi.", error });
    }
};

// Création d'une notification
export const creerNotification = async (req, res) => {
    const { message, clientId, chauffeurId } = req.body;

    try {
        const notification = await prisma.notification.create({
            data: {
                message,
                clientId,
                chauffeurId,
            },
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la notification.", error });
    }
};








