const express = require('express');
const path = require ('path');
const app = express();
const PORT = process.env.PORT ||3000;
// usual port for express.js is 3000

app.engine('ejs', require('ejs').__express);
// use double underscore
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello Express!')
});

app.get('/about', (req, res) => {
    res.send('About Us Page')
});

app.get('/product/:id', (req, res) => {
    const {id} = req.params;
    res.send('Product ID: '  + id)
});

app.get('/search', (req, res) => {
    const {keyword, page} = req.query;
    res.send('Search: ' + keyword + ' (page: ' + page + ')');
});

app.post('/users', (req, res) => {
    const name = req.query.name;
    res.status(201).send(`Hello ${name}`);
});

const blogRoutes = require('./routes/blog/blog_routes');
app.use('/blogs', blogRoutes);

const contactRoutes = require( './routes/contact/contact_routes' );
app.use( '/contacts', contactRoutes );

app.listen(PORT, () => 
    console.log(`Server running on: http://localhost:${PORT}`
));