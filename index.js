import { readFile } from 'fs/promises'
const fileUsuarios = await readFile('./data/usuarios.json', 'utf-8')
const fileVentas = await readFile('./data/ventas.json', 'utf-8')
const fileProductos = await readFile('./data/productos.json', 'utf-8')

const usuarios = JSON.parse(fileUsuarios)
const ventas = JSON.parse(fileVentas)
const productos = JSON.parse(fileProductos)

console.log(usuarios)
console.log(ventas)
console.log(productos)