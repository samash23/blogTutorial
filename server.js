const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const app = express()
const methodOverride = require('method-override')
const port = 5000

// connects database - '/blog' is the name of the database
mongoose.connect(`mongodb://localhost/blog`, { 
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true
})

app.set('view engine', 'ejs')

//This is saying that we can access all of the parameters in the Article form
// from the article route (articles.js)
app.use(express.urlencoded({ extended: false }))

// This is used because when Google clicks every link on a website and if you are using a '<a href=' it will delete
// all articles. Using the methodOverride package with '<form action=' that will not happen.
app.use(methodOverride('_method'))

// Main route that server looks for when it starts
app.get('/', async (req, res) => {
    console.log("server.js - app.get(/)")

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

     //gives us every article sorted by newest at the top
    const articlesConst = await Article.find().sort({
        createdAt: 'desc'
    })

    // passes 'articles' variable to index
    res.render('./articles/index', { articles: articlesConst })
})

app.use('/articles', articleRouter) // => {
//     console.log("server.js - app.use(/articles)")
// })

app.listen(5000, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
})
