import { minLevels, minTownHallLevel } from '../config/constants.js';

export function generateRequisitosHtml() {
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

export function generateMembersThatPassHtml(membersThatPass) {
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

export function generateMembersThatFailHtml(membersThatFail) {
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

export function generateHtmlContent(membersThatPass, membersThatFail) {
    let htmlContent = '<html><head><title>Mi Clan</title></head><body>';
    htmlContent += generateRequisitosHtml();
    htmlContent += generateMembersThatPassHtml(membersThatPass);
    htmlContent += generateMembersThatFailHtml(membersThatFail);
    htmlContent += '</body></html>';
    return htmlContent;
}
