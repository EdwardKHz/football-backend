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
            SELECT playerid, teamid, goals_scored, penalties_scored
            FROM league_top_scorers
            WHERE leagueid = $1 AND season = $2;
        `,
        [leagueID, year]
    );
    return res.rows;
}

export async function getLeagueTopAssisters(leagueID, year) {
    const res = await pool.query(
        `
            SELECT playerid, teamid, assists, key_passes
            FROM league_top_assisters
            WHERE leagueid = $1  AND season = $2;
        `,
        [leagueID,year]
    );
    return res.rows;
}

export async function getLeagueMostYellowCards(leagueID, year) {
    const res = await pool.query(
        `
            SELECT playerid, teamid, yellow_cards, red_cards
            FROM league_most_yellow_cards
            WHERE leagueid = $1 AND season = $2
            ORDER BY yellow_cards DESC;
        `,
        [leagueID,year]
    );
    return res.rows;
}

export async function getLeagueMostRedCards(leagueID, year) {
    const res = await pool.query(
        `
            SELECT playerid, teamid, red_cards, yellow_cards
            FROM league_most_red_cards
            WHERE leagueid = $1  AND season = $2
            ORDER BY red_cards DESC;
        `,
        [leagueID,year]
    );
    return res.rows;
}




