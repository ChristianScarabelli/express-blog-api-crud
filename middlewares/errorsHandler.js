// funzione per gesitre gli errori
const errorsHandler = (err, req, res, next) => {       // non inserisco il next perchè vogli oche la funzione fermi il codice in caso di errore

    res.status(500)
    res.json({
        message: err.message
    })
    console.log(err)

}

module.exports = errorsHandler