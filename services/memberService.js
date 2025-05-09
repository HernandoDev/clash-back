import { fetchMembersFromClan, fetchHeroesData } from './apiService.js';
import { minLevels, minTownHallLevel } from '../config/constants.js';

export async function processMembers() {
    const membersResponse = await fetchMembersFromClan();
    return Promise.all(membersResponse.map(async (member) => {
        const playerData = await fetchHeroesData(member.tag);
        const mainHeroes = playerData.heroes.filter(hero => hero.name !== "Battle Copter" && hero.name !== "Battle Machine");
        return {
            jugador: member.name,
            nivelAyuntamiento: member.townHallLevel,
            heroes: mainHeroes,
            troops:playerData.troops
        };
    }));
}

export function filterMembersByRequirements(membersWithHeroes) {
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

    membersThatFail.sort((a, b) => {
        if (b.passedHeroesCount !== a.passedHeroesCount) {
            return b.passedHeroesCount - a.passedHeroesCount;
        }
        return b.nivelAyuntamiento - a.nivelAyuntamiento;
    });

    return { membersThatPass, membersThatFail };
}
