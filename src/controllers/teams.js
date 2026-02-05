import express from "express";
import {getTeamInfo, getTeamLeagues, getTeamVenue} from "../services/teamService.js";

const teamRouter = express.Router();

teamRouter.get("/:teamID", async (req, res) => {
    try {
        const { teamID } = req.params;

        const team = await getTeamInfo(teamID);

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch team info' });
    }
 });

teamRouter.get("/:teamID/venue", async (req, res) => {
    try {
        const { teamID } = req.params;

        const venue = await getTeamVenue(teamID);

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        res.json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch team venue' });
    }
});

teamRouter.get("/:teamID/season/:season", async (req, res) => {
    try {
        const { teamID, season } = req.params;

        const leagues = await getTeamLeagues(teamID, season);

        if (!leagues) {
            return res.status(404).json({ error: 'Leagues not found for this team and season' });
        }

        res.json(leagues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch team leagues' });
    }
});


export default teamRouter;