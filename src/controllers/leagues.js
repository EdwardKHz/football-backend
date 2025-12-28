import express from 'express';
import {getAllLeagues, getLeagueStandings, getTopLeagues} from "../services/leagueService.js";
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

leagueRouter.get('/:leagueID/standings/:season', async (req, res) => {
    try {
        const { leagueId, season } = req.params;

        const standings = await getLeagueStandings(leagueId, season);

        if(!standings) {
            return res.status(400).json({ error: 'Standings not available for this league and season' });
        }

        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league standings' });
    }
});


export default leagueRouter;