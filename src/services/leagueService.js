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

export async function getLeagueStandings(leagueID, year) {
    const res = await pool.query(
        `
            SELECT *
            FROM standings
            WHERE league_id = $1 AND season = $2
            ORDER BY position ASC
        `,
        [leagueID, year]
    );
    return res.rows;
}