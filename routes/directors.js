const express = require('express');
const router = express.Router();
const directorDao = require('../dao/directorDao');

// ==================== JSON / API ROUTES ====================

// Get all directors (JSON)
router.get('/api', async (req, res) => {
  try {
    const directors = await directorDao.findAll();
    res.json(directors);
  } catch (err) {
    console.error('Error fetching directors (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single director by ID (JSON)
router.get('/api/:id', async (req, res) => {
  try {
    const director = await directorDao.findById(req.params.id);
    if (!director) return res.status(404).json({ error: 'Director not found' });
    res.json(director);
  } catch (err) {
    console.error('Error fetching director (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== UNIQUE DAO METHODS ====================

// Sort directors alphabetically A → Z or Z → A
router.get('/sort/name/:order', async (req, res) => {
  try {
    const order = req.params.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const directors = await directorDao.sortByName(order);
    res.render('directors/index', { directors });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Sort directors by number of programs (most → least)
router.get('/sort/programs', async (req, res) => {
  try {
    const directors = await directorDao.sortByProgramCount('DESC'); // most → least
    res.render('directors/index', { directors });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ==================== HTML ROUTES ====================

// GET /directors — list all (HTML)
router.get('/', async (req, res) => {
  try {
    const directors = await directorDao.findAll();
    res.render('directors/index', { directors });
  } catch (err) {
    console.error('Error fetching directors:', err);
    res.status(500).send('Internal server error');
  }
});

// GET /directors/:id — show single (HTML)
router.get('/:id', async (req, res) => {
  try {
    const director = await directorDao.findById(req.params.id);
    if (!director) return res.status(404).render('404', { url: req.originalUrl });
    res.render('directors/show', { director });
  } catch (err) {
    console.error('Error fetching director:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;