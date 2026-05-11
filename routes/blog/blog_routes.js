// using express.Router() to  maintain route
const express = require('express');
const router = express.Router();

const posts = [
    { id: 1, title: 'Hello Express' },
    { id: 2, title: 'Tips on Using Express JS' },
];

router.get('/', (req, res) => {
    // res.send('All blog posts')
    res.render('blog_pages/blogs', {
        title: 'My Blog',
        content: 'A space for coding tips and tech insights.',
        posts
    });
});

// router.get('/:id', (req, res) => {
//     res.send('Currently viewing blog post ID: ' + req.params.id);
// });

router.get('/post/:id', (req, res) => {
    const post = posts.find(p => p.id === Number(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('blog_pages/post', { post });
});

module.exports = router;