const express = require("express");
let bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(logger.log);
app.use(express.json({ limit: "200mb" }));

// import routes
// const messageRoute = require('./routes/messages');
const pingRoute = require("./routes/ping");
// const utilityRoute = require("./routes/utilities");
const shopping = require("./routes/shopping");
const loginRouter = require("./routes/public/login");
const signUpRouter = require("./routes/public/signup");
const todoRouter = require("./routes/todo");
// const dashboardRouter = require("./routes/dashboard");
// const reportRouter = require("./routes/report");

// app.use('/message', messageRoute);
app.use("/ping", pingRoute);
// app.use("/api/utilities", utilityRoute);
app.use("/api/shopping", shopping);
app.use("/api/todo", todoRouter);
app.use("/api/login", loginRouter);
app.use("/api/signup", signUpRouter);
// app.use("/api/dashboard", dashboardRouter);
// app.use("/api/report", reportRouter);

// routes
app.get("/", (req, res) => {
  res.send("Try /ping to check");
});

var server = app.listen(port, () =>
  console.log(`Service running on port ${port}`)
);

server.timeout = 120000;
