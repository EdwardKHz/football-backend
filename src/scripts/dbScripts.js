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
                season:year
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




