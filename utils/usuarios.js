import { readFile  } from 'fs/promises' 


const fileUsers = await readFile('./data/usuarios.json', 'utf-8') 
const userData = JSON.parse(fileUsers) 

export const get_user_byId = (id)=>{
    return userData.find(e => e.id === id)
}