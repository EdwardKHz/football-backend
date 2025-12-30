import express from 'express';
import {
    getAllLeagues,
    getLeagueInfo, getLeagueMostRedCards, getLeagueMostYellowCards,
    getLeagueStandings, getLeagueTopAssisters,
    getLeagueTopScorers,
    getTopLeagues
} from "../services/leagueService.js";
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

leagueRouter.get('/:leagueID/topScorers/:season', async (req, res) => {
    try {
        const { leagueID, season } = req.params;

        const topScorers = await getLeagueTopScorers(leagueID, season);

        if (!topScorers) {
            return res.status(400).json({ error: 'Top scorers not available for this league and season' });
        }

        res.json(topScorers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league top scorers' });
    }
});

leagueRouter.get('/:leagueID/topAssisters/:season', async (req, res) => {
    try {
        const { leagueID, season } = req.params;

        const topAssisters = await getLeagueTopAssisters(leagueID, season);

        if (!topAssisters) {
            return res.status(400).json({ error: 'Top assisters not available for this league and season' });
        }

        res.json(topAssisters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league top assisters' });
    }
});

leagueRouter.get('/:leagueID/mostYellowCards/:season', async (req, res) => {
    try {
        const { leagueID, season } = req.params;

        const mostYellowCards = await getLeagueMostYellowCards(leagueID, season);

        if (!mostYellowCards) {
            return res.status(400).json({ error: 'Most yellow cards not available for this league and season' });
        }

        res.json(mostYellowCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league most yellow cards' });
    }
});

leagueRouter.get('/:leagueID/mostRedCards/:season', async (req, res) => {
    try {
        const { leagueID, season } = req.params;

        const mostRedCards = await getLeagueMostRedCards(leagueID, season);

        if (!mostRedCards) {
            return res.status(400).json({ error: 'Most red cards not available for this league and season' });
        }

        res.json(mostRedCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch league most red cards' });
    }
});

export default leagueRouter;