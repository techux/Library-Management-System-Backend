const express = require('express');
const {
    addMemberController,
    updateMemberController,
    viewMemberController,
    viewAllMembersController,
    removeMemberCotroller,
    searchMemberController
    } = require("../controllers/admin.controller");

const {
    updateBookController,
    deleteBookController,
    addBookController
} = require("../controllers/book.controller");

const router = express.Router();

router.get("/search", searchMemberController) ;
router.get("/members", viewAllMembersController);
router.post("/member", addMemberController);
router.get("/member/:id", viewMemberController);
router.patch("/member/:id", updateMemberController);
router.delete("/member/:id", removeMemberCotroller)

router.post("/book", addBookController);
router.patch("/book/:id", updateBookController);
router.delete("/book/:id", deleteBookController);



module.exports = router;