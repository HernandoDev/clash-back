import { minLevels, minTownHallLevel } from '../config/constants.js';

export function generateRequisitosHtml() {
    let html = '<h2>Requisitos:</h2>';
    html += `<p>📜 <strong>Requisito de ayuntamiento:</strong> Nivel mínimo de Ayuntamiento ${minTownHallLevel}</p>`;
    html += '<p>📜 <strong>Requisitos de héroes:</strong></p>';
    html += '<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">';
    html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Héroe</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel mínimo</th></tr></thead><tbody>';
    for (const hero in minLevels) {
        html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${hero}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${minLevels[hero]}</td></tr>`;
    }
    html += '</tbody></table>';
    return html;
}

export function generateMembersThatPassHtml(membersThatPass) {
    let html = '<h2>✅ Miembros que cumplen todos los requisitos:</h2>';
    html += '<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">';
    html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Jugador</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel Ayuntamiento</th><th style="padding: 8px; border: 1px solid #ddd;">Héroes</th><th style="padding: 8px; border: 1px solid #ddd;">Mascotas</th></tr></thead><tbody>';
    membersThatPass.forEach(member => {
        html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${member.jugador}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${member.nivelAyuntamiento}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${generateHeroesHtml(member.heroes, true)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${generatePetsHtml(member.troops)}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
}

export function generateMembersThatFailHtml(membersThatFail) {
    let html = '<h2>❌ Miembros que NO cumplen todos los requisitos:</h2>';
    html += '<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">';
    html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Jugador</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel Ayuntamiento</th><th style="padding: 8px; border: 1px solid #ddd;">Héroes</th><th style="padding: 8px; border: 1px solid #ddd;">Héroes que cumplen requisitos</th><th style="padding: 8px; border: 1px solid #ddd;">Mascotas</th></tr></thead><tbody>';
    membersThatFail.forEach(member => {
        html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${member.jugador}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${member.nivelAyuntamiento}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${generateHeroesHtml(member.heroes, false)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">📜 <strong>Héroes que cumplen los requisitos:</strong> ${member.passedHeroesCount}/${member.heroes.length} héroes cumplen el requisito.</td>`;
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${generatePetsHtml(member.troops)}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
}

// Método para traducir los nombres de los equipos
function translateItemName(itemName) {
    const itemTranslations = {
        "Spiky Ball": "Pelota de Pinchos",
        "Earthquake Boots": "Botas Terremoto",
        "Healer Puppet": "Títere Sanadoras",
        "Giant Arrow": "Flecha Gigante",
        "Eternal Tome": "Tomo Eternos",
        "Healing Tome": "Tomo de Sanación",
        "Haste Vial": "Frasco de Aceleración",
        "Electro Boots": "Botas Electricas",
        "Metal Pants": "Pantalones Metálicos",
        "Noble Iron": "Hierro Noble",
        "Magic Mirror": "Espejo Mágico",
        "Dark Orb": "Orbe Oscuro",
        "Henchmen Puppet": "Títere Esbirros",
        "Royal Gem": "Gema Real Vida",
        "Seeking Shield": "Escudo luchadora",
        "Rage Gem": "Gema de Velocidad",
        "Giant Gauntlet": "Guantelete Gigante",
        "Giant Hammer": "Martillo Gigante"
    };

    return itemTranslations[itemName] || itemName;  // Devuelve el nombre traducido o el original si no existe traducción
}

// Método para traducir los nombres de las mascotas
function translatePetName(petName) {
    const translations = {
        "L.A.S.S.I": "L.A.S.S.I",
        "Mighty Yak": "Yak Mamut",
        "Electro Owl": "Búho Eléctrico",
        "Unicorn": "Unicornio",
        "Phoenix": "Fénix",
        "Poison Lizard": "Lagarto Venenoso",
        "Diggy": "Pangolin",
        "Frosty": "Morsa Hielo",
        "Spirit Fox": "Zorro Espiritual",
        "Angry Jelly": "Medusa Enfadada",
        "Sneezy": "Achus"
    };

    return translations[petName] || petName;  // Devuelve el nombre traducido o el original si no se encuentra
}

// Método para generar el HTML de las mascotas
function generatePetsHtml(troops) {
    // Asegurarse de que 'troops' esté definido y sea un array
    if (!Array.isArray(troops)) {
        return 'Las tropas no están definidas correctamente.';
    }

    // Filtrar las mascotas de interés
    const petsOfInterest = [
        "L.A.S.S.I", "Mighty Yak", "Electro Owl", "Unicorn", 
        "Phoenix", "Poison Lizard", "Diggy", "Frosty", 
        "Spirit Fox", "Angry Jelly", "Sneezy"
    ];

    // Filtrar las tropas para obtener solo las mascotas de interés
    const pets = troops.filter(troop => {
        // Asegurarse de que la propiedad 'name' exista en cada objeto
        return troop && troop.name && petsOfInterest.includes(troop.name);
    });

    // Si no se encontraron mascotas, retornar un mensaje
    if (pets.length === 0) {
        return 'No se encontraron mascotas de interés.';
    }

    // Generar el HTML para cada mascota
    let html = `<strong>🐾 Mascotas:</strong><table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;
    html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Nombre</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel</th></tr></thead><tbody>';
    
    pets.forEach(pet => {
        const translatedName = translatePetName(pet.name);  // Traducir el nombre de la mascota
        html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${translatedName}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${pet.level}</td></tr>`;
    });

    html += '</tbody></table>';
    return html;
}

// Método para generar el HTML de los héroes
function generateHeroesHtml(heroes, isPass) {
    let html = `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;
    html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Héroe</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel</th><th style="padding: 8px; border: 1px solid #ddd;">Estado</th><th style="padding: 8px; border: 1px solid #ddd;">Equipo</th></tr></thead><tbody>';
    
    heroes.forEach(hero => {
        const minLevel = minLevels[hero.name] || 0;
        let heroStatus = hero.level >= minLevel ? '✅ (Cumple el requisito)' : '❌ (No cumple el requisito)';
        
        // Agregar el héroe
        html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${hero.name}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${hero.level}</td><td style="padding: 8px; border: 1px solid #ddd;">${heroStatus}</td><td style="padding: 8px; border: 1px solid #ddd;">`;
        
        // Agregar su equipo
        if (hero.equipment && hero.equipment.length > 0) {
            html += `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">`;
            html += '<thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd;">Equipo</th><th style="padding: 8px; border: 1px solid #ddd;">Nivel</th></tr></thead><tbody>';
            hero.equipment.forEach(item => {
                const translatedItem = translateItemName(item.name);  // Traducir el nombre del equipo
                html += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${translatedItem}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${item.level}</td></tr>`;
            });
            html += '</tbody></table>';
        } else {
            html += 'Ningún equipo disponible';
        }

        html += '</td></tr>';
    });

    html += '</tbody></table>';
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
