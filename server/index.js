import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import generalRoutes from "./routes/general.js";
import mysql from "mysql";

// configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

export const connection = mysql.createConnection({
  host: process.env.SQLHOSTIP,
  user: process.env.SQLUSER,
  password: process.env.SQLPASSWORD,
  database: process.env.SQLDATABASE,
});

// routes
app.use("/general", generalRoutes);

// Setup
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server Port: ${PORT}`);
});
