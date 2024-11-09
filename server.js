import express from 'express'
//import app from './app.js'
import router from './routes/adminRoute.js'

app.use(express.json())

 const app = express()
 const port = 3000

 app.use('/api/router', router);

// Error Handling Middleware
app.use(errorHandler);
 app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`le serveur demarre bien ${port}`)
  })