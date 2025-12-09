const express = require('express');
const router = express.Router();
const producerDao = require('../dao/producerDao');

// GET /producers — list all
router.get('/', async (req, res) => {
  try {
    const producers = await producerDao.findAll();
    res.render('producers/index', { producers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// GET /producers/:id — show single
router.get('/:id', async (req, res) => {
  try {
    const producer = await producerDao.findById(req.params.id);
    if (!producer) return res.status(404).render('404');
    res.render('producers/show', { producer });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Unique DAO method 1: Sort alphabetically
router.get('/sort/:order', async (req, res) => {
  try {
    const order = req.params.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const producers = await producerDao.sortByName(order);
    res.render('producers/index', { producers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Unique DAO method 2: Filter by country
router.get('/country/:country', async (req, res) => {
  try {
    const producers = await producerDao.findByCountry(req.params.country);
    res.render('producers/index', { producers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;