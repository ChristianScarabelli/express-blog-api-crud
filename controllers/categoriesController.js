const categories = require('../data/categories.js')

// rotta index per le categorie
const index = (req, res) => {
    console.log('elenco delle categorie')

    res.json(categories)

}

module.exports = { index }