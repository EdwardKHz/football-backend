import express from 'express';
import {getAllLeagues, getLeagueInfo, getLeagueStandings, getTopLeagues} from "../services/leagueService.js";
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

leagueRouter.get('/:leagueID', async (req, res) => {
    try {
        const { leagueID } = req.params;

        const league = await getLeagueInfo(leagueID);

        if(!league) {
            return res.status(404).json({ error: 'League not found' });
        }
        res.json(league);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league info' });
    }
});

leagueRouter.get('/:leagueID/standings/:season', async (req, res) => {
    try {
        const { leagueID, season } = req.params;

        const standings = await getLeagueStandings(leagueID, season);

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