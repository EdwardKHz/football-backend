import pool from "../db.js";

export async function getTeamInfo(id) {
    const res = await pool.query(
        `
            SELECT t.name, t.code, t.country, t.founded, t.logo, t.venue_id
            FROM team t
            WHERE t.id = $1;

        `,
        [id]
    );
    return res.rows[0];
}

export async function getTeamVenue(id) {
    const res = await pool.query(
        `
            SELECT v.id, v.name, v.address, v.city, v.capacity, v.image FROM venue v
            JOIN team ON team.venue_id = v.id
            WHERE team.id = $1;

        `,
        [id]
    );
    return res.rows[0];
}

export async function getTeamLeagues(id, year) {
    const res = await pool.query(
        `
            SELECT league_id, l.name FROM standings s
            JOIN league l ON s.league_id = l.id
            WHERE s.team_id = $1 AND s.season = $2;
        `,
        [id, year]
    );
    return res.rows;
}

export async function getTeamPlayers(id) {
    const res = await pool.query(
        `
            SELECT id, name, age, number, position, photo
            FROM players
            WHERE teamid = $1;
        `,
        [id]
    );
    return res.rows;
}

export async function getTeamLeagueStandings(id) {
    const res = await pool.query(
        `
            SELECT 
                (home_wins + away_wins)                                               AS wins,
                (home_losses + away_losses)                                           AS losses,
                (home_draws + away_draws)                                             AS draws,
                ROUND((home_wins + away_wins) * 1.0 / (home_played + away_played), 2) AS win_percentage,
                ROUND((points * 1.0) / (home_played + away_played), 1)                AS points_per_game,
                season,
                l.name                                                                AS league_name,
                l.logo                                                                AS league_logo,
                rank
                FROM standings
                JOIN league l ON l.id = league_id
                WHERE team_id = $1;
        `,
        [id]
    );
    return res.rows;
}