const posts = require('../data/posts.js')    // richiamo l'array di oggetti della risorsa post quì dove si svolgono le funzioni

// funzione rotta Index => visualizzare tutti gli elementi
const index = (req, res) => {
    console.log('elenco dei post')

    let filteredPosts = posts

    // filtro i posts con il valore tag che viene passato in query string
    if (req.query.tags) {
        filteredPosts = posts.filter((post) => {
            return post.tags.includes(req.query.tags.toLowerCase())   // se il valore tags inserito nella query filtro l'array principale e lo ritorno
        })
    }

    // limito i post da vedere in elenco
    const limit = parseInt(req.query.limit)  // inserisco in una variabile il valore della query limit e lo trasformo in un numero
    if (limit && !isNaN(limit) && limit >= 0) {  // se quel numero è compreso in elenco ed è >= 0, taglio l'array dei post dall'indice 0 al numero limi inserito in query string
        filteredPosts = filteredPosts.slice(0, limit)
    }

    res.json(filteredPosts)     // rispondo con un json che contiene l'elenco intero, o se si entra nell'if, quello filtrato
}

// funzione rotta show => visualizzare un elemento 
const show = (req, res) => {
    const id = req.params.id
    console.log(`Ecco la pizza con id: ${id}`)

    const post = posts.find((post) => post.id === id)

    res.json(post)
}

// funzione rotta store => creare un nuovo elemento
const store = (req, res) => {
    res.send('Creo un nuovo post')
}

// funzione rotta update => modificare interamente un elemento
const update = (req, res) => {
    const id = req.params.id
    res.send(`Modifico interamente il post con id: ${id}`)
}

// funzione rotta modify => modificare parzialmente un elemento
const modify = (req, res) => {
    const id = req.params.id
    res.send(`Modifico parzialmente il post con id: ${id}`)
}

// funzione rotta destroy => eliminare un elemento
const destroy = (req, res) => {
    const id = req.params.id
    res.send(`Elimino il post con id: ${id}`)
}

module.exports = { index, show, store, update, modify, destroy }