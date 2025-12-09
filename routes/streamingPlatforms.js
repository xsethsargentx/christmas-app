const express = require('express');
const router = express.Router();
const platformDao = require('../dao/streamingPlatformDao');

// ==================== JSON / API ROUTES ====================

// Get all platforms (JSON)
router.get('/api', async (req, res) => {
  try {
    const platforms = await platformDao.findAll();
    res.json(platforms);
  } catch (err) {
    console.error('Error fetching platforms (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single platform by ID (JSON)
router.get('/api/:id', async (req, res) => {
  try {
    const platform = await platformDao.findById(req.params.id);
    if (!platform) return res.status(404).json({ error: 'Platform not found' });
    res.json(platform);
  } catch (err) {
    console.error('Error fetching platform (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platforms by name (JSON)
router.get('/api/search/:name', async (req, res) => {
  try {
    const platforms = await platformDao.findByName(req.params.name);
    res.json(platforms);
  } catch (err) {
    console.error('Error searching platforms (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platforms by program (JSON)
router.get('/api/program/:programId', async (req, res) => {
  try {
    const platforms = await platformDao.findByProgram(req.params.programId);
    res.json(platforms);
  } catch (err) {
    console.error('Error fetching platforms for program (API):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== HTML ROUTES ====================

// GET /platforms — list all (HTML)
router.get('/', async (req, res) => {
  try {
    const platforms = await platformDao.findAll();
    res.render('streamingPlatforms/index', { platforms });
  } catch (err) {
    console.error('Error fetching platforms:', err);
    res.status(500).send('Internal server error');
  }
});

// GET /platforms/:id — show single (HTML)
router.get('/:id', async (req, res) => {
  try {
    const platform = await platformDao.findById(req.params.id);
    if (!platform) return res.status(404).render('404', { url: req.originalUrl });
    res.render('platforms/show', { platform });
  } catch (err) {
    console.error('Error fetching platform:', err);
    res.status(500).send('Internal server error');
  }
});

// ==================== UNIQUE DAO METHODS HTML ====================

// Sort alphabetically A→Z or Z→A
router.get('/sort/name/:order', async (req, res) => {
  try {
    const order = req.params.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const platforms = await platformDao.sortByName(order);
    res.render('streamingPlatforms/index', { platforms });
  } catch (err) {
    console.error('Error sorting by name:', err);
    res.status(500).send('Server Error');
  }
});

// Sort by number of programs (most → least)
router.get('/sort/programs', async (req, res) => {
  try {
    const platforms = await platformDao.sortByProgramCount();
    res.render('streamingPlatforms/index', { platforms });
  } catch (err) {
    console.error('Error sorting by program count:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;