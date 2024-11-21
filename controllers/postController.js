const posts = require('../data/posts.js')    // richiamo l'array di oggetti della risorsa post quì dove si svolgono le funzioni
let lastIndex = posts.at(-1).id        // variabile globale che racchiude l'id dell'ultimo elemento dell'array posts

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
    const param = req.params.id // salvo in una variabile il parametro, che può essere sia ID che slug
    const id = parseInt(param)      // recupero in una variabile il parametro del post richiesto trasformato in numero

    console.log(`Ecco il post con parametro: ${param}`)

    let post      // inizializzo una variabile che cambierà e verrà ritornata in json in base alla ricerca

    if (!isNaN(id) && id > 0) {    // se il parametro scritto è un numero valido cerco per id
        post = posts.find((post) => post.id === id)  // cerco nell'array posts l'elemento post con ID uguale a quello della richiesta con query string
    } else {      // altrimenti cerco per lo slug inserito
        post = posts.find((post) => post.slug === param)
    }

    if (!post) {        // se il post non esiste
        console.log('post non trovato')

        res.status(404).json({      // se non esiste ritorno un json con gli errori
            error: 'Post not found',
            message: 'Il post non è stato trovato'
        })
    }
    res.json(post)    // ritorno un json con l'elemento post selezionato per id o per slug, altrimenti ritorno l'errore
}

// funzione rotta store => creare un nuovo elemento
const store = (req, res) => {
    const { title, slug, content, image, tags } = req.body   // destrutturo in una variabile i dati in arrivo con la body request
    // console.log(req.body)

    const errors = validateData(req) // Validazione

    if (errors.lenght > 0) {  // se l'array di stringhe di errori non è vuoto, c'è l'errore e lo imposto
        res.status(400)

        return res.json({
            error: 'Invalid request',
            messages: errors,
        })
    }

    lastIndex++     // incremento l'id così al nuovo oggetto ne verrà assegnato uno in sequenza

    const newPost = {
        title,
        slug,
        id: lastIndex,      // associo alla proprietà id il valore incrementato 
        content,
        image,
        tags
    }

    posts.push(newPost)     // aggiungo il nuovo post all'array principale
    res.status(201).send(newPost)       // invio status positivo e il nuovo post
    // console.log(newPost)
}

// funzione rotta update => modificare interamente un elemento
const update = (req, res) => {
    const id = parseInt(req.params.id)
    // res.send(`Modifico interamente il post con id: ${id}`)
    const errors = validateData(req)     // validazione

    if (errors.lenght > 0) {
        res.status(400)

        return res.json({
            error: 'invalid request!',
            message: errors
        })
    }

    const post = posts.find((post) => post.id === id)  // cerco il post con id corrispondente al parametro ricevuto

    if (!post) {     // se il post non esiste, ritorno l'errore
        res.status(404)

        return res.json({
            error: 'post not found',
            message: 'Post not founded.',
        })
    }

    // validazione dati del body
    // update del post con i dati della body request
    const { title, slug, content, image, tags } = req.body

    post.title = title
    post.slug = slug
    post.content = content
    post.image = image
    post.tags = tags

    res.json(post)      // rispondo con il json del nuovo post
}

// funzione rotta modify => modificare parzialmente un elemento
const modify = (req, res) => {
    const id = parseInt(req.params.id)
    // res.send(`Modifico parzialmente il post con id: ${id}`)

    const post = posts.find((post) => post.id === id)  // cerco il post con id corrispondente al parametro ricevuto

    if (!post) {     // se il post non esiste, ritorno l'errore
        res.status(404)

        return res.json({
            error: 'post not found',
            message: 'Post not founded.',
        })
    }

    // validazione dati del body
    // update del post con i dati della body request
    const { title, slug, content, image, tags } = req.body

    if (title) post.title = title   // se il parametro title esiste, il title del post sarà il title passato nella request
    if (slug) post.slug = slug
    if (content) post.content = content
    if (image) post.image = image
    if (tags) post.tags = tags

    res.json(post)      // rispondo con il json del nuovo post
}

// funzione rotta destroy => eliminare un elemento
const destroy = (req, res) => {
    const param = req.params.id     // il parametro può essere un ID o uno slug
    const id = parseInt(param)      // converto il parametro in un numero e lo salvo nella variabile id

    let postIndex

    if (!isNaN(id) && id > 0) {     // se l'id è un numero valido e >0,  recupero nella variabile l'indice dell'id corrispondente al post
        postIndex = posts.findIndex((post) => post.id === id)
    } else {
        postIndex = posts.findIndex((post) => post.slug === param) // altrimenti guardo se il parametro inserito è === allo slug
    }

    // se l'indice non è compreso imposto l'errore
    if (postIndex === -1) {
        res.status(404)

        return res.json({
            error: 'Post not found',
            message: 'post selected not found',
        })
    }

    // rimuovo il post selezionato in base al parametro (id o slug)
    posts.splice(postIndex, 1)

    console.log(posts) // post rimanenti dopo l'eliminazione

    res.sendStatus(204) // rispondo con esito positivo ma senza contenuto
}

module.exports = { index, show, store, update, modify, destroy }


// funzione per validare i dati, che prende come parametro la request
const validateData = (req) => {
    const { title, slug, content, image, tags } = req.body

    let errors = []

    if (!title) {       // se i vari parametri non esistono, creo l'errore e lo pusho nell'array vuoto di errori
        errors.push('title is required')
    }

    if (!slug) {
        errors.push('slug is required')
    }

    if (!content) {
        errors.push('content is required')
    }

    if (!image) {
        errors.push('image is required')
    }

    if (!tags) {
        errors.push('tags are required')
    }

    return errors
}