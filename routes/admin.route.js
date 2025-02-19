const express = require('express');
const upload = require("../middlewares/multer.middleware");

const {
    addMemberController,
    updateMemberController,
    viewMemberController,
    viewAllMembersController,
    removeMemberCotroller,
    searchMemberController,
    statController
    } = require("../controllers/admin.controller");

const {
    updateBookController,
    deleteBookController,
    addBookController
} = require("../controllers/book.controller");

const router = express.Router();

router.get("/stats", statController) ;
router.get("/search", searchMemberController) ;
router.get("/members", viewAllMembersController);
router.post("/member", addMemberController);
router.get("/member/:id", viewMemberController);
router.patch("/member/:id", updateMemberController);
router.delete("/member/:id", removeMemberCotroller)

router.post('/book', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'bookPdf', maxCount: 1 }]), addBookController);
router.patch("/book/:id", updateBookController);
router.delete("/book/:id", deleteBookController);



module.exports = router;