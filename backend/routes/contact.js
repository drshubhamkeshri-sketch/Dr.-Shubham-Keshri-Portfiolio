const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// In-memory fallback if DB is disconnected
const memoryFallback = [];

// POST /api/contact - Submit Inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, organization, interest, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: Name, Official Email, and Brief Message.'
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      organization: organization ? organization.trim() : '',
      interest: interest || 'Land Intelligence / CALI AI',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date()
    };

    let saved;
    try {
      const doc = new Contact(payload);
      saved = await doc.save();
    } catch (dbErr) {
      console.warn('MongoDB Atlas write fallback:', dbErr.message);
      payload._id = 'mem_' + Date.now();
      memoryFallback.unshift(payload);
      saved = payload;
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry successfully registered in Dr. Shubham Keshri’s Executive Telemetry Database.',
      data: {
        id: saved._id,
        name: saved.name,
        storedIn: saved instanceof Contact ? 'MongoDB Atlas' : 'Memory Cache'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/contacts - List Inquiries (Admin)
router.get('/', async (req, res) => {
  try {
    let contacts = [];
    try {
      contacts = await Contact.find().sort({ createdAt: -1 }).limit(200).lean();
    } catch (e) {
      contacts = memoryFallback;
    }

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/contacts/:id - Update Status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    try {
      updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    } catch (e) {
      const item = memoryFallback.find(c => c._id === id);
      if (item) item.status = status;
      updated = item;
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/contacts/:id - Remove Inquiry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Contact.findByIdAndDelete(id);
    } catch (e) {
      const idx = memoryFallback.findIndex(c => c._id === id);
      if (idx !== -1) memoryFallback.splice(idx, 1);
    }

    res.json({ success: true, message: 'Inquiry record permanently purged.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/contacts/export - CSV Export
router.get('/export', async (req, res) => {
  try {
    let contacts = [];
    try {
      contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    } catch (e) {
      contacts = memoryFallback;
    }

    let csv = 'ID,Date,Name,Email,Phone,Organization,Interest,Status,Message\n';
    contacts.forEach(c => {
      const cleanMsg = (c.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${c._id}","${new Date(c.createdAt).toISOString()}","${c.name}","${c.email}","${c.phone || ''}","${c.organization || ''}","${c.interest}","${c.status || 'unread'}","${cleanMsg}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Dr_Keshri_Executive_Inquiries.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).send('Error generating export: ' + err.message);
  }
});

module.exports = router;
