import express from 'express'
import { readFile, writeFile  } from 'fs/promises' 


import userRouter from './routes/usuarios.routers.js'
import itemsRouter from './routes/productos.routers.js'
import saleRouter from './routes/ventas.routers.js'
const app = express()

const port = 3001

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})


app.use('/usuarios', userRouter)
app.use('/productos', itemsRouter)
app.use('/ventas', saleRouter)