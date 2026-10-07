// Mock data for a fictional league. Everything is generated from a fixed seed,
// so the season looks the same on every restart, while the schedule is anchored
// to today's date so there are always finished and upcoming matches.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261007);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

function poisson(lambda) {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rand();
  } while (p > limit);
  return k - 1;
}

export const LEAGUE = {
  name: 'Premier Soccer League',
  short: 'PSL',
  season: '2026-27',
};

export const teams = [
  { id: 'hcf', name: 'Harbor City FC', city: 'Harbor City', abbr: 'HCF', primary: '#0b3d91', secondary: '#f2b705', stadium: 'Pier Park', founded: 1898, strength: 1.8 },
  { id: 'riv', name: 'Riverside United', city: 'Riverside', abbr: 'RIV', primary: '#c8102e', secondary: '#ffffff', stadium: 'The Riverbank', founded: 1902, strength: 1.7 },
  { id: 'nor', name: 'Northgate Rovers', city: 'Northgate', abbr: 'NOR', primary: '#00843d', secondary: '#ffffff', stadium: 'Gate Lane', founded: 1911, strength: 1.5 },
  { id: 'sum', name: 'Summit Athletic', city: 'Summit', abbr: 'SUM', primary: '#5b2c83', secondary: '#e0c36a', stadium: 'Highpoint Arena', founded: 1920, strength: 1.45 },
  { id: 'lak', name: 'Lakeshore SC', city: 'Lakeshore', abbr: 'LAK', primary: '#0093d0', secondary: '#002d62', stadium: 'Shoreline Stadium', founded: 1931, strength: 1.35 },
  { id: 'iro', name: 'Ironwood Town', city: 'Ironwood', abbr: 'IRO', primary: '#3a3a3a', secondary: '#ff6a13', stadium: 'The Foundry', founded: 1889, strength: 1.25 },
  { id: 'coa', name: 'Coastal Wanderers', city: 'Coastal Bay', abbr: 'COA', primary: '#008080', secondary: '#f5f5dc', stadium: 'Tidewater Ground', founded: 1947, strength: 1.15 },
  { id: 'red', name: 'Redhill Rangers', city: 'Redhill', abbr: 'RED', primary: '#a6192e', secondary: '#1c1c1c', stadium: 'Brick Road', founded: 1905, strength: 1.1 },
  { id: 'pin', name: 'Pinecrest City', city: 'Pinecrest', abbr: 'PIN', primary: '#1b5e20', secondary: '#c5e1a5', stadium: 'Evergreen Park', founded: 1958, strength: 1.0 },
  { id: 'bay', name: 'Bayview Albion', city: 'Bayview', abbr: 'BAY', primary: '#f57c00', secondary: '#0d1b2a', stadium: 'Albion Road', founded: 1913, strength: 0.9 },
];

const FIRST = ['Leo', 'Marco', 'Jonas', 'Theo', 'Rafael', 'Luca', 'Mateo', 'Kai', 'Noah', 'Diego', 'Samuel', 'Elias', 'Adrian', 'Felix', 'Hugo', 'Tomas', 'Ivan', 'Omar', 'Yusuf', 'Andre', 'Kofi', 'Pedro', 'Nico', 'Jamal', 'Oscar', 'Emil', 'Bruno', 'Dani', 'Milan', 'Sami'];
const LAST = ['Silva', 'Novak', 'Fischer', 'Moreau', 'Okafor', 'Rossi', 'Haaland', 'Mensah', 'Costa', 'Petrov', 'Lindqvist', 'Duarte', 'Kovac', 'Bennett', 'Nakamura', 'Alvarez', 'Diallo', 'Weber', 'Santos', 'Jensen', 'Ibrahim', 'Martins', 'Laurent', 'Popescu', 'Schmidt', 'Ortega', 'Varga', 'Keller', 'Mendes', 'Adeyemi'];
const NATIONS = ['ESP', 'BRA', 'FRA', 'GER', 'ITA', 'POR', 'NED', 'NGA', 'GHA', 'ARG', 'USA', 'JPN', 'SEN', 'CRO', 'SWE', 'ENG'];
const POSITIONS = ['GK', 'DF', 'DF', 'DF', 'DF', 'MF', 'MF', 'MF', 'FW', 'FW', 'FW', 'GK', 'DF', 'MF', 'FW', 'MF'];

export const players = [];
for (const team of teams) {
  const used = new Set();
  POSITIONS.forEach((position, i) => {
    let name;
    do name = `${pick(FIRST)} ${pick(LAST)}`;
    while (used.has(name));
    used.add(name);
    players.push({
      id: `${team.id}-${i + 1}`,
      teamId: team.id,
      name,
      number: i === 0 ? 1 : i === 11 ? 13 : i + 2,
      position,
      nationality: pick(NATIONS),
      age: 18 + Math.floor(rand() * 17),
      starter: i < 11,
      stats: { apps: 0, goals: 0, assists: 0, cleanSheets: 0 },
    });
  });
}

