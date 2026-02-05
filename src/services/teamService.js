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
    return res.rows;
}

export async function getTeamVenue(id) {
    const res = await pool.query(
        `
            SELECT *
            FROM venue
            WHERE id = $1;
        `,
        [id]
    );
    return res.rows;
}

export async function getTeamLeagues(id, year) {
    const res = await pool.query(
        `
            SELECT league_id, l.name FROM standings s
            JOIN league l ON s.league_id = l.id
            WHERE team.id = $1 AND s.season = $2;
        `,
        [id, year]
    );
    return res.rows;
}