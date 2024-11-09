import express from 'express'
import clientrouter from './routes/clientsRoutes.js';
import router from './routes/adminRoute.js'
import chauffeurrouter from './routes/chauffeurRoute.js'
import { PrismaClient } from '@prisma/client';
import localisationrouter from './routes/localisationRoute.js'
 const app = express()
 const port = 4000

 // Configuration de la base de données
 const prisma = new PrismaClient();

 app.use(express.json())
 

 async function connect() {
   try {
     await prisma.$connect();
     console.log('Connexion à la base de données réussie !');
   } catch (error) {
     console.error('Erreur de connexion à la base de données:', error);
   }
 }
  
  connect();
 app.use('/',router)
 app.use('/',clientrouter)
 app.use('/',chauffeurrouter)
 app.use('/',localisationrouter)


 app.get('/api', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })