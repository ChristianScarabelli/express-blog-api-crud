// console.log('API CRUD')


const express = require('express')      // richiamo express
const postsRouter = require('./routers/postRouter.js')      // importo il router delle rotte della risorsa posts
const errorsHandler = require('./middlewares/errorsHandler.js')  // importo il middleware di gestione degli errori
const notFound = require('./middlewares/notFound.js')
const app = express()
const port = 3000


// rendo accessibile al server la directory 'public'
app.use(express.static('public'))

// permetto di accettare file json nella body request
app.use(express.json())

// creo la rotta principale del mio server
app.get('/', (req, res) => {
    res.send('server del mio blog')
})

// utilizzo le rotte della risorsa posts e inizializzo il prefisso /posts per tutte le rotte
app.use('/posts', postsRouter)

// uso il middleware di errore globalmente e dopo tutte le rotte
app.use(errorsHandler)
// uso il middleware di errore 404 globalmente, dopo tutte le rotte e dopo l'altro middleware di errore
app.use(notFound)

// metto il mio server in ascolto della porta
app.listen(port, () => {
    console.log(`Il server del mio blog è in ascolto della porta: ${port}`)
})