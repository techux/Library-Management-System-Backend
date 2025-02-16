const express = require('express');
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const dbConnect = require("./utils/dbConnect");

const authRoute = require("./routes/auth.route");
const bookRoute = require("./routes/book.route");
const accountRoute = require("./routes/account.route");
const adminRoute = require("./routes/admin.route");

const { auth, restrictTo} = require("./middlewares/auth.middleware");

const PORT = process.env.PORT || 9090 ;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.get("/api/ping", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "pong"
    })
})

app.use("/api/auth", authRoute);
app.use("/api/account", auth, restrictTo(["member"]), accountRoute);
app.use("/api/books", bookRoute);
app.use("/api/admin", auth, restrictTo(["librarian"]), adminRoute);

app.listen(PORT, ()=>{
    console.log(`[INFO] Server is running on port ${PORT}`)
    dbConnect();
})