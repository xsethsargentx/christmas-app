const express = require("express");
const router = express.Router();
const programsDAO = require('../dao/programDao.js');

// ==========================
// API ROUTES (JSON)
// ==========================

// GET all programs (JSON)
router.get("/api", async (req, res) => {
    try {
        const programs = await programsDAO.findAll();
        res.json(programs);
    } catch (error) {
        console.error("Error fetching programs (API):", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET single program by ID with credits (JSON)
router.get("/api/:id", async (req, res) => {
    try {
        const program = await programsDAO.findByIdWithCredits(req.params.id);
        if (!program) return res.status(404).json({ error: "Program not found" });
        res.json(program);
    } catch (error) {
        console.error("Error fetching program (API):", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================
// HTML ROUTES
// ==========================

// GET all programs (HTML)
router.get("/", async (req, res) => {
    try {
        const programs = await programsDAO.findAll();
        const totalPrograms = await programsDAO.countAll();

        const programsWithImages = programs.map(program => ({
            ...program,
            img_url: `/images/program${program.program_id}.jpg`
        }));

        res.render("programs/index", { programs: programsWithImages, totalPrograms });
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).send("Internal server error");
    }
});

// GET form to add a new program
router.get("/add", (req, res) => {
    res.render("programs/add"); // create views/programs/add.ejs
});

router.post('/add', async (req, res) => {
    try {
        const {
            title,
            yr_released,
            runtime_minutes,
            format,
            program_rating,
            rating,
            description
        } = req.body;

        if (!title) {
            return res.status(400).send("Title is required");
        }

        // Convert year, runtime, and rating to proper types
        const yr = yr_released ? parseInt(yr_released, 10) : null;
        const runtime = runtime_minutes ? parseInt(runtime_minutes, 10) : null;
        const score = rating ? parseFloat(rating) : null;

        // Validate year range
        if (yr && (yr < 1901 || yr > 2155)) {
            return res.status(400).send("Year must be between 1901 and 2155");
        }

        // Validate format (must match ENUM)
        const validFormats = ['live-action','stop-motion','animation','hybrid','documentary'];
        if (format && !validFormats.includes(format)) {
            return res.status(400).send("Invalid format");
        }

        await programsDAO.createProgram({
            title,
            yr_released: yr,
            runtime_minutes: runtime,
            format,
            program_rating,
            rating: score,
            description
        });

        res.redirect('/programs');
    } catch (error) {
        console.error("Error adding program:", error);
        res.status(500).send("Internal server error");
    }
});

// GET programs by rating
router.get("/rating/:rating", async (req, res) => {
    try {
        const programs = await programsDAO.findByRating(req.params.rating);
        res.render("programs/byRating", {
            rating: req.params.rating,
            programs
        });
    } catch (err) {
        console.error("Error fetching by rating:", err);
        res.status(500).send("Server error");
    }
});

// GET programs sorted by year
router.get("/year/:order", async (req, res) => {
    try {
        const order = req.params.order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        const programs = await programsDAO.sortByYear(order);

        res.render("programs/byYear", {
            order,
            programs
        });
    } catch (err) {
        console.error("Error sorting by year:", err);
        res.status(500).send("Server error");
    }
});

// Form to edit a program
router.get('/edit/:id', async (req, res) => {
    try {
        const program = await programsDAO.findById(req.params.id);
        if (!program) return res.status(404).render('404');

        res.render('programs/edit', { program });
    } catch (error) {
        console.error("Error fetching program for edit:", error);
        res.status(500).send("Internal server error");
    }
});

// Handle program update
router.post('/edit/:id', async (req, res) => {
    try {
        const { title, yr_released, runtime_minutes, format, program_rating, rating, description } = req.body;

        await programsDAO.updateProgram(req.params.id, {
            title,
            yr_released,
            runtime_minutes,
            format,
            program_rating,
            rating,
            description
        });

        res.redirect('/programs');
    } catch (error) {
        console.error("Error updating program:", error);
        res.status(500).send("Internal server error");
    }
});

// DELETE a program
router.post("/:id/delete", async (req, res) => {
    try {
        await programsDAO.deleteProgram(req.params.id);
        res.redirect("/programs");
    } catch (error) {
        console.error("Error deleting program:", error);
        res.status(500).send("Internal server error");
    }
});

// SINGLE PROGRAM — MUST BE LAST
router.get("/:id", async (req, res) => {
    try {
        const program = await programsDAO.findByIdWithCredits(req.params.id);
        if (!program) return res.status(404).render("404");

        program.img_url = `/images/program${program.program_id}.jpg`;

        res.render("programs/show", { program });
    } catch (error) {
        console.error("Error fetching program:", error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;