const express = require('express');
const router = express.Router();
const actorDao = require('../dao/actorDao');

// ==================== JSON / API ROUTES ====================

// Get all actors (JSON)
router.get('/api', async (req, res) => {
    try {
        const actors = await actorDao.findAll();
        res.json(actors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get single actor by ID (JSON)
router.get('/api/:id', async (req, res) => {
    try {
        const actor = await actorDao.findById(req.params.id);
        if (!actor) return res.status(404).json({ error: 'Actor not found' });
        res.json(actor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ==================== HTML ROUTES ====================

// Display all actors
router.get('/', async (req, res) => {
    try {
        const actors = await actorDao.findAll();
        const totalActors = await actorDao.countAll(); // <-- add this
        res.render('actors/index', { actors, totalActors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Form to add a new actor
router.get('/add', (req, res) => {
    res.render('actors/add');
});

// Form to edit an actor
router.get('/edit/:id', async (req, res) => {
    try {
        const actor = await actorDao.findById(req.params.id);
        if (!actor) return res.status(404).render('404');
        res.render('actors/editActor', { actor });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ==================== UNIQUE DAO METHODS ====================

// Search actors by name
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const actors = await actorDao.search(['name'], query);
        res.render('actors/index', { actors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Sort actors by name (A → Z or Z → A)
router.get('/sort/name/:order', async (req, res) => {
    try {
        const order = req.params.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const actors = await actorDao.findAllByName(order);
        res.render('actors/index', { actors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Sort actors by birthdate (Oldest → Youngest or Youngest → Oldest)
router.get('/sort/birthdate/:order', async (req, res) => {
    try {
        const order = req.params.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const actors = await actorDao.findAllByBirthdate(order);
        res.render('actors/index', { actors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ==================== SINGLE ACTOR ROUTES ====================

// Show single actor (HTML)
router.get('/:id', async (req, res) => {
    try {
        const actor = await actorDao.findById(req.params.id);
        if (!actor) return res.status(404).render('404', { url: req.originalUrl });
        res.render('actors/show', { actor });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle form submission to update actor
router.post('/edit/:id', async (req, res) => {
    try {
        const { name, birthdate, bio } = req.body;
        await actorDao.update(req.params.id, { name, birthdate, bio });
        res.redirect('/actors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Handle form submission to create new actor
router.post('/', async (req, res) => {
    try {
        const { name, birthdate, bio } = req.body;
        await actorDao.create({ name, birthdate, bio });
        res.redirect('/actors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;