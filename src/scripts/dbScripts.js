import axios from "axios";
import pool from "../db.js";
import {FOOTBALL_API_KEY, FOOTBALL_API_URL} from "../utils/config.js";

async function syncCountries() {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/countries`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            }
        }
    );

    for (const c of res.data.response) {
        await pool.query(
            `
                INSERT INTO country (name, code, flag)
                VALUES ($1, $2, $3)
            `,
            [c.name, c.code, c.flag]
        );
    }
}

async function syncLeagues() {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/leagues`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            }
        }
    );

    for (const l of res.data.response) {
        await pool.query(
            `
                INSERT INTO league (id, name, type, logo, country_name)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [l.league.id, l.league.name, l.league.type, l.league.logo, l.country.name]
        );
    }
}

async function syncSeason(year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/leagues`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                season: year
            }
        }
    );

    for (const s of res.data.response) {
        const season = s.seasons[0];
        await pool.query(
            `
                INSERT INTO season (league_id, year, start_date, end_date, current)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [s.league.id, season.year, season.start, season.end, season.current]
        );
    }
}

async function syncTeams(leagueId, year) {
    console.log(FOOTBALL_API_URL);
    try {
        const res = await axios.get(
            `${FOOTBALL_API_URL}/teams`,
            {
                headers: {
                    'x-apisports-key': FOOTBALL_API_KEY
                },
                params: {
                    season: year,
                    league: leagueId
                }
            }
        );

        for (const t of res.data.response) {
            const team = t.team;
            const venue = t.venue;

            await pool.query(
                `INSERT INTO team(id, name, code, country, founded, logo, venue_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 `,
                [
                    team.id,
                    team.name,
                    team.code || null,
                    team.country || null,
                    team.founded || null,
                    team.logo || null,
                    venue?.id || null
                ]
            );
        }

    } catch (error) {
        console.error('Error syncing teams:', error.message);
    }
}

async function syncVenuesFromTeams(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/teams`,
        {
            headers: { 'x-apisports-key': FOOTBALL_API_KEY },
            params: { league: leagueId, season: year }
        }
    );

    for (const t of res.data.response) {
        const venue = t.venue;

        if (!venue || !venue.id) continue;

        await pool.query(
            `INSERT INTO venue (id, name, address, city, capacity, image)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [
                venue.id,
                venue.name,
                venue.address || null,
                venue.city || null,
                venue.capacity || null,
                venue.image || null
            ]
        );
    }
}