// Circle-method round robin, then the reverse fixtures for the second half.
function roundRobin(ids) {
  const list = [...ids];
  const rounds = [];
  for (let r = 0; r < list.length - 1; r++) {
    const pairs = [];
    for (let i = 0; i < list.length / 2; i++) {
      const a = list[i];
      const b = list[list.length - 1 - i];
      pairs.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(pairs);
    list.splice(1, 0, list.pop());
  }
  return [...rounds, ...rounds.map((pairs) => pairs.map(([h, a]) => [a, h]))];
}

const today = new Date();
today.setHours(0, 0, 0, 0);
// Season opener is the Saturday seven weeks before this week's Saturday.
const thisSaturday = new Date(today);
thisSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7) - (today.getDay() === 0 ? 7 : 0));
const seasonStart = new Date(thisSaturday);
seasonStart.setDate(thisSaturday.getDate() - 7 * 7);

const SLOTS = [
  { day: 0, time: '12:30' },
  { day: 0, time: '15:00' },
  { day: 0, time: '17:30' },
  { day: 1, time: '14:00' },
  { day: 1, time: '16:30' },
];

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
const squad = (teamId) => players.filter((p) => p.teamId === teamId && p.starter);

function weightedScorer(teamId) {
  const weights = { FW: 6, MF: 3, DF: 1, GK: 0 };
  const pool = squad(teamId).flatMap((p) => Array(weights[p.position]).fill(p));
  return pick(pool);
}

export const games = [];
roundRobin(teams.map((t) => t.id)).forEach((pairs, round) => {
  pairs.forEach(([homeId, awayId], i) => {
    const slot = SLOTS[i];
    const kickoff = new Date(seasonStart);
    kickoff.setDate(seasonStart.getDate() + round * 7 + slot.day);
    const [hh, mm] = slot.time.split(':').map(Number);
    kickoff.setHours(hh, mm);

    const game = {
      id: `md${round + 1}-${homeId}-${awayId}`,
      matchday: round + 1,
      date: kickoff.toISOString(),
      homeId,
      awayId,
      venue: teamById[homeId].stadium,
      status: kickoff < today ? 'final' : 'scheduled',
      homeScore: null,
      awayScore: null,
      events: [],
    };

    if (game.status === 'final') {
      const home = teamById[homeId];
      const away = teamById[awayId];
      game.homeScore = poisson(1.1 * home.strength / away.strength + 0.25);
      game.awayScore = poisson(1.0 * away.strength / home.strength);

      for (const [teamId, goals] of [[homeId, game.homeScore], [awayId, game.awayScore]]) {
        for (let g = 0; g < goals; g++) {
          const scorer = weightedScorer(teamId);
          scorer.stats.goals++;
          let assist = null;
          if (rand() < 0.75) {
            const mates = squad(teamId).filter((p) => p !== scorer && p.position !== 'GK');
            assist = pick(mates);
            assist.stats.assists++;
          }
          game.events.push({ minute: 1 + Math.floor(rand() * 90), teamId, scorer: scorer.name, assist: assist?.name ?? null });
        }
      }
      game.events.sort((a, b) => a.minute - b.minute);

      for (const p of [...squad(homeId), ...squad(awayId)]) p.stats.apps++;
      if (game.awayScore === 0) squad(homeId).forEach((p) => p.position === 'GK' && p.stats.cleanSheets++);
      if (game.homeScore === 0) squad(awayId).forEach((p) => p.position === 'GK' && p.stats.cleanSheets++);
    }
    games.push(game);
  });
});

