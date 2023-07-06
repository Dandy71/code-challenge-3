import express from "express";
import { addTransaction, getTransactions } from "../controller/general.js";

const router = express.Router();

router.get("/add", addTransaction);
router.get("/get", getTransactions);

export default router;
