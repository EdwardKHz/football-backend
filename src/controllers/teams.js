import express from "express";
import {
    getTeamInfo,
    getTeamLeagues,
    getTeamLeagueStandings,
    getTeamPlayers,
    getTeamVenue
} from "../services/teamService.js";

const teamRouter = express.Router();

teamRouter.get("/:teamID", async (req, res) => {
    try {
        const {teamID} = req.params;

        const team = await getTeamInfo(teamID);

        if (!team) {
            return res.status(404).json({error: 'Team not found'});
        }

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch team info'});
    }
});

teamRouter.get("/:teamID/venue", async (req, res) => {
    try {
        const {teamID} = req.params;

        const venue = await getTeamVenue(teamID);

        if (!venue) {
            return res.status(404).json({error: 'Venue not found'});
        }

        res.json(venue);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch team venue'});
    }
});

teamRouter.get("/:teamID/season/:season", async (req, res) => {
    try {
        const {teamID, season} = req.params;

        const leagues = await getTeamLeagues(teamID, season);

        if (!leagues) {
            return res.status(404).json({error: 'Leagues not found for this team and season'});
        }

        res.json(leagues);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch team leagues'});
    }
});

teamRouter.get("/:teamID/players", async (req, res) => {
    try {
        const {teamID} = req.params;

        const players = await getTeamPlayers(teamID);

        if (!players) {
            return res.status(404).json({error: 'Players not found for this team'});
        }

        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch team players'});
    }
});

teamRouter.get("/:teamID/standings", async (req, res) => {
    try {
        const {teamID} = req.params;

        const standings = await getTeamLeagueStandings(teamID);

        if (!standings) {
            return res.status(404).json({error: 'Standings not found for this team'});
        }

        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch team standings'});
    }
});


export default teamRouter;