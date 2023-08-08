import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import * as middleware from "./src/middleware/index.js";
import path from "path";

// @config dotenv
dotenv.config();

// @create express app
const app = express();

// @use body-parser
app.use(bodyParser.json())
app.use(cors({ exposedHeaders : "Authorization" }))
app.use(middleware.requestLogger)

// @root route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Attendance Project API! ;)")
})

// @use router
import UserRouters from "./src/controller/auth/router.js"
import AttendanceRouters from "./src/controller/attendance/router.js"
import SalaryRouters from "./src/controller/salary/router.js"


app.use('/api/auth',UserRouters)
app.use("/api/attendance",AttendanceRouters)
app.use("/api/salary",SalaryRouters)


// @global error handler
app.use(middleware.errorHandler)

// @listen to port
const PORT = process.env.PORT;
console.log(process.env.PORT)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));