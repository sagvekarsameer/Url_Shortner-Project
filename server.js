const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const shortUrl = require('./models/urlShortner')

app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs')
app.get('/',async(req, res)=>{
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls })
})

app.post('/shortUrls',async(req,res)=>{
    await shortUrl.create({full:req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const url = await shortUrl.findOne({ short: req.params.shortUrl })

    if (!url) return res.sendStatus(404)

    url.clicks += 1
    await url.save()
    res.redirect(url.full)
})

const port = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urlShortner')
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT: ${port}`)
        })
    })
    .catch(error => {
        console.error('Could not connect to MongoDB:', error.message)
    })
