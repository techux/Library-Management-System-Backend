const express = require('express');
const { 
    myProfileController, 
    deleteAccountController, 
    updateProfileController } = require("../controllers/account.controller");

const {
    borrowBookController,
    removeBookFromShelfController,
    myBookController,
    myHistoryController
    } = require("../controllers/book.controller");

const router = express.Router();

router.get("/profile", myProfileController);
router.patch("/update", updateProfileController);
router.delete("/", deleteAccountController);

router.get("/borrowed", myBookController);
router.get("/history", myHistoryController);
router.get("/return/:id", removeBookFromShelfController);
router.get("/borrow/:id", borrowBookController);


module.exports = router;