export function getStandings() {
  const table = Object.fromEntries(
    teams.map((t) => [t.id, { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] }])
  );
  for (const g of games.filter((g) => g.status === 'final')) {
    const home = table[g.homeId];
    const away = table[g.awayId];
    home.played++;
    away.played++;
    home.gf += g.homeScore;
    home.ga += g.awayScore;
    away.gf += g.awayScore;
    away.ga += g.homeScore;
    if (g.homeScore > g.awayScore) {
      home.won++; away.lost++; home.points += 3;
      home.form.push('W'); away.form.push('L');
    } else if (g.homeScore < g.awayScore) {
      away.won++; home.lost++; away.points += 3;
      home.form.push('L'); away.form.push('W');
    } else {
      home.drawn++; away.drawn++; home.points++; away.points++;
      home.form.push('D'); away.form.push('D');
    }
  }
  return Object.values(table)
    .map((row) => ({ ...row, gd: row.gf - row.ga, form: row.form.slice(-5) }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    .map((row, i) => ({ position: i + 1, ...row }));
}

export function currentMatchday() {
  const next = games.find((g) => g.status === 'scheduled');
  return next ? next.matchday : games[games.length - 1].matchday;
}

function buildNews() {
  const finals = games.filter((g) => g.status === 'final');
  const lastMd = finals[finals.length - 1].matchday;
  const lastRound = finals.filter((g) => g.matchday === lastMd);
  const biggest = [...lastRound].sort((a, b) => Math.abs(b.homeScore - b.awayScore) - Math.abs(a.homeScore - a.awayScore))[0];
  const winnerId = biggest.homeScore >= biggest.awayScore ? biggest.homeId : biggest.awayId;
  const loserId = winnerId === biggest.homeId ? biggest.awayId : biggest.homeId;
  const leader = getStandings()[0];
  const topScorer = [...players].sort((a, b) => b.stats.goals - a.stats.goals)[0];
  const daysAgo = (n) => new Date(today.getTime() - n * 86400000).toISOString();

  return [
    {
      id: 'matchday-recap',
      category: 'Recap',
      teamId: winnerId,
      title: `${teamById[winnerId].name} run riot in Matchday ${lastMd} statement win`,
      summary: `A ${Math.max(biggest.homeScore, biggest.awayScore)}-${Math.min(biggest.homeScore, biggest.awayScore)} result over ${teamById[loserId].name} headlined a busy weekend across the league.`,
      body: [
        `${teamById[winnerId].name} produced the performance of the weekend, beating ${teamById[loserId].name} ${Math.max(biggest.homeScore, biggest.awayScore)}-${Math.min(biggest.homeScore, biggest.awayScore)} at ${biggest.venue}.`,
        'The visitors never settled into a rhythm, and the hosts pressed high from the first whistle, forcing turnovers in dangerous areas.',
        `Elsewhere on Matchday ${lastMd}, ${lastRound.length - 1} more fixtures were completed. Full scores are available on the Scores page.`,
      ],
      date: daysAgo(2),
      featured: true,
    },
    {
      id: 'title-race',
      category: 'Standings',
      teamId: leader.teamId,
      title: `${teamById[leader.teamId].name} lead the way on ${leader.points} points`,
      summary: `With a goal difference of ${leader.gd > 0 ? '+' : ''}${leader.gd}, the early pacesetters are setting the standard in the title race.`,
      body: [
        `After ${leader.played} matches, ${teamById[leader.teamId].name} sit top of the ${LEAGUE.short} with ${leader.won} wins, ${leader.drawn} draws and ${leader.lost} defeats.`,
        'The chasing pack remains tight, and with the second half of the season still to come, nothing is decided yet.',
      ],
      date: daysAgo(1),
    },
    {
      id: 'golden-boot',
      category: 'Players',
      teamId: topScorer.teamId,
      title: `${topScorer.name} sets the Golden Boot pace with ${topScorer.stats.goals} goals`,
      summary: `The ${teamById[topScorer.teamId].name} forward has been the league's most lethal finisher so far this season.`,
      body: [
        `${topScorer.name} (${topScorer.nationality}, ${topScorer.age}) has found the net ${topScorer.stats.goals} times in ${topScorer.stats.apps} appearances.`,
        'Coaches around the league point to movement in the box and a quick release as the difference-maker.',
      ],
      date: daysAgo(3),
    },
    {
      id: 'youth-academies',
      category: 'Feature',
      teamId: 'pin',
      title: 'Inside the academies shaping the next generation',
      summary: 'From grassroots camps to elite development squads, clubs are investing heavily in homegrown talent.',
      body: [
        'Every club in the league now runs a full-time academy, with programs starting as young as eight years old.',
        'Pinecrest City in particular has drawn praise for promoting four academy graduates to its first-team squad this season.',
      ],
      date: daysAgo(4),
    },
    {
      id: 'tactics-pressing',
      category: 'Analysis',
      teamId: 'sum',
      title: 'Tactics board: why high pressing is dominating the league',
      summary: 'Teams winning the ball in the final third are converting at nearly twice the rate of last season.',
      body: [
        'Summit Athletic have led the trend, regularly committing five or more players to the press.',
        'The risk is obvious: a single broken line can leave a back three exposed. So far, the rewards have outweighed the danger.',
      ],
      date: daysAgo(5),
    },
    {
      id: 'stadium-upgrade',
      category: 'League',
      teamId: 'coa',
      title: 'Coastal Wanderers unveil Tidewater Ground expansion plans',
      summary: 'A new 6,000-seat stand would push capacity past 30,000 by the 2028 season.',
      body: [
        'The club released renderings of a redeveloped south stand featuring safe standing and a rooftop fan zone.',
        'Construction is scheduled to begin at the end of the current campaign.',
      ],
      date: daysAgo(6),
    },
  ];
}

export const news = buildNews();
