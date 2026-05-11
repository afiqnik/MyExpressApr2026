const express = require('express');
const router = express.Router();
const db = require('../../database');

// Users List Page - Get all users from database
router.get('/', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM users');
        const users = result;
        // console.log(users);
        res.render('user_pages/users', {
            title: 'Users Management',
            content: 'Manage your users',
            // users: users
            users
        });
    } catch (err) {
        console.log(err);
    }
});

// Show add user form page
router.get('/add', (req, res) => {
    renderFormPage(res);
});

// Get single user details using ID
router.get('/:id', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        const user = result[0];
        if (!user) return res.status(404).send('User not found');
        res.render('user_pages/user_details', {
            title: 'User Details',
            content: 'View your user',
            // users: users
            user
        });
    } catch (err) {
        console.log(err);
    }
});

// Create reusable form renderer
function renderFormPage(res, error = null, user = null) {
    const isUpdate = !!user;

    res.render('user_pages/user_form', {
        title: isUpdate ? 'Update User' : 'New User',
        content: isUpdate ? 'Change user details' : 'Fill up user details',
        error,
        user,
        formAction: isUpdate ? '/users/update/' + user.id + '?_method=PUT' : '/users/add'
    });
};

// Validate form input data
function validateForm(name, phone, email, res, userId = null) {
    // Validate name field
    if (!name || name.trim() == '') {
        renderFormPage(res, 'Name is required', { name, email, phone, id: userId });
        return false;
    }

    // Validate phone number
    if (!phone || !/^\d{6,12}$/.test(phone)) {
        renderFormPage(res, 'Valid phone is required', { name, email, phone, id: userId });
        return false;
    }

    // Validate email address
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        renderFormPage(res, 'Valid email is required', { name, email, phone, id: userId });
        return false;
    }
    // All validations passed
    return true;
}

// Handle add user form submission
router.post('/add', async (req, res) => {
    // Extract form data from request body
    const { name, email, phone } = req.body;

    // Validate user input
    if (!validateForm(name, phone, email)) {
        return;
    }
    try {
        await db.query('INSERT INTO users (name, email, phone) VALUES (?,?,?)', [name, email, phone]);
        res.redirect('/users');
    } catch (err) {
        renderFormPage(res, 'Database error. please check with admin', { name, email, phone });
    }
});

// Handle delete user request
router.delete('/delete/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows == 0) return res.status(404).send('User not found');
        res.redirect('/users');
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occured. Unable to delete from database.');
    }
});

// Show update form page
router.get('/update/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length < 1) return res.status(404).send('User not found');
        const user = rows[0];
        console.log(user);
        renderFormPage(res, null, user);
    } catch (err) {

    }
});

// Handle update form submission
router.put('/update/:id', async (req, res) => {
    const { name, email, phone } = req.body;
    if (!validateForm(name, phone, email, res, req.params.id)) {
        return;
    }
    try {
        const [result] = await db.query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
            [name, email, phone, req.params.id]);
        if (result.affectedRows == 0) return res.status(404).send('User not found');
        res.redirect('/users');
    } catch (err) {
        renderFormPage(res, 'Database error');
    }

});

module.exports = router;
