const express = require('express');
const router = express.Router();

const contacts = [
  { id: 1, name: 'Khairul Adnan', phone: '01123346677' },
  { id: 2, name: 'Siti Huda', phone: '0139974545' }
];

router.get('/', (req, res) => {
  res.render('contact_pages/contacts', {
    title: 'My Contact List',
    content: 'Manage and view details.',
    contacts
  });
});

// Render Form Page
function renderFormPage(res, error = null) {
  res.render('contact_pages/contact_form', {
    title: 'Add New Contact',
    content: 'Fill in the details to add a new contact.',
    error,
    formAction: '/contacts/add'
  });
}

// Add Contact Form
router.get('/add', (req, res) => renderFormPage(res));

// Handle Add Contact
router.post('/add', (req, res) => {
  const { name, phone } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return renderFormPage(res, 'Name cannot be empty.');
  }

  if (!phone || !/^\d+$/.test(phone)) {
    return renderFormPage(res, 'Phone number must contain numbers only and cannot be empty.');
  }

  // Add New Contact And Redirect Back
  const newContact = {
    id: contacts.length + 1,
    name,
    phone
  };
  contacts.push(newContact);
  res.redirect('/contacts');
});



module.exports = router;