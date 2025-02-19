const express = require('express');

const {
    allBookController,
    getBookBySlugController,
    searchBookController,
    getBookByIdController
    } = require("../controllers/book.controller");
    

const router = express.Router();

router.get("/", allBookController); // get all book
router.get("/search", searchBookController); // search book by keywords
router.get("/id/:id", getBookByIdController); // get book by slug
router.get("/:slug", getBookBySlugController); // get book by slug


module.exports = router;