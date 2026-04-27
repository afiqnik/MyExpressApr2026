const express = require('express');
const router = express.Router();

const contacts = [
  { id:1, name:'Khairul Adnan', phone: '01123346677' },
  { id:2, name:'Siti Huda', phone: '0139974545' }
];

router.get('/', (req, res) => {
  res.render('contact_pages/contacts', {
    title: 'My Contact List',
    content: 'Manage and view details.',
    contacts
  });
});

module.exports = router;