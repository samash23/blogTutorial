const express = require('express')
const Article = require('./../models/article') //instance of DB
const router = express.Router()

/*
Route to /new article page
passes in an empty article object to start
*/
router.get('/new', (req, res) => {
    console.log("routes/articles - router.get(/new)")
    res.render('articles/new', { article: new Article() })
})

// edit article from article page
router.get('/edit/:id', async (req, res) => {
    console.log("routes/articles - router.get(/edit/:id)")
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

// function that runs when the save button is clicked. Routes user when save is clicked
router.get('/:slug', async(req, res) => {
    console.log("routes/articles.js - router.get(/:slug)")
    const article = await Article.findOne({ slug: req.params.slug })
    // if an article with that id is not found, redirect to the home page
    if (article == null) res.redirect('/') 
    res.render('articles/show', {article: article})
})

// Saves the article to database.
// Creates a new article instance (article.js). Makes it 
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next() //this means go to the next function in the list which is saveArticleAndRedirect
}, saveArticleAndRedirect('new'))

// Edits the article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next() //this means go to the next function in the list which is saveArticleAndRedirect
}, saveArticleAndRedirect('edit'))

// deletes article then routes back to home page
router.delete('/:id', async (req, res) => {
    console.log("routes/articles.js - router.delete(/:id)")
    try {
        console.log("req.params.id: ", req.params.id)
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (e) {
        console.log("Deleting failed: ", e)
    }
})

// called from the router.post call used to save or edit. this just makes it possible to use the path as a param to
// specify saving or editing
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        console.log("routes/articles.js - router.post(/)")
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`) // backticks not quotes
        } catch (e) {
            console.log("Error Saving Article: ", e)
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router
 