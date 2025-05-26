import { Router } from "express"
import { readFile, writeFile  } from 'fs/promises'
import { get_user_byId } from "../utils/usuarios.js"


const fileUsers = await readFile('./data/usuarios.json', 'utf-8')
const userData = JSON.parse(fileUsers)

const router = Router()

router.post('/login', (req, res)=>{
    const userName = req.body.username
    const pass = req.body.pass
    const result = userData.find(e => e.username === userName && e.pass === pass)
    if(result){
        res.status(200).json(`Bienvenido ${result.name}`)
    }else{
        res.status(400).json(`${userName} no se encuentra`)
    }
})

router.get('/byId/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const result = get_user_byId(id)

    if(result){
        res.status(200).json(result)
    }else{
        res.status(400).json(`${id} no se encuentra`)
    }
})

router.delete('/delete/:userID',(req,res)=>{
    const user_id = req.params.userID

    try{
        const index = userData.findIndex(e => e.id == user_id)

        if(index !== -1){
            userData.splice(index,1)
            writeFile('../data/usuarios.json', JSON.stringify(userData,null,2));
            res.status(200).json('Usuario Eliminado')
        }else{
            res.send(400).json('No se encontro al usuario')
        }
    }catch(error){
        res.send(500).json('Error al eliminar usuario')
    }
})


export default router