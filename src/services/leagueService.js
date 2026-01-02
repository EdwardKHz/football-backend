import pool from "../db.js";

export async function getTopLeagues() {
    const res = await pool.query(
        `
            SELECT id, name, logo
            FROM league
            WHERE id IN (2,3,39,140,135,78,61)
            ORDER BY id
        `

    );
    return res.rows;
}

export async function getAllLeagues() {
    const res = await pool.query(
        `
            SELECT c.name as country, c.flag as country_flag, l.id, l.name AS league_name , l.logo AS league_logo
            FROM country c
            JOIN league l ON c.name = l.country_name
            ORDER BY c.name ASC
        `
    );
    return res.rows;
}

export async function getLeagueInfo(id) {
    const res = await pool.query(
        `
        SELECT name, type, logo, country_name 
        FROM league
        WHERE ID = $1
        `,
        [id]
    )
    return res.rows[0];
}

export async function getLeagueStandings(leagueID, year) {
    const res = await pool.query(
        `
            SELECT *
            FROM standings s
            JOIN team t ON t.id = s.team_id
            WHERE league_id = $1 AND season = $2
            ORDER BY rank ASC
        `,
        [leagueID, year]
    );
    return res.rows;
}

export async function getLeagueTopScorers(leagueID, year) {
    const res = await pool.query(
        `
            SELECT l.playerid, l.goals_scored, l.penalties_scored, p.name, p.photo, t.logo, t.name as team_name FROM league_top_scorers l
            JOIN players p ON p.id = l.playerid
            JOIN team t ON t.id = l.teamid
            WHERE l.leagueid = $1 AND season = $2
            ORDER BY l.goals_scored DESC;
        `,
        [leagueID, year]
    );
    return res.rows;
}

export async function getLeagueTopAssisters(leagueID, year) {
    const res = await pool.query(
        `
            SELECT l.playerid, l.assists, l.key_passes, p.name, p.photo, t.logo, t.name FROM league_top_assisters l
            JOIN players p ON p.id = l.playerid
            JOIN team t ON t.id = l.teamid
            WHERE l.leagueid = $1 AND season = $2
            ORDER BY l.assists DESC;
        `,
        [leagueID,year]
    );
    return res.rows;
}

export async function getLeagueMostYellowCards(leagueID, year) {
    const res = await pool.query(
        `
            SELECT l.playerid, l.yellow_cards, l.red_cards, p.name, p.photo, t.logo, t.name FROM league_most_yellow_cards l
            JOIN players p ON p.id = l.playerid
            JOIN team t ON t.id = l.teamid
            WHERE l.leagueid = $1 AND season = $2
            ORDER BY l.yellow_cards DESC;
        `,
        [leagueID,year]
    );
    return res.rows;
}

export async function getLeagueMostRedCards(leagueID, year) {
    const res = await pool.query(
        `
            SELECT l.playerid, l.yellow_cards, l.red_cards, p.name, p.photo, t.logo, t.name FROM league_most_red_cards l
            JOIN players p ON p.id = l.playerid
            JOIN team t ON t.id = l.teamid
            WHERE l.leagueid = $1 AND season = $2
            ORDER BY l.red_cards DESC;
        `,
        [leagueID,year]
    );
    return res.rows;
}

export async function getLeagueWinners(leagueID) {
    const res = await pool.query(
        `
            SELECT t.name, t.logo, s.season, s.rank
            FROM standings s
            JOIN team t ON t.id = s.team_id
            WHERE s.league_id = $1 
            AND s.rank IN (1, 2);
        `,
        [leagueID]
    );
    return res.rows;

}


