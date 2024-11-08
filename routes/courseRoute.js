import express from 'express';
import {
  getCourses,          // Récupérer la liste de toutes les courses
  getCourseById,       // Récupérer les détails d'une course par ID
  addCourse,           // Créer une nouvelle course
  updateCourse,        // Modifier une course existante
  removeCourse,        // Supprimer une course
  acceptCourse,        // Accepter une course par un chauffeur
  completeCourse,      // Marquer une course comme complétée
  cancelCourse         // Annuler une course
} from '../controllers/courseController.js';

const courseRouter = express.Router(); // Initialisation du routeur

// Récupérer la liste de toutes les courses
courseRouter.get('/courses', getCourses);

// Récupérer les détails d'une course spécifique par ID
courseRouter.get('/courses/:id', getCourseById);

// Créer une nouvelle course
courseRouter.post('/courses', addCourse);

// Modifier une course existante par ID
courseRouter.put('/courses/:id', updateCourse);

// Supprimer une course par ID
courseRouter.delete('/courses/:id', removeCourse);

// Accepter une course par un chauffeur
courseRouter.post('/courses/:id/accepter', acceptCourse);

// Marquer une course comme complétée
courseRouter.post('/courses/:id/completer', completeCourse);

// Annuler une course
courseRouter.post('/courses/:id/annuler', cancelCourse);

export default courseRouter; // Export du routeur pour être utilisé ailleurs
