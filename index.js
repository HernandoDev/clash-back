import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // API Key desde .env
const minLevels = {
    'Barbarian King': 85,
    'Archer Queen': 85,
    'Grand Warden': 60,
    'Royal Champion': 35,
    'Minion Prince': 55
};
const minTownHallLevel = 15; // Nivel mínimo de ayuntamiento
const clanTag = '2QL0GCQGQ'; // Tag de tu clan

// Middleware para parsear JSON
app.use(express.json());

// Función para hacer una llamada a la API para obtener los miembros del clan
async function fetchMembersFromClan() {
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

// Función para obtener los héroes de un jugador
async function fetchHeroesData(playerTag) {
    const encodedPlayerTag = playerTag.slice(1); // Codificación del tag del jugador
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
    let heroes = data.heroes.filter(hero => hero.name !== "Battle Copter" && hero.name !== "Battle Machine");
    return heroes;
}

// Función para procesar miembros del clan y sus héroes
async function processMembers() {
    const membersResponse = await fetchMembersFromClan();
    return Promise.all(membersResponse.map(async (member) => {
        const heroesData = await fetchHeroesData(member.tag);
        return {
            jugador: member.name,
            nivelAyuntamiento: member.townHallLevel,
            heroes: heroesData
        };
    }));
}

// Función para filtrar y organizar miembros que cumplen o no con los requisitos
function filterMembersByRequirements(membersWithHeroes) {
    const membersThatPass = [];
    const membersThatFail = [];
    
    membersWithHeroes.forEach(member => {
        let townHallStatus = member.nivelAyuntamiento >= minTownHallLevel;
        let passedHeroesCount = 0;
        
        member.heroes.forEach(hero => {
            const minLevel = minLevels[hero.name] || 0;
            if (hero.level >= minLevel) {
                passedHeroesCount++;
            }
        });

        if (townHallStatus && passedHeroesCount === member.heroes.length) {
            membersThatPass.push(member);
        } else {
            membersThatFail.push({
                ...member,
                passedHeroesCount,
                townHallStatus
            });
        }
    });

    // Ordenar los miembros que no cumplen
    membersThatFail.sort((a, b) => {
        if (b.passedHeroesCount !== a.passedHeroesCount) {
            return b.passedHeroesCount - a.passedHeroesCount;
        }
        return b.nivelAyuntamiento - a.nivelAyuntamiento;
    });

    return { membersThatPass, membersThatFail };
}

// Genera la lista de requisitos del clan
function generateRequisitosHtml() {
    let html = '<h2>Requisitos:</h2>';
    html += `<p>📜 <strong>Requisito de ayuntamiento:</strong> Nivel mínimo de Ayuntamiento ${minTownHallLevel}</p>`;
    html += '<p>📜 <strong>Requisitos de héroes:</strong></p>';
    html += '<ul>';
    for (const hero in minLevels) {
        html += `<li><strong>${hero}:</strong> Nivel mínimo ${minLevels[hero]}</li>`;
    }
    html += '</ul>';
    return html;
}

// Genera el HTML para los miembros que cumplen todos los requisitos
function generateMembersThatPassHtml(membersThatPass) {
    let html = '<h2>✅ Miembros que cumplen todos los requisitos:</h2>';
    html += '<ul>';
    membersThatPass.forEach(member => {
        html += `<li><strong>🎮 Jugador:</strong> ${member.jugador}<br>`;
        html += `<strong>🏰 Nivel Ayuntamiento:</strong> ${member.nivelAyuntamiento}<br>`;
        html += generateHeroesHtml(member.heroes, true);
        html += '</li>';
        html += '<br>--------------------<br>';
    });
    html += '</ul>';
    return html;
}

// Genera el HTML para los miembros que no cumplen los requisitos
function generateMembersThatFailHtml(membersThatFail) {
    let html = '<h2>❌ Miembros que NO cumplen todos los requisitos:</h2>';
    html += '<ul>';
    membersThatFail.forEach(member => {
        html += `<li><strong>🎮 Jugador:</strong> ${member.jugador}<br>`;
        html += `<strong>🏰 Nivel Ayuntamiento:</strong> ${member.nivelAyuntamiento}<br>`;
        html += generateHeroesHtml(member.heroes, false);
        html += `<br>📜 <strong>Héroes que cumplen los requisitos:</strong> ${member.passedHeroesCount}/${member.heroes.length} héroes cumplen el requisito.<br>`;
        html += '<br>-----------------------<br>';
    });
    html += '</ul>';
    return html;
}

// Genera el HTML para los héroes de un jugador
function generateHeroesHtml(heroes, isPass) {
    let html = `<strong>🦸‍♂️ Héroes:</strong><ul>`;
    heroes.forEach(hero => {
        const minLevel = minLevels[hero.name] || 0;
        let heroStatus = hero.level >= minLevel ? '✅ (Cumple el requisito)' : '❌ (No cumple el requisito)';
        if (isPass) {
            html += `<li>⚔️ <strong>${hero.name}</strong>: Nivel ${hero.level} ✅ <strong>(Cumple el requisito)</strong></li>`;
        } else {
            html += `<li>⚔️ <strong>${hero.name}</strong>: Nivel ${hero.level} ${heroStatus}</li>`;
        }
    });
    html += '</ul>';
    return html;
}

// Función principal para generar el contenido HTML
function generateHtmlContent(membersThatPass, membersThatFail) {
    let htmlContent = '<html><head><title>Mi Clan</title></head><body>';

    // Añadir los requisitos
    htmlContent += generateRequisitosHtml();

    // Añadir los miembros que cumplen los requisitos
    htmlContent += generateMembersThatPassHtml(membersThatPass);

    // Añadir los miembros que no cumplen los requisitos
    htmlContent += generateMembersThatFailHtml(membersThatFail);

    htmlContent += '</body></html>';
    return htmlContent;
}


// Endpoint principal
app.get('/clash-api/clan/members', async (req, res) => {
    try {
        const membersWithHeroes = await processMembers();
        const { membersThatPass, membersThatFail } = filterMembersByRequirements(membersWithHeroes);
        const htmlContent = generateHtmlContent(membersThatPass, membersThatFail);
        res.send(htmlContent);
    } catch (error) {
        console.error(`⚠️ Error en la obtención de datos: ${error.message}`);
        res.status(500).json({ error: '🚨 Error al obtener los datos del clan o héroes.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
