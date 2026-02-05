import express from 'express';
import cors from 'cors';
import leagueRouter from "./controllers/leagues.js";
import teamRouter from "./controllers/teams.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/leagues', leagueRouter);
app.use('/api/teams', teamRouter);

export default app;
