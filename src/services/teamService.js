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