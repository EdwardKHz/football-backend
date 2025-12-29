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