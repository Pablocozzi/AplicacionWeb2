import { Router } from "express";
import { readFile, writeFile  } from 'fs/promises' 
import { get_user_byId } from "../utils/usuarios.js";

const router = Router()

const fileSales = await readFile('./data/ventas.json', 'utf-8') 
const salesData = JSON.parse(fileSales) 

router.get('/all', (req, res)=>{
    
    if(salesData.length){
        res.status(200).json(salesData)
    }else{
        res.status(400).json(`No hay ventas`)
    }
})

router.get('/byDate/:from/:to', (req, res)=>{

    const from = req.params.from
    const to = req.params.to

    const result = salesData.filter(e => e.date >= from && e.date <= to)

    if(result){
        res.status(200).json(result)
    }else{
        res.status(400).json(`No hay ventas entre ${from} y ${to}`)
    }
})

router.post('/detail', (req,res)=>{
    const from = req.body.from
    const to = req.body.to
    let aux_name = ''
    try{
        const arr = salesData.filter(e => e.date >= from && e.date <= to)

        const result = arr.map(e=>{
            aux_name = get_user_byId(e.seller)
            aux_name = aux_name.name + ' ' + aux_name.lastname

            return {
                id : e.id_sale,
                id_item : e.id_item,
                total: e.total,
                date: e.date,
                seller : aux_name
            }
        })

        if(result){
            res.status(200).json(result)
        }else{
            res.status(400).json(`No hay ventas entre ${from} y ${to}`)
        }
    }catch(error){
        res.send(500).json('Error al buscar...')
    }
})


export default router