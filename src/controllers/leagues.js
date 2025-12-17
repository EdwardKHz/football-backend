import express from 'express';
import {getAllLeagues, getTopLeagues} from "../services/leagueService.js";
const leagueRouter = express.Router();


leagueRouter.get('/top', async (req, res) => {
    try {
        const topLeagues = await getTopLeagues();
        res.json(topLeagues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch top leagues' });
    }
});

leagueRouter.get('/all', async (req, res) => {
    try {
        const allLeagues = await getAllLeagues();
        res.json(allLeagues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all leagues' });
    }
});

export default leagueRouter;