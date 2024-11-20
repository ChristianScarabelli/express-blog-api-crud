const posts = require('../data/posts.js')    // richiamo l'array di oggetti della risorsa post quì dove si svolgono le funzioni

// funzione rotta Index => visualizzare tutti gli elementi
const index = (req, res) => {
    console.log('elenco dei post')

    let filteredPosts = posts

    // filtro i posts con il valore tag che viene passato in query string
    if (req.query.tags) {
        const queryTags = req.query.tags.toLowerCase().split(',')  // metto il valore in minuscolo e separato dagli altri elementi dell'array in una variabile
        filteredPosts = filteredPosts.filter(post =>    // verifico se almeno uno dei tag della query è presente nei tag del post
            post.tags.some(tag => queryTags.includes(tag.toLowerCase()))
        )
    }

    // limito i post da vedere in elenco
    const limit = parseInt(req.query.limit)  // inserisco in una variabile il valore della query limit e lo trasformo in un numero
    if (limit && !isNaN(limit) && limit >= 0) {  // se quel numero è compreso in elenco ed è >= 0, taglio l'array dei post dall'indice 0 al numero limi inserito in query string
        filteredPosts = filteredPosts.slice(0, limit)
    }

    // se il post non esiste (quindi l'elenco dopo i filtri è vuoto), ritorno l'errore
    if (filteredPosts.length === 0) {
        res.status(404).json({
            error: 'Post not found',
            message: 'Il post non è stato trovato'
        })
    }

    res.json(filteredPosts)     // rispondo con un json che contiene l'elenco intero, o se si entra nell'if, quello filtrato
}

// funzione rotta show => visualizzare un elemento 
const show = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(`Ecco il post con id: ${id}`)

    const post = posts.find((post) => post.id === id)
    let result = post

    if (!post) {        // se il post non esiste
        console.log('post non trovato')

        res.status(404) // imposto l'errore
        result = {   // se non esiste ritorno un oggetto con gli errori
            error: 'Post not found',
            message: 'Il post non è stato trovato'
        }
    }

    res.json(result)    // ritorno un json con l'elemento selezionato, altrimenti ritorno l'errore
}

// funzione rotta store => creare un nuovo elemento
const store = (req, res) => {
    res.send('Creo un nuovo post')
}

// funzione rotta update => modificare interamente un elemento
const update = (req, res) => {
    const id = parseInt(req.params.id)
    res.send(`Modifico interamente il post con id: ${id}`)
}

// funzione rotta modify => modificare parzialmente un elemento
const modify = (req, res) => {
    const id = parseInt(req.params.id)
    res.send(`Modifico parzialmente il post con id: ${id}`)
}

// funzione rotta destroy => eliminare un elemento
const destroy = (req, res) => {
    const id = parseInt(req.params.id)

    // recupero in una variabile l'indice dell'id corrispondente al post
    const postIndex = posts.findIndex((post) => post.id === id)

    // se l'indice non è compreso imposto l'errore
    if (postIndex === -1) {
        res.status(404)

        return res.json({
            error: 'Post not found',
            message: 'post selected not found',
        })
    }

    // rimuovo il post selezionato corrispondente all'id
    posts.splice(postIndex, 1)

    console.log(posts)

    res.sendStatus(204) // rispondo con esito positivo ma senza contenuto

}

module.exports = { index, show, store, update, modify, destroy }