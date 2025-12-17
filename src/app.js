import express from 'express';
import cors from 'cors';
import leagueRouter from "./controllers/leagues.js";

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/leagues', leagueRouter);

export default app;
