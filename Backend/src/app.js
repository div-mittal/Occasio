import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes import
import organizerRouter from "./routes/organizer.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "20kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

// routes declaration
app.use("/api/v1/organizers", organizerRouter);

export { app }