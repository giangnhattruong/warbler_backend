require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const {getAllMessages} = require("./controllers/messages");

const port = process.env.PORT || 8080;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users/:userId/messages", messagesRoutes);

app.use("/api/messages", getAllMessages)

app.all("*", (req, res, next) => {
    next(new ExpressError("Not found", 404));
});
  
app.use((err, req, res, next) => {
    let error;
    const { message = "Oops! Something went wrong.", status = 500 } = err;
    if (process.env.NODE_ENV !== "production") {
        error = {
            message,
            stack: err.stack
        }
    } else {
        error = {
            message,
        }
    }
    res.status(status).json({
        error
    });
});

app.listen(port, () => {
    console.log(`APP IS RUNNING ON PORT ${port}`)
});