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
            headers: {'x-apisports-key': FOOTBALL_API_KEY},
            params: {league: leagueId, season: year}
        }
    );

    for (const t of res.data.response) {
        const venue = t.venue;

        if (!venue || !venue.id) continue;

        await pool.query(
            `INSERT INTO venue (id, name, address, city, capacity, image)
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
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

async function syncStandings(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/standings`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                league: leagueId,
                season: year
            }
        }
    );

    const standings =
        res.data.response[0]?.league?.standings[0] || [];

    console.log(standings);

    for (const s of standings) {
        await pool.query(
            `
            INSERT INTO standings (
                league_id, team_id, season,
                rank, points, stage_group, form, description,

                home_played, home_wins, home_draws, home_losses,
                home_goals_for, home_goals_against,

                away_played, away_wins, away_draws, away_losses,
                away_goals_for, away_goals_against
            )
            VALUES (
                $1,$2,$3,
                $4,$5,$6,$7,$8,
                $9,$10,$11,$12,$13,$14,
                $15,$16,$17,$18,$19,$20
            )
            ON CONFLICT (league_id, team_id, season)
            DO UPDATE SET
                rank = EXCLUDED.rank,
                points = EXCLUDED.points,
                stage_group = EXCLUDED.stage_group,
                form = EXCLUDED.form,
                description = EXCLUDED.description,

                home_played = EXCLUDED.home_played,
                home_wins = EXCLUDED.home_wins,
                home_draws = EXCLUDED.home_draws,
                home_losses = EXCLUDED.home_losses,
                home_goals_for = EXCLUDED.home_goals_for,
                home_goals_against = EXCLUDED.home_goals_against,

                away_played = EXCLUDED.away_played,
                away_wins = EXCLUDED.away_wins,
                away_draws = EXCLUDED.away_draws,
                away_losses = EXCLUDED.away_losses,
                away_goals_for = EXCLUDED.away_goals_for,
                away_goals_against = EXCLUDED.away_goals_against
            `,
            [
                leagueId,
                s.team.id,
                year,

                s.rank,
                s.points,
                s.group,
                s.form,
                s.description,

                s.home.played,
                s.home.win,
                s.home.draw,
                s.home.lose,
                s.home.goals.for,
                s.home.goals.against,

                s.away.played,
                s.away.win,
                s.away.draw,
                s.away.lose,
                s.away.goals.for,
                s.away.goals.against
            ]
        );
    }
}

async function syncTeamPlayers(teamID) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/players/squads`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                team: teamID,
            }
        }
    );

    const players = res.data.response[0]?.players || [];

    for (const p of players) {
        await pool.query(
            `
                INSERT INTO players (id, name, age, number, position, photo, teamID)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            `,
            [p.id, p.name, p.age, p.number, p.position, p.photo, teamID]
        );

    }
}

async function syncLeagueTopScorers(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/players/topscorers`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                league: leagueId,
                season: year
            }
        }
    );

    const players = res.data.response || [];

    for (const p of players) {
        await pool.query(
            `
                INSERT INTO league_top_scorers (playerID, teamID, leagueID, season, goals_scored, penalties_scored)
                VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (playerID, teamID, leagueID, season) DO
                UPDATE SET
                    goals_scored = EXCLUDED.goals_scored,
                    penalties_scored = EXCLUDED.penalties_scored
            `,
            [p.player.id, p.statistics[0].team.id, leagueId, year, p.statistics[0].goals.total || 0, p.statistics[0].penalty.scored || 0]
        );

    }
}

async function syncLeagueTopAssisters(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/players/topassists`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                league: leagueId,
                season: year
            }
        }
    );

    const players = res.data.response || [];

    for (const p of players) {
        await pool.query(
            `
                INSERT INTO league_top_assisters (playerID, teamID, leagueID, season, assists, key_passes)
                VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (playerID, teamID, leagueID, season) DO
                UPDATE SET
                assists = EXCLUDED.assists,
                key_passes = EXCLUDED.key_passes
            `,
            [p.player.id, p.statistics[0].team.id, leagueId, year, p.statistics[0].goals.assists || 0, p.statistics[0].passes.key || 0]
        );

    }
}

async function syncLeagueMostYellowCards(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/players/topyellowcards`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                league: leagueId,
                season: year
            }
        }
    );

    const players = res.data.response || [];

    for (const p of players) {
        await pool.query(
            `
                INSERT INTO league_most_yellow_cards (playerID, teamID, leagueID, season, yellow_cards, red_cards)
                VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (playerID, teamID, leagueID, season) DO
                UPDATE SET
                yellow_cards = EXCLUDED.yellow_cards,
                red_cards = EXCLUDED.red_cards
            `,
            [p.player.id, p.statistics[0].team.id, leagueId, year, p.statistics[0].cards.yellow || 0, p.statistics[0].cards.red || 0]
        );

    }
}

async function syncLeagueMostRedCards(leagueId, year) {
    const res = await axios.get(
        `${FOOTBALL_API_URL}/players/topredcards`,
        {
            headers: {
                'x-apisports-key': FOOTBALL_API_KEY
            },
            params: {
                league: leagueId,
                season: year
            }
        }
    );

    const players = res.data.response || [];

    for (const p of players) {
        await pool.query(
            `
                INSERT INTO league_most_red_cards (playerID, teamID, leagueID, season, red_cards, yellow_cards)
                VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (playerID, teamID, leagueID, season) DO
                UPDATE SET
                yellow_cards = EXCLUDED.yellow_cards,
                red_cards = EXCLUDED.red_cards
            `,
            [p.player.id, p.statistics[0].team.id, leagueId, year, p.statistics[0].cards.red || 0, p.statistics[0].cards.yellow || 0]
        );

    }
}











