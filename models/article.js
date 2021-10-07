// This class just creates a database 

const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }

})

// validates our article any time it is created/updated
articleSchema.pre('validate', function(next) {
    // creates a url from the title after making the following changes
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true, // forces the url to be lowercase
            strict: true // removes any chars not validate for a url, like ':'
        })
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    
    next()
})

//table name = Article, column names defined in articleSchema
module.exports = mongoose.model('Article', articleSchema)