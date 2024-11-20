const posts = require('../posts.js')    // richiamo l'array di oggetti della risorsa post quì dove si svolgono le funzioni

// funzione rotta Index => visualizzare tutti gli elementi
const index = (req, res) => {
    res.json(posts)
}

// funzione rotta show => visualizzare un elemento 
const show = (req, res) => {
    const id = req.params.id
    console.log(`Ecco la pizza con slug: ${id}`)

    const post = posts.find((post) => post.id === id)

    res.json(post)
}

// funzione rotta store => creare un nuovo elemento
const store = (req, res) => {
    res.send('Creo un nuovo post')
}

// funzione rotta update => modificare interamente un elemento
const update = (req, res) => {
    res.send(`Modifico interamente il post con slug: ${id}`)
}

// funzione rotta modify => modificare parzialmente un elemento
const modify = (req, res) => {
    res.send(`Modifico parzialmente il post con slug: ${id}`)
}

// funzione rotta destroy => eliminare un elemento
const destroy = (req, res) => {
    const id = req.params.id
    res.send(`Elimino il post con slug: ${id}`)
}

module.exports = { index, show, store, update, modify, destroy }