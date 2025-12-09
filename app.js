// app.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./config/db');

const indexRouter = require('./routes/index'); // Home page
const programsRouter = require('./routes/programs');
const actorsRouter = require('./routes/actors');
const directorsRouter = require('./routes/directors');
const producersRouter = require('./routes/producers');
const platformsRouter = require('./routes/streamingPlatforms'); // matches your file name

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// postman route to add a new program
app.post('/api/programs', async (req, res) => {
  try {
    const { title, yr_released, runtime_minutes, format, program_rating, rating, description } = req.body;

    // Insert into your database
    await db.query(
  'INSERT INTO Program (title, yr_released, runtime_minutes, format, program_rating, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [title, yr_released, runtime_minutes, format, program_rating, rating, description]
);

    // Respond with JSON so Postman shows it clearly
    res.status(201).json({ message: 'Program added', program: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/programs', programsRouter);
app.use('/actors', actorsRouter);
app.use('/directors', directorsRouter);
app.use('/producers', producersRouter);
app.use('/platforms', platformsRouter);

// 404 page
app.use((req, res) => {
    res.status(404).render("404", { url: req.originalUrl });
});

// Start server
app.listen(PORT, () => console.log(`LIVE on http://localhost:${PORT}`));