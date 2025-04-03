import fetch from 'node-fetch';
import dotenv from 'dotenv';
export const clanTag = '2QL0GCQGQ';

dotenv.config();
const API_KEY = process.env.API_KEY;

export async function fetchMembersFromClan() {
    const apiUrl = `https://api.clashofclans.com/v1/clans/%23${clanTag}/members`;
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Error al obtener miembros del clan: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items;
}

export async function fetchHeroesData(playerTag) {
    const encodedPlayerTag = playerTag.slice(1);
    const apiUrl = `https://api.clashofclans.com/v1/players/%23${encodedPlayerTag}`;
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Error al obtener los héroes del jugador: ${response.statusText}`);
    }
    const data = await response.json();
    return data.heroes.filter(hero => hero.name !== "Battle Copter" && hero.name !== "Battle Machine");
}
