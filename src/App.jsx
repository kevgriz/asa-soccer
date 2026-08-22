import React, { useState, useRef, useEffect } from "react";

// ── Broadcast info by conference/school ──────────────────────────────────
// Sources confirmed July 2026:
// Big Ten: BTN (selected) + B1G+ (all others) — bigtennetwork.com / b1gplus.com
// Atlantic 10: ESPN+ for all conference games — espnplus.com
// CAA: ESPN+ (switched from FloSports after 2024) — espnplus.com
// Patriot League: ESPN+ for conference home games — espnplus.com
// MAAC: ESPN+ — espnplus.com
// D3 schools: free stream on school athletics site (YouTube / Stretch Internet)
// D2 (SIAC/SSC): school website / conference stream

const WATCH = {
  "USC": {
    conference: { label: "BTN or B1G+", url: "https://b1gplus.com", note: "Big Ten games on BTN or B1G+. Some non-conference games on ESPN+. Check usctrojans.com for each game's network." },
    nonConf:   { label: "BTN / ESPN+", url: "https://usctrojans.com/sports/womens-soccer/schedule", note: "Non-conference games on BTN, B1G+, or ESPN+. Check usctrojans.com for each game's network." },
    liveStats: "https://usctrojans.com/sports/womens-soccer",
    roster: "https://usctrojans.com/sports/womens-soccer/roster",
    app: "B1G+ app / ESPN app",
  },
  "Duquesne": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "All Atlantic 10 games stream live on ESPN+ ($10.99/mo or Disney Bundle). Live stats free at goduquesne.com." },
    nonConf:   { label: "ESPN+ / goduquesne.com", url: "https://goduquesne.com/sports/womens-soccer", note: "Non-conference games typically on ESPN+ or free via school live stats." },
    liveStats: "https://goduquesne.com/sports/womens-soccer/schedule/2026",
    roster: "https://goduquesne.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "VCU": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "All Atlantic 10 games on ESPN+. Live stats free on vcuathletics.com." },
    nonConf:   { label: "ESPN+ / vcuathletics.com", url: "https://vcuathletics.com/sports/womens-soccer", note: "Non-conference games on ESPN+ or vcuathletics.com Ram Nation Network." },
    liveStats: "https://vcuathletics.com/sports/womens-soccer/schedule/2026",
    roster: "https://vcuathletics.com/sports/womens-soccer/roster/2026",
    app: "ESPN app",
  },
  "Richmond": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "All Atlantic 10 games on ESPN+. Live stats free on richmondspiders.com." },
    nonConf:   { label: "ESPN+ / SpiderTV", url: "https://richmondspiders.com/watch", note: "Non-conference games on SpiderTV (free) or ESPN+." },
    liveStats: "https://richmondspiders.com/sports/womens-soccer/schedule",
    roster: "https://richmondspiders.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Towson": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "CAA conference games on ESPN+. All home games free in person at Tiger Field." },
    nonConf:   { label: "towsontigers.com", url: "https://towsontigers.com/sports/womens-soccer", note: "Non-conference games streamed free on Towson athletics site. All home games free admission." },
    liveStats: "https://towsontigers.com/sports/womens-soccer/schedule/2026",
    roster: "https://towsontigers.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Campbell": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "CAA conference games on ESPN+. Non-conf home games on gocamels.com." },
    nonConf:   { label: "gocamels.com", url: "https://gocamels.com/sports/womens-soccer", note: "Non-conference games typically streamed free on Campbell athletics site." },
    liveStats: "https://gocamels.com/sports/womens-soccer/schedule/2026",
    roster: "https://gocamels.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Lehigh": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Patriot League home games on ESPN+ per league's multi-year deal. Road games on opponent's ESPN+ feed." },
    nonConf:   { label: "lehighsports.com", url: "https://lehighsports.com/sports/womens-soccer", note: "Non-conference games streamed free on Lehigh sports site." },
    liveStats: "https://lehighsports.com/sports/womens-soccer/schedule",
    roster: "https://lehighsports.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Iona": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "MAAC games on ESPN+. Non-conf games on ionagaels.com." },
    nonConf:   { label: "ionagaels.com", url: "https://ionagaels.com/sports/womens-soccer", note: "Non-conference games streamed free on Iona athletics site." },
    liveStats: "https://ionagaels.com/sports/womens-soccer/schedule",
    roster: "https://ionagaels.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Emory": {
    conference: { label: "Free — emoryathletics.com", url: "https://emoryathletics.com/sports/womens-soccer", note: "NCAA D3 games streamed free. Emory uses Stretch Internet / YouTube for home broadcasts." },
    nonConf:   { label: "Free — emoryathletics.com", url: "https://emoryathletics.com/sports/womens-soccer", note: "All games free to stream on Emory Athletics site or YouTube." },
    liveStats: "https://emoryathletics.com/sports/womens-soccer/schedule",
    roster: "https://emoryathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Batten University": {
    conference: { label: "Free — FloCollege", url: "https://battenathletics.com/sports/wsoc/schedule", note: "ODAC games streamed free on VWU athletics site. Home games free admission." },
    nonConf:   { label: "Free — FloCollege", url: "https://battenathletics.com/sports/wsoc", note: "All games free to stream on VWU site." },
    liveStats: "https://battenathletics.com/sports/wsoc",
    roster: "https://battenathletics.com/sports/wsoc/roster",
    app: "YouTube",
  },
  "Randolph College": {
    conference: { label: "Free — randolphathletics.com", url: "https://randolphathletics.com/sports/womens-soccer", note: "ODAC games streamed free on Randolph Athletics site." },
    nonConf:   { label: "Free — randolphathletics.com", url: "https://randolphathletics.com/sports/womens-soccer", note: "All games free to stream on Randolph site." },
    liveStats: "https://randolphathletics.com/sports/womens-soccer",
    roster: "https://randolphathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Marymount University": {
    conference: { label: "Free — AE Network", url: "https://www.atlanticeastnetwork.com/marymount/", note: "AEC games stream free on Atlantic East Network. Home games at Long Bridge Park in Arlington!" },
    nonConf:   { label: "Free — muathletics.com", url: "https://muathletics.com", note: "All games free to stream." },
    liveStats: "https://muathletics.com",
    roster: "https://muathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Williams College": {
    conference: { label: "Free — ephsports.williams.edu", url: "https://ephsports.williams.edu/sports/womens-soccer", note: "NESCAC games streamed free on Williams Athletics site." },
    nonConf:   { label: "Free — ephsports.williams.edu", url: "https://ephsports.williams.edu/sports/womens-soccer", note: "All games free to stream on Williams site." },
    liveStats: "https://ephsports.williams.edu/sports/womens-soccer",
    roster: "https://ephsports.williams.edu/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Oberlin College": {
    conference: { label: "Free — oberlinathletics.com", url: "https://oberlinathletics.com/sports/womens-soccer", note: "NCAC games streamed free on Oberlin Athletics site." },
    nonConf:   { label: "Free — oberlinathletics.com", url: "https://oberlinathletics.com/sports/womens-soccer", note: "All games free to stream." },
    liveStats: "https://oberlinathletics.com/sports/womens-soccer",
    roster: "https://oberlinathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "College of Wooster": {
    conference: { label: "Free — gowooster.com", url: "https://gowooster.com/sports/womens-soccer", note: "NCAC games streamed free on Wooster Athletics site." },
    nonConf:   { label: "Free — gowooster.com", url: "https://gowooster.com/sports/womens-soccer", note: "All games free to stream." },
    liveStats: "https://gowooster.com/sports/womens-soccer",
    roster: "https://gowooster.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Purdue Fort Wayne": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Horizon League games on ESPN+. Check gomomastodons.com for non-conf streams." },
    nonConf:   { label: "gomomastodons.com", url: "https://gomomastodons.com/sports/womens-soccer", note: "Non-conf games typically streamed free on PFW site." },
    liveStats: "https://gomomastodons.com/sports/womens-soccer",
    roster: "https://gomomastodons.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Tuskegee": {
    conference: { label: "tuskegeetigers.com", url: "https://tuskegeetigers.com", note: "SIAC games streamed on Tuskegee athletics site. Check for SIAC digital network availability." },
    nonConf:   { label: "tuskegeetigers.com", url: "https://tuskegeetigers.com", note: "All games on Tuskegee athletics site." },
    liveStats: "https://tuskegeetigers.com",
    roster: "https://tuskegeetigers.com/sports/womens-soccer/roster",
    app: "School site",
  },
  "The Citadel": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Southern Conference games on ESPN+. Non-conf on citadelsports.com." },
    nonConf:   { label: "citadelsports.com", url: "https://citadelsports.com/sports/womens-soccer", note: "Non-conference games streamed free on Citadel site." },
    liveStats: "https://citadelsports.com/sports/womens-soccer",
    roster: "https://citadelsports.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Tampa": {
    conference: { label: "ut-spartans.com", url: "https://ut-spartans.com/sports/womens-soccer", note: "SSC (Sunshine State Conference) games streamed on school site. Check for SSC digital network." },
    nonConf:   { label: "ut-spartans.com", url: "https://ut-spartans.com/sports/womens-soccer", note: "All games on Tampa athletics site." },
    liveStats: "https://ut-spartans.com/sports/womens-soccer",
    roster: "https://ut-spartans.com/sports/womens-soccer/roster",
    app: "School site",
  },
};

const PLAYERS = [
  { name: "Ally Griswold", college: "USC", division: "D1", conference: "Big Ten", note: "Freshman · Defender" },
  { name: "Claire Beasley", college: "Duquesne", division: "D1", conference: "Atlantic 10", note: "Freshman · Midfielder" },
  { name: "Alexis Cox", college: "VCU", division: "D1", conference: "Atlantic 10", note: "Freshman · Forward" },
  { name: "Madeleine Brown", college: "Williams College", division: "D3", conference: "NESCAC", note: "Freshman · Midfielder" },
  { name: "Callie Conrad", college: "Batten University", division: "D3", conference: "ODAC", note: "Freshman · Defender" },
  { name: "Zuri Johnson", college: "Towson", division: "D1", conference: "CAA", note: "Freshman · Forward" },
  { name: "Aimee Abraham", college: "Purdue Fort Wayne", division: "D1", conference: "Horizon", note: "Freshman · Goalkeeper" },
  { name: "Alden Marin", college: "Richmond", division: "D1", conference: "Atlantic 10", note: "Freshman · Forward" },
  { name: "Elyse Markowski", college: "Emory", division: "D3", conference: "UAA", note: "Freshman · Defender" },
  { name: "Elena Schultz", college: "Batten University", division: "D3", conference: "ODAC", note: "Freshman · Goalkeeper" },
  { name: "Maya Reid", college: "Marymount University", division: "D3", conference: "AEC", note: "Freshman · Forward" },
  { name: "Sadie Smith", college: "College of Wooster", division: "D3", conference: "NCAC", note: "Freshman · Defender" },
  { name: "Mya Oboite", college: "Virginia State", division: "D2", conference: "CIAA", note: "Freshman - Defender" },
  { name: "Isabella Coffin", college: "Randolph College", division: "D3", conference: "ODAC", note: "Freshman · Defender" },
  { name: "Daeycine Robinson", college: "Tuskegee", division: "D2", conference: "SIAC", note: "Freshman · Defender/Forward" },
  { name: "MacKenzie Allen", college: "Tuskegee", division: "D2", conference: "SIAC", note: "Freshman · Goalkeeper" },
  { name: "Linnea Hedlund", college: "Campbell", division: "D1", conference: "CAA", note: "Freshman · Midfielder" },
  { name: "Rylee Jarman", college: "Iona", division: "D1", conference: "Metro", note: "Freshman · Forward/Defender" },
  { name: "Melanie DeCareau", college: "Emory", division: "D3", conference: "UAA", note: "Freshman · Forward" },
  { name: "Natalie Horak", college: "Oberlin College", division: "D3", conference: "NCAC", note: "Freshman · Defender" },
  { name: "Molly Kinsella", college: "Duquesne", division: "D1", conference: "Atlantic 10", note: "Freshman · Midfielder" },
  { name: "Ella Pomaranksi", college: "Lehigh", division: "D1", conference: "Patriot League", note: "Freshman · Defender/Midfielder" },
  { name: "Gabriellah Davis", college: "The Citadel", division: "D1", conference: "Southern", note: "Freshman · Defender" },
  { name: "Sofia Bollman", college: "Lehigh", division: "D1", conference: "Patriot League", note: "Freshman · Forward/Midfielder" },
  { name: "Priya Viswanath", college: "Marymount University", division: "D3", conference: "AEC", note: "Freshman · Defender" },
];

// ── 2025 Graduating Class (ASA 07/06G ECNL) ────────────────────────────
// Sources: arlingtonsoccer.com commitments page + 07/06 ECNL roster slides
const PLAYERS_2025 = [
  { name: "Charlotte Kulikosky", college: "Delaware", division: "D1", conference: "Conference USA", classYear: 2025, note: "Sophomore · Goalkeeper" },
  { name: "Caitlin Burke", college: "Davidson", division: "D1", conference: "Atlantic 10", classYear: 2025, note: "Sophomore · Defender" },
  { name: "Dani Miller", college: "Harvard", division: "D1", conference: "Ivy League", classYear: 2025, note: "Sophomore · Defender" },
  { name: "Erin Fay", college: "Vermont", division: "D1", conference: "America East", classYear: 2025, note: "Sophomore · Forward" },
  { name: "Quincy Greene", college: "Washington & Lee", division: "D3", conference: "ODAC", classYear: 2025, note: "Sophomore · Forward" },
  { name: "Reese Montgomery", college: "Davidson", division: "D1", conference: "Atlantic 10", classYear: 2025, note: "Sophomore · Midfielder" },
  { name: "Liv Stafford", college: "Vanderbilt", division: "D1", conference: "SEC", classYear: 2025, note: "Sophomore · Forward" },
  { name: "Gwen Doughty", college: "William & Mary", division: "D1", conference: "CAA", classYear: 2025, note: "Sophomore · Goalkeeper" },
  { name: "Ali White", college: "Emory", division: "D3", conference: "UAA", classYear: 2025, note: "Sophomore · Goalkeeper" },
  { name: "Stella Corso", college: "Christopher Newport", division: "D3", conference: "C2C", classYear: 2025, note: "Sophomore · Defender" },
  { name: "Kiera Chang", college: "Carnegie Mellon", division: "D3", conference: "UAA", classYear: 2025, note: "Sophomore · Forward/Midfielder" },
  { name: "Frances Shapiro", college: "Denison", division: "D3", conference: "NCAC", classYear: 2025, note: "Sophomore · Midfielder" },
  { name: "Scarlett Smith", college: "Manhattan College", division: "D1", conference: "Metro", classYear: 2025, note: "Sophomore · Forward" },
  { name: "Sanai Bayna", college: "American University", division: "D1", conference: "Patriot League", classYear: 2025, note: "Sophomore · Defender" },
  { name: "Mikayla Edmunds", college: "Macalester", division: "D3", conference: "MIAC", classYear: 2025, note: "Sophomore · Forward" },
  { name: "Caroline Klauder", college: "Carnegie Mellon", division: "D3", conference: "UAA", classYear: 2025, note: "Sophomore · Midfielder" },
  { name: "Kylie Emanuel", college: "Pennsylvania", division: "D1", conference: "Ivy League", classYear: 2025, note: "Sophomore · Midfielder" },
  { name: "Navi Kawesi-Makooza", college: "Old Dominion", division: "D1", conference: "Sun Belt", classYear: 2025, note: "Sophomore · Defender" },
  { name: "Nicola Muldowney", college: "Union College", division: "D3", conference: "Liberty League", classYear: 2025, note: "Sophomore · Defender" },
];

// ── 2024 Graduating Class (Arlington Soccer Women) ─────────────────────────
// Confirmed via roster checks July 2026:
// ✓ Kate Hawley: transferred to Vermont (America East) for 2026
// ✓ Samantha Winer: Maryland (redshirt sophomore, 12 appearances in 2025)
// ✓ Ava Milisits: transferred to Hampton University (CAA) from Richmond for 2026
// ⚠ All others: unconfirmed — pending roster cross-check
const PLAYERS_2024 = [
  { name: "Maya Blackston",            college: "Howard",              division: "D1", conference: "MEAC",        classYear: 2024, note: "Junior · Midfielder" },
  { name: "Molly DeBrandt",            college: "Franklin & Marshall", division: "D3", conference: "Centennial",  classYear: 2024, note: "Junior · Goalkeeper" },
  { name: "Kendall Frederick",         college: "Johns Hopkins",       division: "D3", conference: "Centennial",  classYear: 2024, note: "Junior · Midfielder" },
  { name: "Emily Garrard",             college: "Dartmouth",           division: "D1", conference: "Ivy League",  classYear: 2024, note: "Junior · Forward" },
  { name: "Kinzly Gootman",            college: "Case Western Reserve",division: "D3", conference: "UAA",         classYear: 2024, note: "Junior · Defender" },
  { name: "Kate Hawley",               college: "Vermont",             division: "D1", conference: "America East", classYear: 2024, note: "Junior · Forward/Midfielder" },
  { name: "Samantha Winer",            college: "Maryland",            division: "D1", conference: "Big Ten",     classYear: 2024, note: "Junior · Defender" },
  { name: "Kate Leland",               college: "Bates College",       division: "D3", conference: "NESCAC",      classYear: 2024, note: "Junior · Defender" },
  { name: "Jocelyn Lohmeyer",          college: "Georgetown",          division: "D1", conference: "Big East",    classYear: 2024, note: "Junior · Forward" },
  { name: "Emily McBride",             college: "Connecticut College", division: "D3", conference: "NESCAC",      classYear: 2024, note: "Junior · Goalkeeper" },
  { name: "Ava Milisits",              college: "Hampton",             division: "D1", conference: "CAA",         classYear: 2024, note: "Junior · Forward" },
  { name: "Kit Mooney",                college: "Denver",              division: "D1", conference: "WCC",         classYear: 2024, note: "Junior · Midfielder/Defender" },
  { name: "Anwen Reed",                college: "Swarthmore",          division: "D3", conference: "Centennial",  classYear: 2024, note: "Junior · Forward" },
  { name: "Roam Redington",            college: "Oberlin College",     division: "D3", conference: "NCAC",        classYear: 2024, note: "Junior · Goalkeeper" },
  { name: "Jackie Shores",             college: "Bowdoin",             division: "D3", conference: "NESCAC",      classYear: 2024, note: "Junior · Forward" },
  { name: "Solveig Unteroberdoerster", college: "Wellesley",           division: "D3", conference: "NEWMAC",      classYear: 2024, note: "Junior · Forward/Midfielder" },
  { name: "Abby Welker",               college: "Case Western Reserve",division: "D3", conference: "UAA",         classYear: 2024, note: "Junior · Midfielder" },
];

// ── 2023 Graduating Class (Arlington Soccer Women) ─────────────────────────
// Confirmed via roster checks July 2026:
// ✓ Phoebe Carver: Arkansas (2023) → USC (2024-25) → Purdue (2026, Big Ten)
// ✓ CJ Roy: Northwestern (junior, M/D)
// ✓ Talia Omer: Manhattan (junior, active)
// ✓ Talia Agrillo: BU (junior, injured but enrolled)
// ✓ Ava Hecker: W&L (senior)
// ✓ Emily Burke: W&L (junior)
// ⚠ Mia Stoller, Cadence Lee, Eva Torres, Olivia Becker: unconfirmed — pending roster cross-check
const PLAYERS_2023 = [
  { name: "Phoebe Carver",  college: "Purdue",               division: "D1", conference: "Big Ten",      classYear: 2023, note: "Senior · Goalkeeper" },
  { name: "CJ Roy",         college: "Northwestern",         division: "D1", conference: "Big Ten",      classYear: 2023, note: "Senior · Goalkeeper" },
  { name: "Talia Omer",     college: "Manhattan College",    division: "D1", conference: "Metro",        classYear: 2023, note: "Senior · Defender" },
  { name: "Talia Agrillo",  college: "Boston University",    division: "D1", conference: "Patriot League", classYear: 2023, note: "Senior · Defender" },
  { name: "Ava Hecker",     college: "Washington & Lee",     division: "D3", conference: "ODAC",         classYear: 2023, note: "Senior · Defender/Midfielder" },
  { name: "Emily Burke",    college: "Washington & Lee",     division: "D3", conference: "ODAC",         classYear: 2023, note: "Senior · Forward" },
  { name: "Mia Stoller",    college: "College of Wooster",   division: "D3", conference: "NCAC",         classYear: 2023, note: "Senior · Defender" },
  { name: "Cadence Lee",    college: "Bowdoin",              division: "D3", conference: "NESCAC",       classYear: 2023, note: "Senior · Midfielder" },
  { name: "Eva Torres",     college: "VMI",                  division: "D1", conference: "Southern",     classYear: 2023, note: "Senior · Forward" },
  { name: "Olivia Becker",  college: "Bates College",        division: "D3", conference: "NESCAC",       classYear: 2023, note: "Senior · Forward" },
];

// ── Additional WATCH entries for 2025 schools not already in WATCH ────────
const WATCH_2025_EXTRA = {
  "Delaware": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "CAA conference games on ESPN+." },
    nonConf:   { label: "bluehens.com", url: "https://bluehens.com/sports/womens-soccer", note: "Non-conf on Delaware athletics site." },
    liveStats: "https://bluehens.com/sports/womens-soccer/schedule",
    roster: "https://bluehens.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Davidson": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "All Atlantic 10 games on ESPN+." },
    nonConf:   { label: "davidsonwildcats.com", url: "https://davidsonwildcats.com/sports/womens-soccer", note: "Non-conf on Davidson site." },
    liveStats: "https://davidsonwildcats.com/sports/womens-soccer/schedule",
    roster: "https://davidsonwildcats.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Harvard": {
    conference: { label: "ESPN+ / ESPNU", url: "https://www.espnplus.com", note: "Ivy League games on ESPN+. Select matches on ESPNU." },
    nonConf:   { label: "gocrimson.com", url: "https://www.gocrimson.com/sports/womens-soccer", note: "Non-conf on Harvard site." },
    liveStats: "https://www.gocrimson.com/sports/womens-soccer/schedule",
    roster: "https://www.gocrimson.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Vermont": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "America East games on ESPN+." },
    nonConf:   { label: "uvm.edu/athletics", url: "https://uvmathletics.com/sports/womens-soccer", note: "Non-conf on Vermont site." },
    liveStats: "https://uvmathletics.com/sports/womens-soccer/schedule",
    roster: "https://uvmathletics.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Washington & Lee": {
    conference: { label: "Free — generalssports.com", url: "https://generalssports.com/sports/womens-soccer", note: "NCAA D3, ODAC. All games free on W&L site." },
    nonConf:   { label: "Free — generalssports.com", url: "https://generalssports.com/sports/womens-soccer", note: "All games free to stream." },
    liveStats: "https://generalssports.com/sports/womens-soccer",
    roster: "https://generalssports.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Vanderbilt": {
    conference: { label: "SEC Network / ESPN+", url: "https://www.espnplus.com", note: "SEC games on SEC Network (cable) or ESPN+. Select games on ESPNU." },
    nonConf:   { label: "ESPN+ / vucommodores.com", url: "https://vucommodores.com/sports/womens-soccer", note: "Non-conf on Vanderbilt site or ESPN+." },
    liveStats: "https://vucommodores.com/sports/womens-soccer/schedule",
    roster: "https://vucommodores.com/sports/womens-soccer/roster",
    app: "ESPN app / SEC Network app",
  },
  "William & Mary": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "CAA games on ESPN+." },
    nonConf:   { label: "tribeathletics.com", url: "https://tribeathletics.com/sports/womens-soccer", note: "Non-conf on W&M site." },
    liveStats: "https://tribeathletics.com/sports/womens-soccer/schedule",
    roster: "https://tribeathletics.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Hampton": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "CAA games on ESPN+." },
    nonConf:   { label: "hamptonpirates.com", url: "https://hamptonpirates.com/sports/womens-soccer", note: "Non-conf on Hampton site." },
    liveStats: "https://hamptonpirates.com/sports/womens-soccer/schedule",
    roster: "https://hamptonpirates.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Christopher Newport": {
    conference: { label: "Free — cnusports.com", url: "https://cnusports.com/sports/womens-soccer", note: "NCAA D3, C2C Athletic Conference. All games free to stream." },
    nonConf:   { label: "Free — cnusports.com", url: "https://cnusports.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://cnusports.com/sports/womens-soccer",
    roster: "https://cnusports.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Carnegie Mellon": {
    conference: { label: "Free — athletics.cmu.edu", url: "https://athletics.cmu.edu/sports/womens-soccer", note: "NCAA D3, UAA. All games free to stream." },
    nonConf:   { label: "Free — athletics.cmu.edu", url: "https://athletics.cmu.edu/sports/womens-soccer", note: "All games free." },
    liveStats: "https://athletics.cmu.edu/sports/womens-soccer",
    roster: "https://athletics.cmu.edu/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Denison": {
    conference: { label: "Free — denisonbigred.com", url: "https://denisonbigred.com/sports/womens-soccer", note: "NCAA D3, NCAC. All games free to stream." },
    nonConf:   { label: "Free — denisonbigred.com", url: "https://denisonbigred.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://denisonbigred.com/sports/womens-soccer",
    roster: "https://denisonbigred.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Manhattan College": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Metro Conference (formerly MAAC) games on ESPN+." },
    nonConf:   { label: "gojaspers.com", url: "https://gojaspers.com/sports/womens-soccer", note: "Non-conf on Manhattan site." },
    liveStats: "https://gojaspers.com/sports/womens-soccer/schedule",
    roster: "https://gojaspers.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "American University": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Patriot League games on ESPN+." },
    nonConf:   { label: "aueagles.com", url: "https://aueagles.com/sports/womens-soccer", note: "Non-conf on AU site." },
    liveStats: "https://aueagles.com/sports/womens-soccer/schedule",
    roster: "https://aueagles.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "TBD": {
    conference: { label: "TBD", url: "#", note: "College destination not yet confirmed." },
    nonConf:   { label: "TBD", url: "#", note: "College destination not yet confirmed." },
    liveStats: "#",
    roster: "#",
    app: "TBD",
  },
  "Pennsylvania": {
    conference: { label: "ESPN+ / ESPNU", url: "https://www.espnplus.com", note: "Ivy League games on ESPN+. Select matches on ESPNU." },
    nonConf:   { label: "pennathletics.com", url: "https://pennathletics.com/sports/womens-soccer", note: "Non-conf on Penn site." },
    liveStats: "https://pennathletics.com/sports/womens-soccer/schedule",
    roster: "https://pennathletics.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Old Dominion": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Sun Belt games on ESPN+." },
    nonConf:   { label: "odusports.com", url: "https://odusports.com/sports/womens-soccer", note: "Non-conf on ODU site." },
    liveStats: "https://odusports.com/sports/womens-soccer/schedule",
    roster: "https://odusports.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Macalester": {
    conference: { label: "Free — macathletics.com", url: "https://macathletics.com/sports/womens-soccer", note: "NCAA D3, MIAC. All games free to stream on Macalester site." },
    nonConf:   { label: "Free — macathletics.com", url: "https://macathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://macathletics.com/sports/womens-soccer",
    roster: "https://macathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Union College": {
    conference: { label: "Free — unionathletics.com", url: "https://unionathletics.com/sports/womens-soccer", note: "NCAA D3, Liberty League. All games free to stream." },
    nonConf:   { label: "Free — unionathletics.com", url: "https://unionathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://unionathletics.com/sports/womens-soccer",
    roster: "https://unionathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
};

// ── Watch info for 2024 schools ───────────────────────────────────────────
const WATCH_2024_EXTRA = {
  "Howard": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "MEAC games on ESPN+." },
    nonConf:   { label: "hubison.com", url: "https://hubison.com/sports/womens-soccer", note: "Non-conf on Howard site." },
    liveStats: "https://hubison.com/sports/womens-soccer/schedule",
    roster: "https://hubison.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Franklin & Marshall": {
    conference: { label: "Free — fandmathletics.com", url: "https://fandmathletics.com/sports/womens-soccer", note: "NCAA D3, Centennial Conference. All games free to stream." },
    nonConf:   { label: "Free — fandmathletics.com", url: "https://fandmathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://fandmathletics.com/sports/womens-soccer",
    roster: "https://fandmathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Johns Hopkins": {
    conference: { label: "Free — hopkinsathletics.com", url: "https://hopkinsathletics.com/sports/womens-soccer", note: "NCAA D3, Centennial Conference. All games free to stream." },
    nonConf:   { label: "Free — hopkinsathletics.com", url: "https://hopkinsathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://hopkinsathletics.com/sports/womens-soccer",
    roster: "https://hopkinsathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Dartmouth": {
    conference: { label: "ESPN+ / ESPNU", url: "https://www.espnplus.com", note: "Ivy League games on ESPN+. Select matches on ESPNU." },
    nonConf:   { label: "dartmouthsports.com", url: "https://dartmouthsports.com/sports/womens-soccer", note: "Non-conf on Dartmouth site." },
    liveStats: "https://dartmouthsports.com/sports/womens-soccer/schedule",
    roster: "https://dartmouthsports.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Case Western Reserve": {
    conference: { label: "Free — gospartans.com", url: "https://gospartans.com/sports/womens-soccer", note: "NCAA D3, UAA. All games free to stream." },
    nonConf:   { label: "Free — gospartans.com", url: "https://gopartans.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://gopartans.com/sports/womens-soccer",
    roster: "https://gopartans.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Maryland": {
    conference: { label: "BTN / ESPN+", url: "https://www.bigtennetwork.com", note: "Big Ten games on BTN (cable) or ESPN+." },
    nonConf:   { label: "umterps.com", url: "https://umterps.com/sports/womens-soccer", note: "Non-conf on Maryland site." },
    liveStats: "https://umterps.com/sports/womens-soccer/schedule",
    roster: "https://umterps.com/sports/womens-soccer/roster",
    app: "ESPN app / B1G+ app",
  },
  "Bates College": {
    conference: { label: "Free — gobatesbobcats.com", url: "https://gobatesbobcats.com/sports/womens-soccer", note: "NCAA D3, NESCAC. All games free to stream." },
    nonConf:   { label: "Free — gobatesbobcats.com", url: "https://gobatesbobcats.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://gobatesbobcats.com/sports/womens-soccer",
    roster: "https://gobatesbobcats.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Georgetown": {
    conference: { label: "FS1 / ESPN+", url: "https://www.espnplus.com", note: "Big East games on FS1 or ESPN+." },
    nonConf:   { label: "guhoyas.com", url: "https://guhoyas.com/sports/womens-soccer", note: "Non-conf on Georgetown site." },
    liveStats: "https://guhoyas.com/sports/womens-soccer/schedule",
    roster: "https://guhoyas.com/sports/womens-soccer/roster",
    app: "ESPN app / Fox Sports app",
  },
  "Connecticut College": {
    conference: { label: "Free — conncollathletics.com", url: "https://conncollathletics.com/sports/womens-soccer", note: "NCAA D3, NESCAC. All games free to stream." },
    nonConf:   { label: "Free — conncollathletics.com", url: "https://conncollathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://conncollathletics.com/sports/womens-soccer",
    roster: "https://conncollathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Denver": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Summit League games on ESPN+." },
    nonConf:   { label: "denverpioneers.com", url: "https://denverpioneers.com/sports/womens-soccer", note: "Non-conf on Denver site." },
    liveStats: "https://denverpioneers.com/sports/womens-soccer/schedule",
    roster: "https://denverpioneers.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "Swarthmore": {
    conference: { label: "Free — swarthmoreathletics.com", url: "https://swarthmoreathletics.com/sports/womens-soccer", note: "NCAA D3, Centennial Conference. All games free to stream." },
    nonConf:   { label: "Free — swarthmoreathletics.com", url: "https://swarthmoreathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://swarthmoreathletics.com/sports/womens-soccer",
    roster: "https://swarthmoreathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Bowdoin": {
    conference: { label: "Free — bowdoinsports.com", url: "https://bowdoinsports.com/sports/womens-soccer", note: "NCAA D3, NESCAC. All games free to stream." },
    nonConf:   { label: "Free — bowdoinsports.com", url: "https://bowdoinsports.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://bowdoinsports.com/sports/womens-soccer",
    roster: "https://bowdoinsports.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
  "Wellesley": {
    conference: { label: "Free — wellesleyathletics.com", url: "https://wellesleyathletics.com/sports/womens-soccer", note: "NCAA D3, NEWMAC. All games free to stream." },
    nonConf:   { label: "Free — wellesleyathletics.com", url: "https://wellesleyathletics.com/sports/womens-soccer", note: "All games free." },
    liveStats: "https://wellesleyathletics.com/sports/womens-soccer",
    roster: "https://wellesleyathletics.com/sports/womens-soccer/roster",
    app: "YouTube",
  },
};

// ── Watch info for 2023 schools ───────────────────────────────────────────
const WATCH_2023_EXTRA = {
  "Purdue": {
    conference: { label: "BTN / ESPN+", url: "https://www.bigtennetwork.com", note: "Big Ten games on BTN or ESPN+. B1G+ $9.95/mo." },
    nonConf:   { label: "purduesports.com", url: "https://purduesports.com/sports/soccer", note: "Non-conf on Purdue site." },
    liveStats: "https://purduesports.com/sports/soccer/schedule",
    roster: "https://purduesports.com/sports/soccer/roster",
    app: "ESPN app / B1G+ app",
  },
  "Arkansas": {
    conference: { label: "SEC Network / ESPN+", url: "https://www.espnplus.com", note: "SEC games on SEC Network or ESPN+." },
    nonConf:   { label: "hogwired.com", url: "https://hogwired.com/sports/womens-soccer", note: "Non-conf on Arkansas site." },
    liveStats: "https://hogwired.com/sports/womens-soccer/schedule",
    roster: "https://hogwired.com/sports/womens-soccer/roster",
    app: "ESPN app / SEC Network app",
  },
  "Northwestern": {
    conference: { label: "BTN / ESPN+", url: "https://www.bigtennetwork.com", note: "Big Ten games on BTN or ESPN+." },
    nonConf:   { label: "nusports.com", url: "https://nusports.com/sports/womens-soccer", note: "Non-conf on Northwestern site." },
    liveStats: "https://nusports.com/sports/womens-soccer/schedule",
    roster: "https://nusports.com/sports/womens-soccer/roster",
    app: "ESPN app / B1G+ app",
  },
  "Boston University": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Patriot League games on ESPN+." },
    nonConf:   { label: "goterriers.com", url: "https://goterriers.com/sports/womens-soccer", note: "Non-conf on BU site." },
    liveStats: "https://goterriers.com/sports/womens-soccer/schedule",
    roster: "https://goterriers.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
  "VMI": {
    conference: { label: "ESPN+", url: "https://www.espnplus.com", note: "Southern Conference games on ESPN+." },
    nonConf:   { label: "vmisports.com", url: "https://vmisports.com/sports/womens-soccer", note: "Non-conf on VMI site." },
    liveStats: "https://vmisports.com/sports/womens-soccer/schedule",
    roster: "https://vmisports.com/sports/womens-soccer/roster",
    app: "ESPN app",
  },
};

const ALL_MATCHUPS = [
  // ── Always visible (2026 only) ────────────────────────────────────────
  {
    id: "a10-2026", division: "D1", conference: "Atlantic 10", tag: "Confirmed Matchups", confirmed: true,
    requires: [],
    description: "Duquesne, VCU, and Richmond all play in the Atlantic 10 — three confirmed dates from published schedules. All stream live on ESPN+.",
    colleges: ["Duquesne", "VCU", "Richmond"],
    pairs: [
      { home: "Richmond",  away: "Duquesne", date: "Sep 24", time: "5:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "VCU",       away: "Duquesne", date: "Sep 27", time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Richmond",  away: "VCU",      date: "Oct 22", time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "centennial-2026", division: "D3", conference: "Centennial", tag: "Confirmed Matchups", confirmed: true,
    requires: [],
    description: "Kendall Frederick '24 (Johns Hopkins), Anwen Reed '24 (Swarthmore), and Molly DeBrandt '24 (F&M) are all seniors in the Centennial Conference — a perfect round-robin, every pair confirmed. All games stream free.",
    colleges: ["Johns Hopkins", "Swarthmore", "Franklin & Marshall"],
    pairs: [
      { home: "Swarthmore",          away: "Johns Hopkins",       date: "Sep 19", time: "1:00 PM ET",  watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/swarthmoreathletics" },
      { home: "Franklin & Marshall", away: "Swarthmore",          date: "Sep 26", time: "12:00 PM ET", watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/godiplomats" },
      { home: "Franklin & Marshall", away: "Johns Hopkins",       date: "Oct 17", time: "4:00 PM ET",  watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/godiplomats" },
    ],
  },
  {
    id: "odac-2026", division: "D3", conference: "ODAC", tag: "Confirmed Matchups", confirmed: true,
    requires: [],
    description: "Batten University and Randolph College both compete in ODAC — home-and-away matchups confirmed. Stream free on FloCollege.",
    colleges: ["Batten University", "Randolph College"],
    pairs: [
      { home: "Randolph College",    away: "Batten University", date: "Sep 30", time: "6:00 PM ET", watch: "Free — FloCollege", watchUrl: "https://flosports.tv/flocollege" },
      { home: "Batten University",   away: "Randolph College",  date: "Oct 3",  time: "11:00 AM ET", watch: "Free — FloCollege", watchUrl: "https://flosports.tv/flocollege" },
    ],
  },
  {
    id: "ncac-2026", division: "D3", conference: "NCAC", tag: "Confirmed Matchups", confirmed: true,
    requires: [],
    description: "Oberlin and College of Wooster are both in the NCAC — two confirmed home-and-away matchups. Stream free.",
    colleges: ["Oberlin College", "College of Wooster"],
    pairs: [
      { home: "College of Wooster", away: "Oberlin College", date: "Oct 6",  time: "3:00 PM ET", watch: "Free — northcoastnetwork.com", watchUrl: "https://northcoastnetwork.com/wooster/" },
      { home: "Oberlin College",    away: "College of Wooster", date: "Oct 31", time: "TBA",     watch: "Free — Oberlin Sports Network", watchUrl: "https://oberlinsportsnetwork.com" },
    ],
  },
  {
    id: "caa-note", division: "D1", conference: "CAA", tag: "Same Conference — No 2026 Matchup", confirmed: false,
    requires: [],
    description: "Towson (North Div.) and Campbell (South Div.) are both in the CAA but do not appear on each other's confirmed 2026 schedules.",
    colleges: ["Towson", "Campbell"],
    pairs: [],
  },

  // ── Additional matchups when 2025 grads are included ─────────────────
  {
    id: "a10-2025", division: "D1", conference: "Atlantic 10", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Davidson (Caitlin Burke & Reese Montgomery '25) joins Duquesne, VCU, and Richmond in the A-10 — 5 Arlington athletes across 4 schools. All games on ESPN+.",
    colleges: ["Davidson", "Duquesne", "VCU", "Richmond"],
    pairs: [
      { home: "Davidson", away: "Duquesne", date: "Oct 22", time: "7:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Davidson", away: "Richmond", date: "Oct 11", time: "1:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Davidson", away: "VCU",      date: "TBA",    time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "caa-2025", division: "D1", conference: "CAA", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "William & Mary (Gwen Doughty '25) and Delaware (Charlotte Kulikosky '25) join Towson and Campbell in the CAA — four Arlington athletes. Games on ESPN+.",
    colleges: ["William & Mary", "Delaware", "Towson", "Campbell"],
    pairs: [
      { home: "William & Mary", away: "Delaware",  date: "TBA",    time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "William & Mary", away: "Towson",    date: "Sep 24", time: "7:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "William & Mary", away: "Campbell",  date: "Oct 2",  time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Towson",         away: "Delaware",  date: "TBA",    time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "metro-2025", division: "D1", conference: "Metro", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Manhattan College (Scarlett Smith '25) and Iona (Rylee Jarman '26) are both in the Metro Conference — confirmed Nov 4 matchup at Gaelic Park. Games on ESPN+.",
    colleges: ["Manhattan College", "Iona"],
    pairs: [
      { home: "Manhattan College", away: "Iona", date: "Nov 4", time: "3:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Iona", away: "Manhattan College", date: "TBA",   time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "ivy-2025", division: "D1", conference: "Ivy League", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Harvard (Dani Miller '25) and Pennsylvania (Kylie Emanuel '25) are both in the Ivy League — confirmed Oct 31 matchup at Rhodes Field (4:00 PM). Games on ESPN+.",
    colleges: ["Harvard", "Pennsylvania"],
    pairs: [
      { home: "Pennsylvania", away: "Harvard", date: "Oct 31", time: "4:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Harvard", away: "Pennsylvania", date: "TBA",    time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "patriot-2025", division: "D1", conference: "Patriot League", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "American University (Sanai Bayna '25) joins Lehigh (Sofia Bollman & Ella Pomaranski '26) in the Patriot League — confirmed Oct 4 matchup at Ulrich Sports Complex (1:00 PM). Games on ESPN+.",
    colleges: ["American University", "Lehigh"],
    pairs: [
      { home: "Lehigh",             away: "American University", date: "Oct 4", time: "1:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "American University", away: "Lehigh",            date: "TBA",   time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "odac-2025", division: "D3", conference: "ODAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Washington & Lee (Quincy Greene '25) expands the ODAC group — confirmed Sep 12 at CNU (non-conf), Sep 26 at Randolph, Oct 17 vs Batten. All games stream free on FloCollege.",
    colleges: ["Christopher Newport", "Washington & Lee", "Batten University", "Randolph College"],
    pairs: [
      { home: "Christopher Newport", away: "Washington & Lee", date: "Sep 12", time: "12:00 PM ET", watch: "Free — cnusports.com", watchUrl: "https://cnusports.com/sports/womens-soccer" },
      { home: "Randolph College",    away: "Washington & Lee", date: "Sep 26", time: "1:00 PM ET",  watch: "Free — FloCollege", watchUrl: "https://flosports.tv/flocollege" },
      { home: "Washington & Lee",    away: "Batten University", date: "Oct 17", time: "3:00 PM ET", watch: "Free — FloCollege", watchUrl: "https://flosports.tv/flocollege" },
    ],
  },
  {
    id: "ncac-2025", division: "D3", conference: "NCAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Denison (Frances Shapiro '25) joins Oberlin and College of Wooster in the NCAC — confirmed: Denison hosts Wooster Oct 17 (1:00 PM), Denison hosts CWR Sep 26 (12:00 PM). All games free.",
    colleges: ["Denison", "Oberlin College", "College of Wooster"],
    pairs: [
      { home: "Denison", away: "College of Wooster", date: "Oct 17", time: "1:00 PM ET",  watch: "Free — North Coast Network", watchUrl: "https://northcoastnetwork.com/denison/" },
      { home: "Denison", away: "Oberlin College",    date: "Oct 24", time: "11:30 AM ET", watch: "Free — North Coast Network", watchUrl: "https://northcoastnetwork.com/denison/" },
      { home: "Oberlin College", away: "College of Wooster", date: "Oct 31", time: "TBA", watch: "Free — Oberlin Sports Network", watchUrl: "https://oberlinsportsnetwork.com" },
    ],
  },
  {
    id: "uaa-2025", division: "D3", conference: "UAA", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2025"],
    description: "Carnegie Mellon (Kiera Chang & Caroline Klauder '25) joins Emory (Ali White '25, Elyse Markowski & Melanie DeCareau '26) in the UAA — five Arlington athletes. Confirmed: Emory hosts CMU Oct 3 (1:30 PM ET). All games free.",
    colleges: ["Carnegie Mellon", "Emory"],
    pairs: [
      { home: "Emory",          away: "Carnegie Mellon", date: "Oct 3", time: "1:30 PM ET", watch: "Free — emoryathletics.com", watchUrl: "https://emoryathletics.com/sports/womens-soccer" },
      { home: "Carnegie Mellon", away: "Emory",          date: "TBA",   time: "TBA",        watch: "Free — athletics.cmu.edu",  watchUrl: "https://athletics.cmu.edu/sports/womens-soccer" },
    ],
  },

  // ── 2024 class matchups ───────────────────────────────────────────────
  {
    id: "ivy-2024", division: "D1", conference: "Ivy League", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Dartmouth (Emily Garrard '24) joins Harvard and Penn in the Ivy League — confirmed: Harvard at Dartmouth Oct 10 (TBA), Penn at Dartmouth Sep 26 (3:00 PM). Games on ESPN+.",
    colleges: ["Dartmouth", "Harvard", "Pennsylvania"],
    pairs: [
      { home: "Dartmouth",    away: "Harvard",       date: "Oct 10", time: "TBA",       watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Dartmouth",    away: "Pennsylvania",  date: "Sep 26", time: "3:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Pennsylvania", away: "Harvard",       date: "Oct 31", time: "4:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "a10-2024", division: "D1", conference: "Atlantic 10", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Ava Milisits '24 transferred to Hampton (CAA). Duquesne, VCU, Davidson, and Richmond remain in the A-10 group — games on ESPN+.",
    colleges: ["Richmond", "Duquesne", "VCU", "Davidson"],
    pairs: [
      { home: "Richmond",  away: "Duquesne", date: "Sep 24", time: "5:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "VCU",       away: "Duquesne", date: "Sep 27", time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Richmond",  away: "VCU",      date: "Oct 22", time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Davidson",  away: "Richmond", date: "Oct 11", time: "1:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Davidson",  away: "Duquesne", date: "Oct 22", time: "7:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "big10-2024", division: "D1", conference: "Big Ten", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Maryland (Samantha Winer '24) joins USC (Ally Griswold '26) in the Big Ten. Confirmed: Maryland hosts Northwestern Oct 11 (TBA). Games on BTN or ESPN+.",
    colleges: ["Maryland", "USC"],
    pairs: [
      { home: "Maryland", away: "USC",      date: "TBA",    time: "TBA", watch: "BTN or ESPN+", watchUrl: "https://www.bigtennetwork.com" },
      { home: "USC",      away: "Maryland", date: "TBA",    time: "TBA", watch: "BTN or B1G+",  watchUrl: "https://b1gplus.com" },
    ],
  },
  {
    id: "centennial-2024", division: "D3", conference: "Centennial", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Kendall Frederick '24 (JHU), Anwen Reed '24 (Swarthmore), and Molly DeBrandt '24 (F&M) form a perfect round-robin — all three pairs confirmed in the 2026 Centennial schedule. All games stream free.",
    colleges: ["Johns Hopkins", "Swarthmore", "Franklin & Marshall"],
    pairs: [
      { home: "Swarthmore",          away: "Johns Hopkins",       date: "Sep 19", time: "1:00 PM ET",  watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/swarthmoreathletics" },
      { home: "Franklin & Marshall", away: "Swarthmore",          date: "Sep 26", time: "12:00 PM ET", watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/godiplomats" },
      { home: "Franklin & Marshall", away: "Johns Hopkins",       date: "Oct 17", time: "4:00 PM ET",  watch: "Free — centennialconference.tv", watchUrl: "https://centennialconference.tv/godiplomats" },
    ],
  },
  {
    id: "ncac-2024", division: "D3", conference: "NCAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Roam Redington '24 (Oberlin) and Kinzly Gootman & Abby Welker '24 (Case Western Reserve) deepen the NCAC / UAA cross-conference Ohio cluster. Confirmed: Denison hosts CWR Sep 26 (12:00 PM ET). All games free.",
    colleges: ["Oberlin College", "College of Wooster", "Denison"],
    pairs: [
      { home: "College of Wooster", away: "Oberlin College", date: "Oct 6",  time: "3:00 PM ET",  watch: "Free — northcoastnetwork.com", watchUrl: "https://northcoastnetwork.com/wooster/" },
      { home: "Oberlin College",    away: "College of Wooster", date: "Oct 31", time: "TBA",      watch: "Free — Oberlin Sports Network", watchUrl: "https://oberlinsportsnetwork.com" },
      { home: "Denison",            away: "Oberlin College",    date: "Oct 24", time: "11:30 AM ET", watch: "Free — North Coast Network", watchUrl: "https://northcoastnetwork.com/denison/" },
      { home: "Denison",            away: "College of Wooster", date: "Oct 17", time: "1:00 PM ET",  watch: "Free — North Coast Network", watchUrl: "https://northcoastnetwork.com/denison/" },
    ],
  },
  {
    id: "uaa-2024", division: "D3", conference: "UAA", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Kinzly Gootman & Abby Welker '24 (Case Western Reserve) join Emory and Carnegie Mellon in the UAA — confirmed: Emory hosts CWR Oct 31 (1:30 PM), CWR hosts CMU Nov 7 (3:30 PM). All free.",
    colleges: ["Case Western Reserve", "Carnegie Mellon", "Emory"],
    pairs: [
      { home: "Emory",              away: "Case Western Reserve", date: "Oct 31", time: "1:30 PM ET", watch: "Free — emoryathletics.com", watchUrl: "https://emoryathletics.com/sports/womens-soccer" },
      { home: "Case Western Reserve", away: "Emory",             date: "TBA",    time: "TBA",        watch: "Free — gospartans.com",     watchUrl: "https://gospartans.com/sports/womens-soccer" },
      { home: "Case Western Reserve", away: "Carnegie Mellon",   date: "Nov 7",  time: "3:30 PM ET", watch: "Free — athletics.case.edu", watchUrl: "https://athletics.case.edu/sports/womens-soccer" },
    ],
  },
  {
    id: "odac-2024", division: "D3", conference: "ODAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2024"],
    description: "Ava Hecker & Emily Burke '23 at Washington & Lee expand the ODAC group alongside Quincy Greene '25 — confirmed Oct 17 vs Batten, Sep 26 at Randolph, Sep 12 at CNU. All games stream free on FloCollege.",
    colleges: ["Washington & Lee", "Christopher Newport", "Batten University", "Randolph College"],
    pairs: [
      { home: "Christopher Newport", away: "Washington & Lee", date: "Sep 12", time: "12:00 PM ET", watch: "Free — cnusports.com",  watchUrl: "https://cnusports.com/sports/womens-soccer" },
      { home: "Randolph College",    away: "Washington & Lee", date: "Sep 26", time: "1:00 PM ET",  watch: "Free — FloCollege",     watchUrl: "https://flosports.tv/flocollege" },
      { home: "Washington & Lee",    away: "Batten University", date: "Oct 17", time: "3:00 PM ET", watch: "Free — FloCollege",     watchUrl: "https://flosports.tv/flocollege" },
      { home: "Batten University",   away: "Randolph College",  date: "Sep 30", time: "6:00 PM ET", watch: "Free — FloCollege",     watchUrl: "https://flosports.tv/flocollege" },
    ],
  },

  // ── 2023 class matchups ───────────────────────────────────────────────
  {
    id: "big10-2023", division: "D1", conference: "Big Ten", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2023"],
    description: "Phoebe Carver '23 (Purdue) and CJ Roy '23 (Northwestern) join Samantha Winer '24 (Maryland) and Ally Griswold '26 (USC) in the Big Ten. Confirmed: NU hosts USC Oct 17, Purdue at NU Oct 25 (5:00 PM). Games on BTN or ESPN+.",
    colleges: ["Purdue", "Northwestern", "Maryland", "USC"],
    pairs: [
      { home: "Northwestern", away: "USC",      date: "Oct 17", time: "3:00 PM ET", watch: "BTN or B1G+",  watchUrl: "https://b1gplus.com" },
      { home: "Northwestern", away: "Purdue",   date: "Oct 25", time: "5:00 PM ET", watch: "BTN or ESPN+", watchUrl: "https://www.bigtennetwork.com" },
      { home: "Maryland",     away: "Northwestern", date: "Oct 11", time: "TBA",    watch: "BTN or ESPN+", watchUrl: "https://www.bigtennetwork.com" },
      { home: "USC",          away: "Purdue",   date: "Sep 13", time: "4:00 PM ET", watch: "BTN or B1G+",  watchUrl: "https://b1gplus.com" },
      { home: "Purdue",       away: "Northwestern", date: "Oct 25", time: "5:00 PM ET", watch: "BTN or ESPN+", watchUrl: "https://www.bigtennetwork.com" },
    ],
  },
  {
    id: "metro-2023", division: "D1", conference: "Metro", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2023"],
    description: "Talia Omer '23 (Manhattan) joins Scarlett Smith '25 and Rylee Jarman '26 in the Metro Conference — three Arlington athletes across three graduating classes. Confirmed: Iona at Manhattan Nov 4 (3:00 PM). Games on ESPN+.",
    colleges: ["Manhattan College", "Iona"],
    pairs: [
      { home: "Manhattan College", away: "Iona", date: "Nov 4", time: "3:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Iona", away: "Manhattan College", date: "TBA",   time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "patriot-2023", division: "D1", conference: "Patriot League", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2023"],
    description: "Talia Agrillo '23 (Boston University) joins Sanai Bayna '25 (American) and Ella Pomaranski & Sofia Bollman '26 (Lehigh) in the Patriot League. Confirmed: Lehigh at BU Oct 31 (1:00 PM), Lehigh hosts American Oct 4 (1:00 PM). Games on ESPN+.",
    colleges: ["Boston University", "American University", "Lehigh"],
    pairs: [
      { home: "Lehigh",              away: "American University", date: "Oct 4",  time: "1:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Boston University",   away: "Lehigh",             date: "Oct 31", time: "1:00 PM ET", watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "Boston University",   away: "American University", date: "TBA",   time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { home: "American University", away: "Lehigh",             date: "TBA",    time: "TBA",        watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
    ],
  },
  {
    id: "nescac-2023", division: "D3", conference: "NESCAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2023"],
    description: "Cadence Lee & Olivia Becker '23 (Bowdoin/Bates), Kate Leland '24 (Bates), Emily McBride '24 (Connecticut College), Jackie Shores '24 (Bowdoin), and Madeleine Brown '26 (Williams) form a NESCAC cluster. All games stream free.",
    colleges: ["Bowdoin", "Bates College", "Connecticut College", "Williams College"],
    pairs: [
      { home: "Bates College",       away: "Bowdoin",           date: "Sep 29", time: "7:00 PM ET",  watch: "Free — nsnsports.net/colleges/bates", watchUrl: "https://www.nsnsports.net/colleges/bates/" },
      { home: "Bates College",       away: "Williams College",  date: "Sep 5",  time: "10:00 AM ET", watch: "Free — nsnsports.net/colleges/bates", watchUrl: "https://www.nsnsports.net/colleges/bates/" },
      { home: "Bowdoin",             away: "Bates College",     date: "Sep 29", time: "7:00 PM ET",  watch: "Free — athletics.bowdoin.edu",         watchUrl: "https://athletics.bowdoin.edu/sports/womens-soccer" },
      { home: "Bowdoin",             away: "Williams College",  date: "Sep 20", time: "2:00 PM ET",  watch: "Free — athletics.bowdoin.edu",         watchUrl: "https://athletics.bowdoin.edu/sports/womens-soccer" },
      { home: "Connecticut College", away: "Bates College",     date: "Oct 10", time: "11:00 AM ET", watch: "Free — nsnsports.net/colleges/connecticut-college", watchUrl: "https://www.nsnsports.net/colleges/connecticut-college/" },
      { home: "Connecticut College", away: "Bowdoin",           date: "Oct 24", time: "11:00 AM ET", watch: "Free — nsnsports.net/colleges/connecticut-college", watchUrl: "https://www.nsnsports.net/colleges/connecticut-college/" },
      { home: "Williams College",    away: "Connecticut College", date: "Oct 3", time: "TBA",        watch: "Free — nsnsports.net/colleges/williams-college", watchUrl: "https://www.nsnsports.net/colleges/williams-college/" },
    ],
  },
  {
    id: "ncac-2023", division: "D3", conference: "NCAC", tag: "✦ Cross-Class Rivals", confirmed: true,
    requires: ["2023"],
    description: "Mia Stoller '23 (Wooster) expands the NCAC group joining Frances Shapiro '25 (Denison), Natalie Horak & Roam Redington '24 (Oberlin), and Sadie Smith '26 (Wooster). All games free.",
    colleges: ["College of Wooster", "Oberlin College", "Denison"],
    pairs: [
      { home: "College of Wooster", away: "Oberlin College",    date: "Oct 6",  time: "3:00 PM ET",  watch: "Free — northcoastnetwork.com", watchUrl: "https://northcoastnetwork.com/wooster/" },
      { home: "Denison",            away: "College of Wooster", date: "Oct 17", time: "1:00 PM ET",  watch: "Free — North Coast Network",   watchUrl: "https://northcoastnetwork.com/denison/" },
      { home: "Denison",            away: "Oberlin College",    date: "Oct 24", time: "11:30 AM ET", watch: "Free — North Coast Network",   watchUrl: "https://northcoastnetwork.com/denison/" },
    ],
  },
];

function getActiveMatchups(activeYears, activePlayers) {
  const activeColleges = new Set(activePlayers.map(p => p.college));
  return ALL_MATCHUPS.filter(m => {
    if (m.requires && m.requires.length > 0 && !m.requires.every(y => activeYears.has(y))) return false;
    return m.colleges.filter(c => activeColleges.has(c)).length >= 2;
  });
}

function getArlingtonRivals(college, activeYears, activePlayers) {
  const rivals = new Set();
  getActiveMatchups(activeYears, activePlayers).forEach(m => {
    if (m.confirmed && m.colleges.includes(college))
      m.colleges.forEach(c => { if (c !== college) rivals.add(c); });
  });
  return rivals;
}

const SCHEDULES = {
  "USC": {
    fullName: "USC Trojans", location: "Los Angeles, CA", stadium: "Rawlinson Stadium",
    sourceUrl: "https://usctrojans.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 7-7-3 (4-5-2 Big Ten, 10th) · Lost Big Ten Tournament R1 to Washington",
    notes: "Schedule announced May 19, 2026. 12 of 18 opponents made 2025 NCAA Tournament including Stanford and Duke (College Cup teams). B1G+ $9.95/mo.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at San Diego State (Exh.)", type: "Exhibition", time: "10:00 PM ET", home: false, watch: "B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Aug 12", day: "Wed", opponent: "Duke", type: "Non-Conference", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Aug 16", day: "Sun", opponent: "at Pepperdine", type: "Non-Conference", time: "TBA", home: false, watch: "B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Aug 22", day: "Sat", opponent: "at BYU", type: "Non-Conference", time: "TBA", home: false, watch: "ESPN+", watchUrl: "https://www.espnplus.com" },
      { date: "Aug 27", day: "Thu", opponent: "New Mexico State", type: "Non-Conference", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Aug 30", day: "Sun", opponent: "Saint Mary's", type: "Non-Conference", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Sep 3",  day: "Thu", opponent: "at Stanford", type: "Non-Conference", time: "TBA", home: false, watch: "B1G+", watchUrl: "https://b1gplus.com" },
      { date: "Sep 10", day: "Thu", opponent: "Michigan State", type: "Big Ten", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Sep 13", day: "Sun", opponent: "Purdue ⚡", type: "Big Ten", time: "4:00 PM ET", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com", arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "Oregon", type: "Big Ten", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Sep 24", day: "Thu", opponent: "at Ohio State", type: "Big Ten", time: "TBA", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Sep 27", day: "Sun", opponent: "at Penn State", type: "Big Ten", time: "TBA", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 4",  day: "Sun", opponent: "at Washington", type: "Big Ten", time: "TBA", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 8",  day: "Thu", opponent: "Illinois", type: "Big Ten", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 11", day: "Sun", opponent: "Indiana", type: "Big Ten", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 17", day: "Sat", opponent: "at Northwestern ⚡", type: "Big Ten", time: "3:00 PM ET", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com", arlington: true },
      { date: "Oct 22", day: "Thu", opponent: "at Nebraska", type: "Big Ten", time: "TBA", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 25", day: "Sun", opponent: "at Iowa", type: "Big Ten", time: "TBA", home: false, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
      { date: "Oct 30", day: "Fri", opponent: "UCLA", type: "Big Ten", time: "TBA", home: true, watch: "BTN or B1G+", watchUrl: "https://www.bigtennetwork.com" },
    ]
  },
  "Duquesne": {
    fullName: "Duquesne Dukes", location: "Pittsburgh, PA", stadium: "Rooney Field",
    sourceUrl: "https://goduquesne.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 12-5-1 (7-3 A-10, 3rd place) · Hosted A-10 Tournament QF vs. Fordham · Record-setting season: most goals (43) and points (108) in program history",
    games: [
      { date: "Aug 12", day: "Wed", opponent: "at Eastern Michigan", type: "Non-Conference", time: "4:30 PM ET", home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Cleveland State", type: "Non-Conference", time: "7:00 PM ET", home: false },
      { date: "Aug 23", day: "Sun", opponent: "at West Virginia", type: "Non-Conference", time: "1:00 PM ET", home: false },
      { date: "Aug 27", day: "Thu", opponent: "Akron", type: "Non-Conference", time: "7:00 PM ET", home: true },
      { date: "Aug 30", day: "Sun", opponent: "Kent State", type: "Non-Conference", time: "1:00 PM ET", home: true },
      { date: "Sep 3",  day: "Thu", opponent: "Toledo", type: "Non-Conference", time: "1:00 PM ET", home: true },
      { date: "Sep 10", day: "Thu", opponent: "at Youngstown State", type: "Non-Conference", time: "6:00 PM ET", home: false },
      { date: "Sep 13", day: "Sun", opponent: "Ohio (Senior Day)", type: "Non-Conference", time: "1:00 PM ET", home: true },
      { date: "Sep 19", day: "Sat", opponent: "Rhode Island", type: "Atlantic 10", time: "4:00 PM ET", home: true },
      { date: "Sep 24", day: "Thu", opponent: "at Richmond ⚡", type: "Atlantic 10", time: "5:00 PM ET", home: false, arlington: true },
      { date: "Sep 27", day: "Sun", opponent: "at VCU ⚡", type: "Atlantic 10", time: "TBA", home: false, arlington: true },
      { date: "Oct 4",  day: "Sun", opponent: "George Washington", type: "Atlantic 10", time: "1:00 PM ET", home: true },
      { date: "Oct 8",  day: "Thu", opponent: "Dayton", type: "Atlantic 10", time: "7:00 PM ET", home: true },
      { date: "Oct 11", day: "Sun", opponent: "at George Mason", type: "Atlantic 10", time: "1:00 PM ET", home: false },
      { date: "Oct 18", day: "Sun", opponent: "at Loyola Chicago", type: "Atlantic 10", time: "2:00 PM ET", home: false },
      { date: "Oct 22", day: "Thu", opponent: "Davidson", type: "Atlantic 10", time: "7:00 PM ET", home: true },
      { date: "Oct 25", day: "Sun", opponent: "Saint Louis", type: "Atlantic 10", time: "1:00 PM ET", home: true },
      { date: "Oct 31", day: "Sat", opponent: "at La Salle", type: "Atlantic 10", time: "TBA", home: false },
    ]
  },
  "VCU": {
    fullName: "VCU Rams", location: "Richmond, VA", stadium: "Sports Backers Stadium",
    sourceUrl: "https://vcuathletics.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 7-10-3 (5-4-1 A-10) · Lost A-10 Tournament QF to Rhode Island 1-2",
    notes: "Schedule announced June 6, 2026. Features 4 teams from 2025 NCAA Tournament including semifinalist Duke.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "at Elon", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 16", day: "Sun", opponent: "NC State", type: "Non-Conference", time: "TBA", home: true },
      { date: "Aug 20", day: "Thu", opponent: "at Delaware", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 23", day: "Sun", opponent: "Liberty", type: "Non-Conference", time: "TBA", home: true },
      { date: "Aug 27", day: "Thu", opponent: "at UNCW", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 30", day: "Sun", opponent: "at Duke", type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at William & Mary", type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 10", day: "Thu", opponent: "at East Carolina", type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Saint Louis", type: "Atlantic 10", time: "TBA", home: false },
      { date: "Sep 24", day: "Thu", opponent: "St. Bonaventure", type: "Atlantic 10", time: "TBA", home: true },
      { date: "Sep 27", day: "Sun", opponent: "Duquesne ⚡", type: "Atlantic 10", time: "TBA", home: true, arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "at Saint Joseph's", type: "Atlantic 10", time: "TBA", home: false },
      { date: "Oct 8",  day: "Thu", opponent: "at Fordham", type: "Atlantic 10", time: "TBA", home: false },
      { date: "Oct 11", day: "Sun", opponent: "La Salle", type: "Atlantic 10", time: "TBA", home: true },
      { date: "Oct 17", day: "Sat", opponent: "George Washington", type: "Atlantic 10", time: "TBA", home: true },
      { date: "Oct 22", day: "Thu", opponent: "at Richmond ⚡", type: "Atlantic 10", time: "TBA", home: false, arlington: true },
      { date: "Oct 25", day: "Sun", opponent: "Loyola Chicago", type: "Atlantic 10", time: "TBA", home: true },
      { date: "Oct 31", day: "Sat", opponent: "at Dayton", type: "Atlantic 10", time: "TBA", home: false },
    ]
  },
  "Richmond": {
    fullName: "Richmond Spiders", location: "Richmond, VA", stadium: "President's Field at River Road",
    sourceUrl: "https://richmondspiders.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 4-7-7 (1-5-4 A-10) · Did not qualify for A-10 Tournament",
    notes: "Schedule announced July 9, 2026. Stadium upgraded from Robins Stadium to President's Field at River Road.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "ETSU (Exh.)", type: "Exhibition", time: "5:00 PM ET", home: true },
      { date: "Aug 9",  day: "Sun", opponent: "at ECU (Exh.)", type: "Exhibition", time: "7:00 PM ET", home: false },
      { date: "Aug 16", day: "Sun", opponent: "Wofford", type: "Non-Conference", time: "2:00 PM ET", home: true },
      { date: "Aug 20", day: "Thu", opponent: "American ⚡", type: "Non-Conference", time: "5:00 PM ET", home: true, arlington: true },
      { date: "Aug 23", day: "Sun", opponent: "Queens (N.C.)", type: "Non-Conference", time: "2:00 PM ET", home: true },
      { date: "Aug 30", day: "Sun", opponent: "at Mount St. Mary's", type: "Non-Conference", time: "2:00 PM ET", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "North Central College", type: "Non-Conference", time: "5:00 PM ET", home: true },
      { date: "Sep 6",  day: "Sun", opponent: "at Radford", type: "Non-Conference", time: "2:00 PM ET", home: false },
      { date: "Sep 10", day: "Thu", opponent: "at VMI ⚡", type: "Non-Conference", time: "4:00 PM ET", home: false, arlington: true },
      { date: "Sep 13", day: "Sun", opponent: "Howard ⚡", type: "Non-Conference", time: "3:00 PM ET", home: true, arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at George Washington", type: "Atlantic 10", time: "TBA", home: false },
      { date: "Sep 24", day: "Thu", opponent: "Duquesne ⚡", type: "Atlantic 10", time: "5:00 PM ET", home: true, arlington: true },
      { date: "Sep 27", day: "Sun", opponent: "St. Bonaventure", type: "Atlantic 10", time: "2:00 PM ET", home: true },
      { date: "Oct 3",  day: "Sat", opponent: "at George Mason", type: "Atlantic 10", time: "4:00 PM ET", home: false },
      { date: "Oct 8",  day: "Thu", opponent: "at La Salle", type: "Atlantic 10", time: "6:00 PM ET", home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Davidson ⚡", type: "Atlantic 10", time: "2:00 PM ET", home: false, arlington: true },
      { date: "Oct 17", day: "Sat", opponent: "at Saint Louis", type: "Atlantic 10", time: "2:00 PM ET", home: false },
      { date: "Oct 22", day: "Thu", opponent: "VCU ⚡", type: "Atlantic 10", time: "5:00 PM ET", home: true, arlington: true },
      { date: "Oct 25", day: "Sun", opponent: "at Rhode Island", type: "Atlantic 10", time: "1:00 PM ET", home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Fordham", type: "Atlantic 10", time: "1:30 PM ET", home: true },
    ]
  },
  "Towson": {
    fullName: "Towson Tigers", location: "Towson, MD", stadium: "Tiger Field",
    sourceUrl: "https://towsontigers.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 3-3-3 (CAA North) · Missed CAA Tournament on tiebreaker vs. Hofstra",
    notes: "All home games free admission at Tiger Field. CAA North Division — does not play Campbell in 2026.",
    games: [
      { date: "Aug 6",  day: "Wed", opponent: "Montgomery College (Exh.)", type: "Exhibition", time: "6:00 PM ET", home: true },
      { date: "Aug 9",  day: "Sun", opponent: "Howard (Exh.)", type: "Exhibition", time: "6:00 PM ET", home: true },
      { date: "Aug 16", day: "Sun", opponent: "at Mount St. Mary's", type: "Non-Conference", time: "6:00 PM ET", home: false },
      { date: "Aug 20", day: "Thu", opponent: "TBA", type: "Non-Conference", time: "4:00 PM ET", home: false },
      { date: "Aug 23", day: "Sun", opponent: "George Washington", type: "Non-Conference", time: "6:00 PM ET", home: true },
      { date: "Aug 27", day: "Thu", opponent: "TBA", type: "Non-Conference", time: "6:00 PM ET", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "TBA", type: "Non-Conference", time: "7:00 PM ET", home: false },
      { date: "Sep 6",  day: "Sun", opponent: "Bucknell", type: "Non-Conference", time: "1:00 PM ET", home: true },
      { date: "Sep 10", day: "Thu", opponent: "Navy", type: "Non-Conference", time: "6:00 PM ET", home: true },
      { date: "Sep 13", day: "Sun", opponent: "Penn", type: "Non-Conference", time: "1:00 PM ET", home: true },
      { date: "Sep 20", day: "Sun", opponent: "at Hofstra", type: "CAA", time: "1:00 PM ET", home: false },
      { date: "Sep 24", day: "Thu", opponent: "at William & Mary", type: "CAA", time: "7:00 PM ET", home: false },
      { date: "Sep 27", day: "Sun", opponent: "at Hampton", type: "CAA", time: "1:00 PM ET", home: false },
      { date: "Oct 4",  day: "Sun", opponent: "Stony Brook", type: "CAA", time: "1:00 PM ET", home: true },
      { date: "Oct 8",  day: "Thu", opponent: "UNCW", type: "CAA", time: "6:00 PM ET", home: true },
      { date: "Oct 11", day: "Sun", opponent: "Charleston", type: "CAA", time: "1:00 PM ET", home: true },
      { date: "Oct 17", day: "Sat", opponent: "Northeastern", type: "CAA", time: "3:00 PM ET", home: true },
      { date: "Oct 25", day: "Sun", opponent: "at Monmouth", type: "CAA", time: "1:00 PM ET", home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Drexel", type: "CAA", time: "1:00 PM ET", home: true },
    ]
  },
  "Campbell": {
    fullName: "Campbell Camels", location: "Buies Creek, NC", stadium: "Campbell Soccer Complex",
    sourceUrl: "https://gocamels.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 4-7-5 (2-3-1 CAA South) · Did not qualify for CAA Tournament",
    notes: "CAA South Division. Confirmed cross-div opponents: Hofstra, Stony Brook, Monmouth & Northeastern. Towson not on schedule in 2026.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "at Longwood", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 20", day: "Thu", opponent: "at East Carolina", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 23", day: "Sun", opponent: "at Clemson", type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 27", day: "Thu", opponent: "Charleston Southern", type: "Non-Conference", time: "TBA", home: true },
      { date: "Aug 28", day: "Fri", opponent: "App State", type: "Non-Conference", time: "TBA", home: true },
      { date: "Aug 30", day: "Sun", opponent: "at Coastal Carolina", type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Queens", type: "Non-Conference", time: "TBA", home: true },
      { date: "Sep 6",  day: "Sun", opponent: "NC State", type: "Non-Conference", time: "TBA", home: true },
      { date: "Sep 10", day: "Thu", opponent: "UNCG", type: "Non-Conference", time: "TBA", home: true },
      { date: "Sep 20", day: "Sun", opponent: "at Elon", type: "CAA", time: "TBA", home: false },
      { date: "Sep 24", day: "Thu", opponent: "Hofstra", type: "CAA", time: "TBA", home: true },
      { date: "Sep 27", day: "Sun", opponent: "Stony Brook", type: "CAA", time: "TBA", home: true },
      { date: "Oct 2",  day: "Fri", opponent: "at William & Mary", type: "CAA", time: "TBA", home: false },
      { date: "Oct 8",  day: "Thu", opponent: "at Monmouth", type: "CAA", time: "TBA", home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Northeastern", type: "CAA", time: "TBA", home: false },
      { date: "Oct 18", day: "Sun", opponent: "Hampton ⚡",             type: "CAA",            time: "2:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 25", day: "Sun", opponent: "Charleston", type: "CAA", time: "TBA", home: true },
      { date: "Nov 8",  day: "Sun", opponent: "at UNCW", type: "CAA", time: "TBA", home: false },
    ]
  },
  "Lehigh": {
    fullName: "Lehigh Mountain Hawks", location: "Bethlehem, PA", stadium: "Ulrich Sports Complex",
    sourceUrl: "https://lehighsports.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 3-11-3 (1-7-1 Patriot League) · Did not qualify for Patriot League Tournament",
    notes: "Home games at Ulrich Sports Complex, Bethlehem PA. Patriot League games on ESPN+.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "at Binghamton",          type: "Non-Conference",      time: "6:00 PM ET",  home: false },
      { date: "Aug 16", day: "Sun", opponent: "Villanova",              type: "Non-Conference",      time: "3:00 PM ET",  home: true  },
      { date: "Aug 23", day: "Sun", opponent: "NJIT",                   type: "Non-Conference",      time: "1:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "at Drexel",              type: "Non-Conference",      time: "6:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at Stony Brook",         type: "Non-Conference",      time: "1:00 PM ET",  home: false },
      { date: "Sep 10", day: "Thu", opponent: "La Salle",               type: "Non-Conference",      time: "6:00 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "Princeton",              type: "Non-Conference",      time: "1:00 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at Bucknell",            type: "Patriot League",      time: "1:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Army",                type: "Patriot League",      time: "1:00 PM ET",  home: false },
      { date: "Sep 30", day: "Wed", opponent: "Navy",                   type: "Patriot League",      time: "6:00 PM ET",  home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "American University ⚡", type: "Patriot League",      time: "1:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "at Loyola",              type: "Patriot League",      time: "1:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "Holy Cross",             type: "Patriot League",      time: "1:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Colgate",             type: "Patriot League",      time: "1:00 PM ET",  home: false },
      { date: "Oct 31", day: "Sat", opponent: "at Boston University ⚡", type: "Patriot League",     time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Nov 4",  day: "Wed", opponent: "Lafayette",              type: "Patriot League",      time: "6:00 PM ET",  home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "Patriot League QF",      type: "Patriot Tournament",  time: "TBD",      home: false },
      { date: "Nov 11", day: "Wed", opponent: "Patriot League SF",      type: "Patriot Tournament",  time: "TBD",      home: false },
      { date: "Nov 15", day: "Sun", opponent: "Patriot League Final",   type: "Patriot Tournament",  time: "TBD",      home: false },
    ]
  },
  "Emory": {
    fullName: "Emory Eagles", location: "Atlanta, GA", stadium: "Woodruff PE Center Stadium",
    sourceUrl: "https://emoryathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 21-1-1 · NCAA D3 National Runner-Up (lost to Williams 1-2)",
    notes: "Home games at Woodruff PE Center Stadium, Atlanta. All games stream free on emoryathletics.com.",
    games: [
      { date: "Sep 4",  day: "Fri", opponent: "at Transylvania",          type: "Non-Conference", time: "7:30 PM ET",        home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at Centre",                type: "Non-Conference", time: "12:00 PM ET",       home: false },
      { date: "Sep 12", day: "Sat", opponent: "at Babson",                type: "Non-Conference", time: "11:00 AM ET",       home: false },
      { date: "Sep 13", day: "Sun", opponent: "at Emerson",               type: "Non-Conference", time: "1:00 PM ET",        home: false },
      { date: "Sep 16", day: "Wed", opponent: "at Berry",                 type: "Non-Conference", time: "6:00 PM ET",        home: false },
      { date: "Sep 18", day: "Fri", opponent: "Christopher Newport ⚡",   type: "Non-Conference", time: "7:00 PM ET",        home: true, arlington: true },
      { date: "Sep 22", day: "Tue", opponent: "Sewanee",                  type: "Non-Conference", time: "7:00 PM ET",        home: true  },
      { date: "Sep 25", day: "Fri", opponent: "at Oglethorpe",            type: "Non-Conference", time: "7:30 PM ET",        home: false },
      { date: "Sep 27", day: "Sun", opponent: "Lynchburg",                type: "Non-Conference", time: "1:00 PM ET",        home: false, neutral: "Charlotte Soccer Academy, Charlotte NC" },
      { date: "Oct 3",  day: "Sat", opponent: "Carnegie Mellon ⚡",       type: "UAA",            time: "1:30 PM ET",        home: true, arlington: true },
      { date: "Oct 6",  day: "Tue", opponent: "at Covenant",              type: "Non-Conference", time: "6:00 PM ET",        home: false },
      { date: "Oct 10", day: "Sat", opponent: "Brandeis",                 type: "UAA",            time: "1:30 PM ET",        home: true  },
      { date: "Oct 12", day: "Mon", opponent: "Colby",                    type: "Non-Conference", time: "12:00 PM ET",       home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at NYU",                   type: "UAA",            time: "1:30 PM ET",        home: false, neutral: "Montclair State University, Montclair NJ" },
      { date: "Oct 23", day: "Fri", opponent: "at UChicago",              type: "UAA",            time: "8:30 PM ET",     home: false },
      { date: "Oct 25", day: "Sun", opponent: "at WashU",                 type: "UAA",            time: "2:30 PM ET",     home: false },
      { date: "Oct 31", day: "Sat", opponent: "Case Western Reserve ⚡",  type: "UAA",            time: "1:30 PM ET",        home: true, arlington: true },
      { date: "Nov 7",  day: "Sat", opponent: "Rochester",                type: "UAA",            time: "1:30 PM ET",        home: true  },
    ]
  },
  "Batten University": {
    fullName: "Batten University Marlins", location: "Virginia Beach, VA", stadium: "Foster Field at Tassos Paphites Soccer Complex",
    sourceUrl: "https://battenathletics.com/sports/wsoc/schedule", status: "confirmed",
    record2025: "2025: 15-4-3 · NCAA D3 Tournament",
    notes: "⚠️ Virginia Wesleyan rebranded to Batten University for 2026. Home games at Foster Field (Tassos Paphites Soccer Complex), Virginia Beach VA. All home games on FloCollege. Oct 4 vs Bowdoin played in Arlington, VA.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "Regent University",         type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 4",  day: "Fri", opponent: "Chapman University",        type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Hardin-Simmons",            type: "Non-Conference", time: "11:00 AM ET", home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Stockton University",       type: "Non-Conference", time: "12:00 PM ET", home: true  },
      { date: "Sep 16", day: "Wed", opponent: "Salisbury University",      type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at Mary Washington",        type: "Non-Conference", time: "2:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Shenandoah",             type: "ODAC",           time: "6:00 PM ET",  home: false },
      { date: "Sep 30", day: "Wed", opponent: "Randolph College ⚡",       type: "ODAC",           time: "6:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "Guilford College",          type: "ODAC",           time: "11:00 AM ET", home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "Bowdoin ⚡",               type: "Non-Conference", time: "3:00 PM ET",  home: false, neutral: "Arlington, VA", arlington: true },
      { date: "Oct 7",  day: "Wed", opponent: "at Bridgewater College",   type: "ODAC",           time: "4:00 PM ET",  home: false },
      { date: "Oct 10", day: "Sat", opponent: "Roanoke College",          type: "ODAC",           time: "5:00 PM ET",  home: true  },
      { date: "Oct 14", day: "Wed", opponent: "at Randolph-Macon",        type: "ODAC",           time: "4:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "at Washington & Lee ⚡",   type: "ODAC",           time: "4:00 PM ET",  home: false, arlington: true },
      { date: "Oct 21", day: "Wed", opponent: "Eastern Mennonite",        type: "ODAC",           time: "5:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Averett University",    type: "ODAC",           time: "1:00 PM ET",  home: false },
      { date: "Oct 27", day: "Tue", opponent: "University of Lynchburg",  type: "ODAC",           time: "6:00 PM ET",  home: true  },
    ]
  },
  "Randolph College": {
    fullName: "Randolph Wildcats", location: "Lynchburg, VA", stadium: "WildCat Stadium",
    sourceUrl: "https://randolphwildcats.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, ODAC",
    notes: "Home games at WildCat Stadium. Home ODAC games on FloCollege. VWU is now officially Batten University.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "Meredith College",        type: "Non-Conference", time: "6:00 PM ET", home: true  },
      { date: "Sep 4",  day: "Fri", opponent: "Pfeiffer University",      type: "Non-Conference", time: "5:00 PM ET", home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "NC Wesleyan",              type: "Non-Conference", time: "5:00 PM ET", home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at William Peace",         type: "Non-Conference", time: "TBA",     home: false },
      { date: "Sep 16", day: "Wed", opponent: "at Salem College",         type: "Non-Conference", time: "4:00 PM ET", home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Carolina University",   type: "Non-Conference", time: "6:00 PM ET", home: false },
      { date: "Sep 23", day: "Wed", opponent: "at Averett",               type: "ODAC",           time: "7:00 PM ET", home: false },
      { date: "Sep 26", day: "Sat", opponent: "Washington & Lee ⚡",      type: "ODAC",           time: "1:00 PM ET", home: true,  arlington: true },
      { date: "Sep 30", day: "Wed", opponent: "at Batten University ⚡",  type: "ODAC",           time: "6:00 PM ET", home: false, arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "Hollins University",       type: "ODAC",           time: "1:00 PM ET", home: true  },
      { date: "Oct 7",  day: "Wed", opponent: "Roanoke College",          type: "ODAC",           time: "7:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Eastern Mennonite",     type: "ODAC",           time: "7:00 PM ET", home: false },
      { date: "Oct 14", day: "Wed", opponent: "University of Lynchburg",  type: "ODAC",           time: "7:00 PM ET", home: true  },
      { date: "Oct 16", day: "Fri", opponent: "at Shenandoah",            type: "ODAC",           time: "6:00 PM ET", home: false },
      { date: "Oct 21", day: "Wed", opponent: "at Sweet Briar",           type: "ODAC",           time: "4:00 PM ET", home: false },
      { date: "Oct 28", day: "Wed", opponent: "Randolph-Macon",           type: "ODAC",           time: "6:00 PM ET", home: true  },
    ]
  },
  "Marymount University": {
    fullName: "Marymount Saints", location: "Arlington, VA", stadium: "Long Bridge Park",
    sourceUrl: "https://marymountsaints.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, Atlantic East Conference (AEC) · Home games in Arlington, VA!",
    notes: "Home games at Long Bridge Park, Arlington VA — literally in Arlington! AEC games stream free on Atlantic East Network (atlanticeastnetwork.com/marymount). ⚠️ Conference corrected to AEC (not CAC).",
    games: [
      { date: "Sep 2",  day: "Wed", opponent: "at Shenandoah",             type: "Non-Conference",     time: "4:00 PM ET", home: false },
      { date: "Sep 5",  day: "Sat", opponent: "at Washington College",     type: "Non-Conference",     time: "7:00 PM ET", home: false },
      { date: "Sep 9",  day: "Wed", opponent: "at Notre Dame of Maryland", type: "Non-Conference",     time: "2:30 PM ET", home: false },
      { date: "Sep 12", day: "Sat", opponent: "at Bridgewater College",    type: "Non-Conference",     time: "1:00 PM ET", home: false },
      { date: "Sep 15", day: "Tue", opponent: "Hood College",              type: "Non-Conference",     time: "6:00 PM ET", home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at University of Lynchburg", type: "Non-Conference",   time: "5:00 PM ET", home: false },
      { date: "Sep 23", day: "Wed", opponent: "at Christopher Newport ⚡", type: "Non-Conference",     time: "5:00 PM ET", home: false, arlington: true },
      { date: "Sep 26", day: "Sat", opponent: "Delaware Valley University", type: "Non-Conference",   time: "1:00 PM ET", home: true  },
      { date: "Sep 30", day: "Wed", opponent: "Goucher College",           type: "Non-Conference",     time: "4:00 PM ET", home: true  },
      { date: "Oct 2",  day: "Fri", opponent: "at Mary Washington",        type: "Non-Conference",     time: "4:00 PM ET", home: false },
      { date: "Oct 3",  day: "Sat", opponent: "Saint Elizabeth University", type: "AEC",              time: "1:00 PM ET", home: true  },
      { date: "Oct 7",  day: "Wed", opponent: "Immaculata University",     type: "AEC",               time: "5:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Pratt Institute",        type: "AEC",               time: "TBA",     home: false },
      { date: "Oct 14", day: "Wed", opponent: "Gwynedd Mercy University",  type: "AEC",               time: "5:00 PM ET", home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Centenary University (NJ)", type: "AEC",               time: "1:00 PM ET", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Saint Elizabeth",        type: "AEC",               time: "TBA",     home: false },
      { date: "Oct 28", day: "Wed", opponent: "at Immaculata University",  type: "AEC",               time: "6:00 PM ET", home: false },
      { date: "Oct 31", day: "Sat", opponent: "AEC First Round",           type: "AEC Tournament",    time: "TBA",     home: false },
      { date: "Nov 3",  day: "Tue", opponent: "AEC Semifinals",            type: "AEC Tournament",    time: "TBA",     home: false },
      { date: "Nov 7",  day: "Sat", opponent: "AEC Championship",          type: "AEC Tournament",    time: "TBA",     home: false },
    ]
  },
  "Williams College": {
    fullName: "Williams Ephs", location: "Williamstown, MA", stadium: "Cole Field",
    sourceUrl: "https://ephsports.williams.edu/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 13-2-5 (7-1-2 NESCAC) · NCAA D3 National Champions · Defeated Emory 2-1 in the final",
    notes: "Home games at Cole Field. Opens with 3 straight NESCAC games. All games stream free via NSN (nsnsports.net/colleges/williams-college).",
    games: [
      { date: "Sep 5",  day: "Sat", opponent: "Bates ⚡",              type: "NESCAC",          time: "10:00 AM ET", home: true,  arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at Bowdoin ⚡",         type: "NESCAC",          time: "2:00 PM ET",  home: false, arlington: true },
      { date: "Sep 26", day: "Sat", opponent: "Amherst",               type: "NESCAC",          time: "1:00 PM ET",  home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "Connecticut College ⚡", type: "NESCAC",          time: "TBA",      home: true,  arlington: true },
      { date: "Oct 17", day: "Sat", opponent: "at Wesleyan",           type: "NESCAC",          time: "12:00 PM ET", home: false },
      { date: "Oct 24", day: "Sat", opponent: "Tufts",                 type: "NESCAC",          time: "12:30 PM ET", home: true  },
      { date: "Oct 31", day: "Sat", opponent: "NESCAC QF",             type: "NESCAC Tournament", time: "TBA",    home: true  },
      { date: "Nov 7",  day: "Sat", opponent: "NESCAC SF",             type: "NESCAC Tournament", time: "TBA",    home: false },
      { date: "Nov 8",  day: "Sun", opponent: "NESCAC Final",          type: "NESCAC Tournament", time: "TBA",    home: false },
    ]
  },
  "Oberlin College": {
    fullName: "Oberlin Yeowomen", location: "Oberlin, OH", stadium: "Kahn Track & Shults Field",
    sourceUrl: "https://goyeo.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NCAC",
    notes: "Home games at Kahn Track & Shults Field. All home games stream free on Oberlin Sports Network (oberlinsportsnetwork.com).",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at Westminster College (PA)",  type: "Non-Conference", time: "6:00 PM ET",   home: false },
      { date: "Sep 5",  day: "Sat", opponent: "Calvin University",            type: "Non-Conference", time: "1:00 PM ET",   home: true  },
      { date: "Sep 8",  day: "Tue", opponent: "Carlow University",            type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Sep 10", day: "Thu", opponent: "at Franciscan University",     type: "Non-Conference", time: "7:00 PM ET",   home: false },
      { date: "Sep 15", day: "Tue", opponent: "University of Olivet",         type: "Non-Conference", time: "6:00 PM ET",   home: true  },
      { date: "Sep 20", day: "Sun", opponent: "Penn State Altoona",           type: "Non-Conference", time: "2:00 PM ET",   home: true  },
      { date: "Sep 23", day: "Wed", opponent: "Otterbein University",         type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Sep 26", day: "Sat", opponent: "University of Mount Union",    type: "Non-Conference", time: "1:00 PM ET",   home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at DePauw University",        type: "NCAC",           time: "TBA",       home: false },
      { date: "Oct 6",  day: "Tue", opponent: "at College of Wooster ⚡",    type: "NCAC",           time: "3:00 PM ET",   home: false, arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "Kenyon College",              type: "NCAC",           time: "6:00 PM ET",   home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at John Carroll University",  type: "NCAC",           time: "5:00 PM ET",   home: false },
      { date: "Oct 20", day: "Tue", opponent: "Ohio Wesleyan University",    type: "NCAC",           time: "TBA",       home: true  },
      { date: "Oct 24", day: "Sat", opponent: "Denison ⚡",                  type: "NCAC",           time: "11:30 AM ET",  home: true,  arlington: true },
      { date: "Oct 31", day: "Sat", opponent: "at Wittenberg University",   type: "NCAC",           time: "1:00 PM ET",   home: false },
    ]
  },
  "College of Wooster": {
    fullName: "Wooster Fighting Scots", location: "Wooster, OH", stadium: "Carl Dale Field",
    sourceUrl: "https://woosterathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NCAC",
    notes: "Home games stream free at northcoastnetwork.com/wooster. Away NCAC games stream at host school's network.",
    games: [
      { date: "Sep 2",  day: "Wed", opponent: "Chatham",           type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Fredonia",          type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 8",  day: "Tue", opponent: "Geneva",            type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 11", day: "Fri", opponent: "at Alma",           type: "Non-Conference", time: "3:00 PM ET",  home: false },
      { date: "Sep 12", day: "Sat", opponent: "at Kalamazoo",      type: "Non-Conference", time: "11:00 AM ET", home: false },
      { date: "Sep 16", day: "Wed", opponent: "at Marietta",       type: "Non-Conference", time: "5:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "Mount Union",       type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Sep 22", day: "Tue", opponent: "at Pitt-Greensburg",type: "Non-Conference", time: "4:30 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Muskingum",      type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 30", day: "Wed", opponent: "at Ohio Northern",  type: "Non-Conference", time: "7:30 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Ohio Wesleyan",  type: "NCAC",           time: "4:00 PM ET",  home: false },
      { date: "Oct 6",  day: "Tue", opponent: "Oberlin ⚡",        type: "NCAC",           time: "3:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "DePauw",            type: "NCAC",           time: "3:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at Denison ⚡",     type: "NCAC",           time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Oct 20", day: "Tue", opponent: "at Wittenberg",     type: "NCAC",           time: "7:00 PM ET",  home: false },
      { date: "Oct 24", day: "Sat", opponent: "John Carroll",      type: "NCAC",           time: "3:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Kenyon",            type: "NCAC",           time: "3:00 PM ET",  home: true  },
    ]
  },
  "Purdue Fort Wayne": {
    fullName: "Purdue Fort Wayne Mastodons", location: "Fort Wayne, IN", stadium: "Hefner Soccer Complex",
    sourceUrl: "https://gomastodons.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D1, Horizon League",
    notes: "Home games at Hefner Soccer Complex, Fort Wayne IN. Horizon League games on ESPN+. Aug 16 at Purdue = ⚡ Aimee Abraham '26 vs Phoebe Carver '23.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "Western Michigan (Exh.)",  type: "Exhibition",          time: "5:00 PM ET",  home: true  },
      { date: "Aug 8",  day: "Sat", opponent: "at Miami (Ohio) (Exh.)",   type: "Exhibition",          time: "7:00 PM ET",  home: false },
      { date: "Aug 16", day: "Sun", opponent: "at Purdue ⚡",             type: "Non-Conference",      time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Aug 23", day: "Sun", opponent: "Southern Indiana",         type: "Non-Conference",      time: "1:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "at Central Michigan",      type: "Non-Conference",      time: "7:00 PM ET",  home: false },
      { date: "Aug 30", day: "Sun", opponent: "at Eastern Illinois",      type: "Non-Conference",      time: "4:00 PM ET", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Valparaiso",               type: "Non-Conference",      time: "4:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "at Illinois State",        type: "Non-Conference",      time: "2:00 PM ET", home: false },
      { date: "Sep 11", day: "Fri", opponent: "at Indiana Tech",          type: "Non-Conference",      time: "7:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Detroit Mercy",         type: "Horizon League",      time: "1:00 PM ET",  home: false },
      { date: "Sep 24", day: "Thu", opponent: "at Robert Morris",         type: "Horizon League",      time: "4:00 PM ET",  home: false },
      { date: "Sep 27", day: "Sun", opponent: "at Youngstown State",      type: "Horizon League",      time: "1:00 PM ET",  home: false },
      { date: "Oct 1",  day: "Thu", opponent: "Northern Illinois",        type: "Horizon League",      time: "5:00 PM ET",  home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "IU Indy",                  type: "Horizon League",      time: "1:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "Oakland",                  type: "Horizon League",      time: "7:00 PM ET",  home: true  },
      { date: "Oct 15", day: "Thu", opponent: "at Wright State",          type: "Horizon League",      time: "7:00 PM ET",  home: false },
      { date: "Oct 18", day: "Sun", opponent: "at Northern Kentucky",     type: "Horizon League",      time: "1:00 PM ET",  home: false },
      { date: "Oct 22", day: "Thu", opponent: "Milwaukee",                type: "Horizon League",      time: "1:00 PM ET",  home: true  },
      { date: "Oct 25", day: "Sun", opponent: "Green Bay",                type: "Horizon League",      time: "1:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Cleveland State (Senior Day)", type: "Horizon League", time: "1:00 PM ET",  home: true  },
      { date: "Nov 7",  day: "Sat", opponent: "Horizon League QF",        type: "Horizon Tournament",  time: "TBD",      home: false },
      { date: "Nov 12", day: "Thu", opponent: "Horizon League SF",        type: "Horizon Tournament",  time: "TBD",      home: false },
      { date: "Nov 14", day: "Sat", opponent: "Horizon League Final",     type: "Horizon Tournament",  time: "TBD",      home: false },
    ]
  },
  "Tuskegee": {
    fullName: "Tuskegee Golden Tigers", location: "Tuskegee, AL", stadium: "Cleve L. Abbott Memorial Alumni Stadium",
    sourceUrl: "https://goldentigersports.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D2, SIAC · Developing program (announced Feb 2026)",
    notes: "⚠️ Tuskegee's soccer program is newly launched (2026 inaugural/early season per Feb 2026 news). Home games at Cleve L. Abbott Memorial Alumni Stadium. SIAC Cup Nov 6–8, site TBA. Daeycine Robinson '26 & MacKenzie Allen '26 on roster.",
    games: [
      { date: "Aug 21", day: "Fri", opponent: "at West Alabama (Exh.)",     type: "Exhibition",     time: "5:30 PM ET",  home: false },
      { date: "Aug 29", day: "Sat", opponent: "Edward Waters",              type: "SIAC",           time: "TBD",      home: true  },
      { date: "Sep 2",  day: "Wed", opponent: "Auburn-Montgomery",          type: "Non-Conference", time: "TBD",      home: true  },
      { date: "Sep 8",  day: "Tue", opponent: "at Spring Hill",             type: "SIAC",           time: "TBD",      home: false },
      { date: "Sep 18", day: "Fri", opponent: "Southern Union CC",          type: "Non-Conference", time: "TBD",      home: true  },
      { date: "Sep 20", day: "Sun", opponent: "Allen University",           type: "SIAC",           time: "TBD",      home: true  },
      { date: "Sep 29", day: "Tue", opponent: "United States Sports Univ.", type: "Non-Conference", time: "TBD",      home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "at Mars Hill",               type: "Non-Conference", time: "TBD",      home: false },
      { date: "Oct 6",  day: "Tue", opponent: "at LaGrange College",        type: "Non-Conference", time: "TBD",      home: false },
      { date: "Oct 10", day: "Sat", opponent: "at Edward Waters",           type: "SIAC",           time: "TBD",      home: false },
      { date: "Oct 13", day: "Tue", opponent: "at Southern Union CC",       type: "Non-Conference", time: "TBD",      home: false },
      { date: "Oct 16", day: "Fri", opponent: "at Bob Jones University",    type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Oct 18", day: "Sun", opponent: "LaGrange College",           type: "Non-Conference", time: "TBD",      home: true  },
      { date: "Oct 27", day: "Tue", opponent: "Georgia Southwestern State", type: "Non-Conference", time: "TBD",      home: true  },
      { date: "Oct 30", day: "Fri", opponent: "at South Carolina State",    type: "SIAC",           time: "TBD",      home: false },
      { date: "Nov 1",  day: "Sun", opponent: "at Allen University",        type: "SIAC",           time: "TBD",      home: false },
      { date: "Nov 6",  day: "Fri", opponent: "SIAC Cup",                   type: "SIAC Tournament",time: "TBD",      home: false },
      { date: "Nov 8",  day: "Sun", opponent: "SIAC Cup Final",             type: "SIAC Tournament",time: "TBD",      home: false },
    ]
  },
  "The Citadel": {
    fullName: "The Citadel Bulldogs", location: "Charleston, SC", stadium: "Washington Light Infantry Field",
    sourceUrl: "https://citadelsports.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D1, Southern Conference (SoCon)",
    notes: "Home games at Washington Light Infantry Field, Charleston SC. SoCon games on ESPN+. Gabriellah Davis '26 on roster.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "UNCW",                    type: "Non-Conference",   time: "5:00 PM ET",  home: true  },
      { date: "Aug 8",  day: "Sat", opponent: "USC Lancaster",            type: "Non-Conference",   time: "11:00 AM ET", home: true  },
      { date: "Aug 12", day: "Wed", opponent: "at Queens (Charlotte)",    type: "Non-Conference",   time: "7:00 PM ET",  home: false },
      { date: "Aug 17", day: "Mon", opponent: "Southern Utah",            type: "Non-Conference",   time: "TBD",      home: true  },
      { date: "Aug 21", day: "Fri", opponent: "at Kennesaw State",       type: "Non-Conference",   time: "5:00 PM ET",  home: false },
      { date: "Aug 27", day: "Thu", opponent: "South Carolina State",     type: "Non-Conference",   time: "TBD",      home: true  },
      { date: "Aug 30", day: "Sun", opponent: "Winthrop",                 type: "Non-Conference",   time: "2:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "at UNC Asheville",        type: "Non-Conference",   time: "6:00 PM ET",  home: false },
      { date: "Sep 10", day: "Thu", opponent: "Charleston Southern",      type: "Non-Conference",   time: "4:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Bob Jones University",     type: "Non-Conference",   time: "TBD",      home: true  },
      { date: "Sep 17", day: "Thu", opponent: "VMI ⚡",                   type: "SoCon",            time: "4:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at Chattanooga",          type: "SoCon",            time: "2:00 PM ET",  home: false },
      { date: "Sep 24", day: "Thu", opponent: "UNCG",                    type: "SoCon",            time: "4:00 PM ET",  home: true  },
      { date: "Oct 1",  day: "Thu", opponent: "at Mercer",               type: "SoCon",            time: "7:00 PM ET",  home: false },
      { date: "Oct 4",  day: "Sun", opponent: "Furman",                  type: "SoCon",            time: "2:00 PM ET",  home: true  },
      { date: "Oct 9",  day: "Fri", opponent: "at Western Carolina",     type: "SoCon",            time: "2:00 PM ET",  home: false },
      { date: "Oct 15", day: "Thu", opponent: "at Tennessee Tech",       type: "SoCon",            time: "8:00 PM ET",  home: false },
      { date: "Oct 18", day: "Sun", opponent: "Wofford",                 type: "SoCon",            time: "2:00 PM ET",  home: true  },
      { date: "Oct 23", day: "Fri", opponent: "Samford",                 type: "SoCon",            time: "4:00 PM ET",  home: true  },
      { date: "Nov 1",  day: "Sun", opponent: "at ETSU",                 type: "SoCon",            time: "2:00 PM ET",  home: false },
    ]
  },
  "Iona": {
    fullName: "Iona Gaels", location: "New Rochelle, NY", stadium: "Mazzella Field",
    sourceUrl: "https://ionagaels.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 6-10-3 (4-6-2 MAAC) · Did not qualify for MAAC Championship",
    notes: "⚠️ Iona joins the Metro Conference in 2026 — first Metro season. Home games at Mazzella Field, New Rochelle NY. Home games stream on Iona Insider.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "LIU",                    type: "Non-Conference",   time: "1:00 PM ET",  home: true  },
      { date: "Aug 16", day: "Sun", opponent: "at Le Moyne",            type: "Non-Conference",   time: "1:00 PM ET",  home: false },
      { date: "Aug 19", day: "Wed", opponent: "Lafayette",              type: "Non-Conference",   time: "1:00 PM ET",  home: true  },
      { date: "Aug 22", day: "Sat", opponent: "Delaware State",         type: "Non-Conference",   time: "1:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "Seton Hall",             type: "Non-Conference",   time: "1:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Villanova",           type: "Non-Conference",   time: "4:00 PM ET",  home: false },
      { date: "Sep 5",  day: "Sat", opponent: "Mount St. Mary's",       type: "Metro",            time: "11:00 AM ET", home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Niagara",             type: "Metro",            time: "12:00 PM ET", home: false },
      { date: "Sep 19", day: "Sat", opponent: "Merrimack",              type: "Metro",            time: "11:00 AM ET", home: true  },
      { date: "Sep 23", day: "Wed", opponent: "at Fairfield",           type: "Metro",            time: "7:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "Canisius",               type: "Metro",            time: "12:00 PM ET", home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Rider",               type: "Metro",            time: "5:00 PM ET",  home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Saint Peter's",          type: "Metro",            time: "1:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Quinnipiac",          type: "Metro",            time: "12:00 PM ET", home: false },
      { date: "Oct 18", day: "Sun", opponent: "at Miami (FL)",          type: "Non-Conference",   time: "1:00 PM ET",  home: false },
      { date: "Oct 21", day: "Wed", opponent: "Marist",                 type: "Metro",            time: "1:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Siena",               type: "Metro",            time: "1:00 PM ET",  home: false },
      { date: "Oct 31", day: "Sat", opponent: "Sacred Heart",           type: "Metro",            time: "12:00 PM ET", home: true  },
      { date: "Nov 4",  day: "Wed", opponent: "at Manhattan College ⚡", type: "Metro",            time: "3:00 PM ET",  home: false, arlington: true },
      { date: "Nov 8",  day: "Sun", opponent: "Metro First Round",      type: "Metro Tournament", time: "TBD",      home: false },
      { date: "Nov 12", day: "Thu", opponent: "Metro Semifinal",        type: "Metro Tournament", time: "TBD",      home: false },
      { date: "Nov 15", day: "Sun", opponent: "Metro Championship",     type: "Metro Tournament", time: "TBD",      home: false },
    ]
  },

  "Virginia State": {
    fullName: "Virginia State Trojans", location: "Ettrick, VA", stadium: "Rogers Stadium",
    sourceUrl: "https://govsutrojans.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 7-10-1 - 2025 USCAA National Champions - NCAA D2, CIAA",
    notes: "Home games at Rogers Stadium, Ettrick VA. All home games on USCAA Sports Network. Mya Oboite '26 on roster. USCAA Championships Nov 13-15 in Pittsburgh PA.",
    games: [
      { date: "Aug 21", day: "Fri", opponent: "Grove Academy (Scrimmage)",  type: "Exhibition",     time: "6:00 PM ET",  home: true  },
      { date: "Aug 29", day: "Sat", opponent: "Ferrum College",             type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 2",  day: "Wed", opponent: "University of Mount Olive",  type: "Non-Conference", time: "2:00 PM ET",  home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "at Emory & Henry",           type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 12", day: "Sat", opponent: "Bluefield State",            type: "Non-Conference", time: "12:00 PM ET", home: true  },
      { date: "Sep 16", day: "Wed", opponent: "Emory & Henry",              type: "Non-Conference", time: "3:00 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at University of Mount Olive", type: "Non-Conference", time: "3:00 PM ET", home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Ferrum College",          type: "Non-Conference", time: "6:30 PM ET",  home: false },
      { date: "Sep 30", day: "Wed", opponent: "at Lincoln University (Pa.)", type: "Non-Conference", time: "2:00 PM ET",  home: false },
      { date: "Oct 4",  day: "Sun", opponent: "at Bluefield State",         type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Regent University",          type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Chowan University",       type: "Non-Conference", time: "12:00 PM ET", home: false },
      { date: "Oct 14", day: "Wed", opponent: "Hampton",                    type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Shaw University",            type: "Non-Conference", time: "12:00 PM ET", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Salem University",        type: "Non-Conference", time: "11:00 AM ET", home: false },
      { date: "Oct 28", day: "Wed", opponent: "Carolina University",        type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Edward Waters University",   type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Nov 13", day: "Fri", opponent: "USCAA Championships",        type: "USCAA Tournament", time: "TBA",        home: false, neutral: "Pittsburgh, PA" },
      { date: "Nov 15", day: "Sun", opponent: "USCAA Championship Final",   type: "USCAA Tournament", time: "TBA",        home: false, neutral: "Pittsburgh, PA" },
    ]
  },

  "Tampa": {
    fullName: "Tampa Spartans", location: "Tampa, FL", stadium: "Pepin Stadium",
    sourceUrl: "https://www.tampaspartans.com/sports/wsoc/2026-27/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D2, Sunshine State Conference (SSC)",
    notes: "Home games at Pepin Stadium, Tampa FL. SSC games on sunshinestateconference.tv/tampa.",
    games: [
      { date: "Aug 27", day: "Thu", opponent: "at Lenoir-Rhyne",       type: "Regional",           time: "6:00 PM ET", home: false },
      { date: "Aug 30", day: "Sun", opponent: "at Catawba",            type: "Regional",           time: "TBA",        home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Alabama-Huntsville",    type: "Regional",           time: "5:00 PM ET", home: true  },
      { date: "Sep 7",  day: "Mon", opponent: "at Montevallo",         type: "Regional",           time: "7:00 PM ET", home: false },
      { date: "Sep 9",  day: "Wed", opponent: "at Auburn-Montgomery",  type: "Regional",           time: "4:00 PM ET", home: false },
      { date: "Sep 12", day: "Sat", opponent: "at Rollins",            type: "SSC",                time: "7:00 PM ET", home: false },
      { date: "Sep 16", day: "Wed", opponent: "Saint Leo",             type: "SSC",                time: "7:00 PM ET", home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at Saint Michael's",    type: "Non-Conference",     time: "TBA",        home: false },
      { date: "Sep 23", day: "Wed", opponent: "at Eckerd",             type: "SSC",                time: "7:00 PM ET", home: false },
      { date: "Sep 26", day: "Sat", opponent: "Barry",                 type: "SSC",                time: "7:00 PM ET", home: true  },
      { date: "Sep 30", day: "Wed", opponent: "at Flagler",            type: "Regional",           time: "7:00 PM ET", home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Embry-Riddle (FL)", type: "SSC",                time: "7:00 PM ET", home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Palm Beach Atlantic",   type: "SSC",                time: "7:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Florida Tech",       type: "SSC",                time: "7:00 PM ET", home: false },
      { date: "Oct 17", day: "Sat", opponent: "Lynn",                  type: "SSC",                time: "7:00 PM ET", home: true  },
      { date: "Oct 21", day: "Wed", opponent: "Florida Southern",      type: "SSC",                time: "7:00 PM ET", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Nova Southeastern",  type: "SSC",                time: "7:00 PM ET", home: false },
      { date: "Nov 2",  day: "Mon", opponent: "SSC Quarterfinals",     type: "SSC Tournament",     time: "TBA",        home: false },
      { date: "Nov 5",  day: "Thu", opponent: "SSC Semifinals",        type: "SSC Tournament",     time: "TBA",        home: false },
      { date: "Nov 8",  day: "Sun", opponent: "SSC Championship",      type: "SSC Tournament",     time: "TBA",        home: false },
    ]
  },

  // ── 2025 Graduating Class Schools ────────────────────────────────────────
  "Vanderbilt": {
    fullName: "Vanderbilt Commodores", location: "Nashville, TN", stadium: "Vanderbilt Soccer Complex",
    sourceUrl: "https://vucommodores.com/sports/wsoc/schedule", status: "confirmed",
    record2025: "2025: 15-3-2 (2nd SEC) · SEC Tournament Champions · NCAA R16 · Liv Stafford scored in SEC QF vs. Alabama",
    notes: "Full 2026 schedule published. SEC games on SEC Network / ESPN+. SEC Tournament in Pensacola, Fla.",
    games: [
      { date: "Aug 12", day: "Wed", opponent: "SMU",            type: "Non-Conference",  time: "TBA", home: true  },
      { date: "Aug 16", day: "Sun", opponent: "ETSU",           type: "Non-Conference",  time: "TBA", home: true  },
      { date: "Aug 21", day: "Fri", opponent: "Memphis",        type: "Non-Conference",  time: "TBA", home: true  },
      { date: "Aug 27", day: "Thu", opponent: "at Rice",        type: "Non-Conference",  time: "TBA", home: false },
      { date: "Aug 30", day: "Sun", opponent: "at Houston",     type: "Non-Conference",  time: "TBA", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Tennessee Tech", type: "Non-Conference",  time: "TBA", home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Xavier",         type: "Non-Conference",  time: "TBA", home: true  },
      { date: "Sep 10", day: "Thu", opponent: "at Georgia",     type: "SEC",             time: "TBA", home: false },
      { date: "Sep 18", day: "Fri", opponent: "Texas A&M",      type: "SEC",             time: "TBA", home: true  },
      { date: "Sep 24", day: "Thu", opponent: "at Ole Miss",    type: "SEC",             time: "TBA", home: false },
      { date: "Sep 27", day: "Sun", opponent: "at Tennessee",   type: "SEC",             time: "TBA", home: false },
      { date: "Oct 2",  day: "Fri", opponent: "Kentucky",       type: "SEC",             time: "TBA", home: true  },
      { date: "Oct 9",  day: "Fri", opponent: "at Missouri",    type: "SEC",             time: "TBA", home: false },
      { date: "Oct 15", day: "Thu", opponent: "Florida",        type: "SEC",             time: "TBA", home: true  },
      { date: "Oct 18", day: "Sun", opponent: "at Alabama",     type: "SEC",             time: "TBA", home: false },
      { date: "Oct 23", day: "Fri", opponent: "Texas",          type: "SEC",             time: "TBA", home: true  },
      { date: "Nov 1",  day: "Sun", opponent: "South Carolina", type: "SEC",             time: "TBA", home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "SEC Tournament", type: "SEC Tournament",  time: "TBA", home: false, neutral: "Pensacola, FL" },
    ]
  },
  "Davidson": {
    fullName: "Davidson Wildcats", location: "Davidson, NC", stadium: "Alumni Soccer Stadium",
    sourceUrl: "https://davidsonwildcats.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 7-7-3 (3-5-2 A-10, 9th) · Did not qualify for A-10 Tournament",
    notes: "Home games at Alumni Soccer Stadium. A-10 games on ESPN+.",
    games: [
      { date: "Aug 6",  day: "Thu", opponent: "at Presbyterian (Exh.)",  type: "Exhibition",     time: "6:30 PM ET",  home: false },
      { date: "Aug 9",  day: "Sun", opponent: "UNC Greensboro (Exh.)",   type: "Exhibition",     time: "11:00 AM ET", home: true  },
      { date: "Aug 16", day: "Sun", opponent: "at High Point",           type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Aug 20", day: "Thu", opponent: "at USC Upstate",          type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Aug 23", day: "Sun", opponent: "College of Charleston",   type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "Elon",                    type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at NC State",             type: "Non-Conference", time: "5:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "Coastal Carolina",        type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 10", day: "Thu", opponent: "UNC Asheville",           type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at Furman",               type: "Non-Conference", time: "2:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "at La Salle",             type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 24", day: "Thu", opponent: "Saint Joseph's",          type: "Atlantic 10",    time: "7:00 PM ET",  home: true  },
      { date: "Sep 27", day: "Sun", opponent: "at Fordham",              type: "Atlantic 10",    time: "1:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "Saint Louis",             type: "Atlantic 10",    time: "7:00 PM ET",  home: true  },
      { date: "Oct 8",  day: "Thu", opponent: "Rhode Island",            type: "Atlantic 10",    time: "7:00 PM ET",  home: true  },
      { date: "Oct 11", day: "Sun", opponent: "at Richmond ⚡",          type: "Atlantic 10",    time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Oct 17", day: "Sat", opponent: "Dayton",                  type: "Atlantic 10",    time: "7:00 PM ET",  home: true  },
      { date: "Oct 22", day: "Thu", opponent: "at Duquesne ⚡",          type: "Atlantic 10",    time: "7:00 PM ET",  home: false, arlington: true },
      { date: "Oct 25", day: "Sun", opponent: "at St. Bonaventure",      type: "Atlantic 10",    time: "12:00 PM ET", home: false },
      { date: "Nov 1",  day: "Sun", opponent: "George Mason",            type: "Atlantic 10",    time: "1:30 PM ET",  home: true  },
    ]
  },
  "Delaware": {
    fullName: "Delaware Blue Hens", location: "Newark, DE", stadium: "Stuart and Suzanne Grant Stadium",
    sourceUrl: "https://bluehens.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · Conference USA (transferred from CAA) · Lost in CUSA Tournament",
    notes: "Delaware moved to Conference USA in 2025. Home games at Stuart and Suzanne Grant Stadium. CUSA games on ESPN+.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at Rider (Exh.)",     type: "Exhibition",      time: "7:00 PM ET",  home: false },
      { date: "Aug 9",  day: "Sun", opponent: "at Marshall (Exh.)",  type: "Exhibition",      time: "TBA",      home: false },
      { date: "Aug 15", day: "Sat", opponent: "George Washington",   type: "Non-Conference",  time: "7:00 PM ET",  home: true  },
      { date: "Aug 20", day: "Thu", opponent: "VCU",                 type: "Non-Conference",  time: "12:00 PM ET", home: true  },
      { date: "Aug 23", day: "Sun", opponent: "Navy",                type: "Non-Conference",  time: "6:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "Towson",              type: "Non-Conference",  time: "6:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "UMBC",                type: "Non-Conference",  time: "1:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "at Bucknell",         type: "Non-Conference",  time: "7:00 PM ET",  home: false },
      { date: "Sep 10", day: "Thu", opponent: "Georgetown",          type: "Non-Conference",  time: "6:00 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at Drexel",           type: "Non-Conference",  time: "12:00 PM ET", home: false },
      { date: "Sep 17", day: "Thu", opponent: "at Villanova",        type: "Non-Conference",  time: "4:00 PM ET",  home: false },
      { date: "Sep 20", day: "Sun", opponent: "Columbia",            type: "Non-Conference",  time: "12:00 PM ET", home: true  },
      { date: "Sep 27", day: "Sun", opponent: "Missouri State",      type: "Non-Conference",  time: "12:00 PM ET", home: true  },
      { date: "Oct 1",  day: "Thu", opponent: "at FIU",              type: "Conference USA",  time: "TBA",      home: false },
      { date: "Oct 4",  day: "Sun", opponent: "at Kennesaw State",   type: "Conference USA",  time: "12:00 PM ET", home: false },
      { date: "Oct 11", day: "Sun", opponent: "Western Kentucky",    type: "Conference USA",  time: "1:00 PM ET",  home: true  },
      { date: "Oct 18", day: "Sun", opponent: "Middle Tennessee",    type: "Conference USA",  time: "12:00 PM ET", home: true  },
      { date: "Oct 22", day: "Thu", opponent: "at Liberty",          type: "Conference USA",  time: "5:00 PM ET",  home: false },
      { date: "Oct 25", day: "Sun", opponent: "at Jacksonville State", type: "Conference USA", time: "12:00 PM ET", home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Sam Houston",         type: "Conference USA",  time: "12:00 PM ET", home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "CUSA Tournament",     type: "Conference USA Tournament", time: "TBA", home: false },
    ]
  },
  "Harvard": {
    fullName: "Harvard Crimson", location: "Cambridge, MA", stadium: "Jordan Field",
    sourceUrl: "https://gocrimson.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 5-6-3 (3-3-1 Ivy, 5th) · Missed Ivy League Tournament (top 4 qualify) · Won 2025 Ivy League Tournament",
    notes: "Home games at Jordan Field, Cambridge MA. All home games and select away on ESPN+. Ivy League Tournament Nov 12 & 15.",
    games: [
      { date: "Aug 20", day: "Thu", opponent: "Stony Brook",              type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Aug 24", day: "Mon", opponent: "UMass",                    type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "Fairfield",                type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Syracuse",              type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 2",  day: "Wed", opponent: "at Boston University ⚡",  type: "Non-Conference", time: "7:00 PM ET",  home: false, arlington: true },
      { date: "Sep 6",  day: "Sun", opponent: "at Alabama",               type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 10", day: "Thu", opponent: "Northeastern",             type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at New Hampshire",         type: "Non-Conference", time: "2:00 PM ET",  home: false },
      { date: "Sep 20", day: "Sun", opponent: "UConn",                    type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "at Princeton",             type: "Ivy League",     time: "4:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "Cornell",                  type: "Ivy League",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Dartmouth ⚡",          type: "Ivy League",     time: "TBA",      home: false, arlington: true },
      { date: "Oct 17", day: "Sat", opponent: "Yale",                     type: "Ivy League",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Brown",                 type: "Ivy League",     time: "7:00 PM ET",  home: false },
      { date: "Oct 31", day: "Sat", opponent: "at Pennsylvania ⚡",       type: "Ivy League",     time: "4:00 PM ET",  home: false, arlington: true },
      { date: "Nov 7",  day: "Sat", opponent: "Columbia",                 type: "Ivy League",     time: "6:00 PM ET",  home: true  },
      { date: "Nov 12", day: "Thu", opponent: "Ivy League Tournament SF", type: "Ivy Tournament", time: "TBA",      home: false },
      { date: "Nov 15", day: "Sun", opponent: "Ivy League Tournament F",  type: "Ivy Tournament", time: "TBA",      home: false },
    ]
  },
  "Vermont": {
    fullName: "Vermont Catamounts", location: "Burlington, VT", stadium: "Virtue Field",
    sourceUrl: "https://uvmathletics.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: AE Tournament Finalists · Lost to Maine 2-2 (4-3 PKs) in AE Final · AE Goalkeeper of Year: Kylee Carafoli",
    notes: "Two Arlington athletes: Erin Fay '25 (returning) and Kate Hawley '24 (transfer from Maryland). America East games on ESPN+.",
    games: [
      { date: "Aug 12", day: "Wed", opponent: "Merrimack",         type: "Non-Conference",  time: "6:00 PM ET",  home: true  },
      { date: "Aug 16", day: "Sun", opponent: "Sacred Heart",      type: "Non-Conference",  time: "1:00 PM ET",  home: true  },
      { date: "Aug 20", day: "Thu", opponent: "at Yale",           type: "Non-Conference",  time: "TBA",      home: false },
      { date: "Aug 23", day: "Sun", opponent: "at Army",           type: "Non-Conference",  time: "TBA",      home: false },
      { date: "Aug 30", day: "Sun", opponent: "at Stonehill",      type: "Non-Conference",  time: "TBA",      home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Boston College",    type: "Non-Conference",  time: "6:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "at St. Joseph's",   type: "Non-Conference",  time: "TBA",      home: false },
      { date: "Sep 15", day: "Tue", opponent: "Adelphi",           type: "Non-Conference",  time: "4:00 PM ET",  home: true  },
      { date: "Sep 20", day: "Sun", opponent: "UMBC",              type: "America East",    time: "12:00 PM ET", home: true  },
      { date: "Sep 25", day: "Fri", opponent: "at UConn",          type: "Non-Conference",  time: "7:00 PM ET",  home: false },
      { date: "Oct 1",  day: "Thu", opponent: "at UMass Lowell",   type: "America East",    time: "6:00 PM ET",  home: false },
      { date: "Oct 4",  day: "Sun", opponent: "Maine",             type: "America East",    time: "3:00 PM ET",  home: true  },
      { date: "Oct 11", day: "Sun", opponent: "at Bryant",         type: "America East",    time: "TBA",      home: false },
      { date: "Oct 18", day: "Sun", opponent: "at NJIT",           type: "America East",    time: "TBA",      home: false },
      { date: "Oct 22", day: "Thu", opponent: "UAlbany",           type: "America East",    time: "6:00 PM ET",  home: true  },
      { date: "Oct 25", day: "Sun", opponent: "at New Hampshire",  type: "America East",    time: "2:00 PM ET",  home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Binghamton",        type: "America East",    time: "TBA",      home: true  },
    ]
  },
  "Washington & Lee": {
    fullName: "W&L Generals", location: "Lexington, VA", stadium: "Alston Parker Watt Field",
    sourceUrl: "https://generalssports.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 16-2-2 (10-0 ODAC) · 2nd straight ODAC Champions · NCAA Sweet 16",
    notes: "Home games at Alston Parker Watt Field. All home games on FloCollege. ODAC Tournament hosted at W&L (Oct 31 QF, Nov 4 SF, Nov 7 Championship).",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at Southern Virginia",       type: "Non-Conference",  time: "7:00 PM ET",  home: false },
      { date: "Sep 4",  day: "Fri", opponent: "William Smith",              type: "Non-Conference",  time: "5:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Christopher Newport ⚡", type: "Non-Conference",  time: "12:00 PM ET", home: false, arlington: true },
      { date: "Sep 19", day: "Sat", opponent: "York (PA) — Senior Day",    type: "Non-Conference",  time: "1:00 PM ET",  home: true  },
      { date: "Sep 22", day: "Tue", opponent: "at Sweet Briar",             type: "ODAC",            time: "6:00 PM ET",  home: false },
      { date: "Sep 23", day: "Wed", opponent: "Guilford College",           type: "ODAC",            time: "6:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "at Randolph College ⚡",    type: "ODAC",            time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Sep 30", day: "Wed", opponent: "at Averett University",      type: "ODAC",            time: "4:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "University of Lynchburg",   type: "ODAC",            time: "12:00 PM ET", home: true  },
      { date: "Oct 6",  day: "Tue", opponent: "Mary Washington",            type: "Non-Conference",  time: "7:00 PM ET",  home: true  },
      { date: "Oct 9",  day: "Fri", opponent: "at Sewanee",                type: "Non-Conference",  time: "3:00 PM ET",  home: false },
      { date: "Oct 13", day: "Tue", opponent: "at Shenandoah",             type: "ODAC",            time: "7:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "Batten University ⚡",      type: "ODAC",            time: "3:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 21", day: "Wed", opponent: "Randolph-Macon College",    type: "ODAC",            time: "5:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Roanoke College",        type: "ODAC",            time: "12:00 PM ET", home: false },
      { date: "Oct 28", day: "Wed", opponent: "Bridgewater College",       type: "ODAC",            time: "5:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "ODAC Quarterfinals",        type: "ODAC Tournament", time: "TBD",      home: true  },
      { date: "Nov 4",  day: "Wed", opponent: "ODAC Semifinals",           type: "ODAC Tournament", time: "TBD",      home: true  },
      { date: "Nov 7",  day: "Sat", opponent: "ODAC Championship",         type: "ODAC Tournament", time: "TBD",      home: true  },
    ]
  },
  "William & Mary": {
    fullName: "William & Mary Tribe", location: "Williamsburg, VA", stadium: "Martin Family Stadium",
    sourceUrl: "https://tribeathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 7-6-4 (5-2-2 CAA, 2nd North) · CAA Tournament SF · Gwen Doughty: CAA All-Rookie Team (GK)",
    notes: "Home games at Martin Family Stadium. CAA games on FloSports. 16-game regular season.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "GW (Exh.)",             type: "Exhibition",     time: "TBA",      home: true  },
      { date: "Aug 8",  day: "Sat", opponent: "Longwood (Exh.)",       type: "Exhibition",     time: "TBA",      home: true  },
      { date: "Aug 12", day: "Wed", opponent: "at Loyola Maryland",    type: "Non-Conference", time: "TBA",      home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Army",               type: "Non-Conference", time: "TBA",      home: false },
      { date: "Aug 27", day: "Thu", opponent: "Virginia Tech",       type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Appalachian State",  type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Liberty",               type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "VCU",                   type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at American ⚡",        type: "Non-Conference", time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Sep 19", day: "Sat", opponent: "at Charleston",         type: "CAA",            time: "TBA",      home: false },
      { date: "Sep 24", day: "Thu", opponent: "Towson",                type: "CAA",            time: "TBA",      home: true  },
      { date: "Sep 27", day: "Sun", opponent: "Drexel",                type: "CAA",            time: "TBA",      home: true  },
      { date: "Oct 2",  day: "Fri", opponent: "Campbell",              type: "CAA",            time: "TBA",      home: true  },
      { date: "Oct 8",  day: "Thu", opponent: "at Hofstra",            type: "CAA",            time: "TBA",      home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Stony Brook",        type: "CAA",            time: "TBA",      home: false },
      { date: "Oct 18", day: "Sun", opponent: "at Elon",               type: "CAA",            time: "TBA",      home: false },
      { date: "Oct 25", day: "Sun", opponent: "UNCW",                  type: "CAA",            time: "TBA",      home: true  },
      { date: "Nov 1",  day: "Sun", opponent: "at Hampton ⚡",          type: "CAA",            time: "12:00 PM ET", home: false, arlington: true },
      { date: "Nov 5",  day: "Thu", opponent: "CAA QF",                type: "CAA Tournament", time: "TBA",      home: false },
      { date: "Nov 8",  day: "Sun", opponent: "CAA SF",                type: "CAA Tournament", time: "TBA",      home: false },
      { date: "Nov 14", day: "Sat", opponent: "CAA Championship",      type: "CAA Tournament", time: "TBA",      home: false },
    ]
  },
  "Christopher Newport": {
    fullName: "CNU Captains", location: "Newport News, VA", stadium: "Captains Field",
    sourceUrl: "https://www.cnusports.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, C2C Athletic Conference",
    notes: "Note: CNU now competes in the Coast-to-Coast Athletic Conference (C2C), not ODAC. Home games at Captains Field, Newport News VA. All games stream free on cnusports.com.",
    games: [
      { date: "Aug 23", day: "Sun", opponent: "at Chowan (Exh.)",         type: "Exhibition",     time: "5:00 PM ET",  home: false },
      { date: "Aug 28", day: "Fri", opponent: "Lynchburg (Exh.)",         type: "Exhibition",     time: "6:00 PM ET",  home: false, neutral: "Richmond, VA" },
      { date: "Sep 1",  day: "Tue", opponent: "Methodist",                type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 4",  day: "Fri", opponent: "Hardin-Simmons",           type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Chapman",                  type: "Non-Conference", time: "11:00 AM ET", home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Washington & Lee ⚡",      type: "Non-Conference", time: "12:00 PM ET", home: true,  arlington: true },
      { date: "Sep 13", day: "Sun", opponent: "Stockton",                 type: "Non-Conference", time: "12:00 PM ET", home: true  },
      { date: "Sep 18", day: "Fri", opponent: "at Emory ⚡",              type: "Non-Conference", time: "7:00 PM ET",  home: false, arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at Oglethorpe",            type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 23", day: "Wed", opponent: "Marymount University ⚡",  type: "Non-Conference", time: "5:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 30", day: "Wed", opponent: "at Catholic University",   type: "Non-Conference", time: "5:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Roanoke",               type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "at Bridgewater",           type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Oct 20", day: "Tue", opponent: "Southern Virginia",        type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Mary Washington",       type: "Non-Conference", time: "2:30 PM ET",  home: false },
      { date: "Oct 25", day: "Sun", opponent: "Regent",                   type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Salisbury",                type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Nov 5",  day: "Thu", opponent: "C2C Tournament QF",        type: "C2C Tournament", time: "TBA",      home: true  },
      { date: "Nov 6",  day: "Fri", opponent: "C2C Tournament SF",        type: "C2C Tournament", time: "TBA",      home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "C2C Tournament Championship", type: "C2C Tournament", time: "TBA",   home: true  },
      { date: "Nov 14", day: "Sat", opponent: "NCAA 1st Round",           type: "NCAA Tournament", time: "TBA",     home: false },
      { date: "Nov 15", day: "Sun", opponent: "NCAA 2nd Round",           type: "NCAA Tournament", time: "TBA",     home: false },
    ]
  },
  "Carnegie Mellon": {
    fullName: "Carnegie Mellon Tartans", location: "Pittsburgh, PA", stadium: "CMU Soccer Field",
    sourceUrl: "https://athletics.cmu.edu/sports/wsoc/2026-27/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, UAA",
    notes: "Home games at CMU Soccer Field, Pittsburgh. All games stream free. FloSports for select matches.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at St. Francis (Pa.)",  type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 4",  day: "Fri", opponent: "Wis.-Platteville",      type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "at Ohio Northern",      type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 9",  day: "Wed", opponent: "Grove City",            type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at William Smith",      type: "Non-Conference", time: "11:00 AM ET", home: false },
      { date: "Sep 18", day: "Fri", opponent: "La Roche",              type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 20", day: "Sun", opponent: "Baldwin Wallace",       type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 24", day: "Thu", opponent: "Capital",               type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 30", day: "Wed", opponent: "at Penn St.-Behrend",   type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Emory ⚡",           type: "UAA",            time: "1:30 PM ET",  home: false, arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "at UChicago",           type: "UAA",            time: "1:30 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "WashU",                 type: "UAA",            time: "1:30 PM ET",  home: true  },
      { date: "Oct 23", day: "Fri", opponent: "NYU",                   type: "UAA",            time: "7:30 PM ET",  home: true  },
      { date: "Oct 25", day: "Sun", opponent: "Brandeis",              type: "UAA",            time: "1:30 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at Rochester",          type: "UAA",            time: "1:30 PM ET",  home: false },
      { date: "Nov 7",  day: "Sat", opponent: "at Case Western Reserve ⚡", type: "UAA",       time: "3:30 PM ET",  home: false, arlington: true },
    ]
  },
  "Denison": {
    fullName: "Denison Big Red", location: "Granville, OH", stadium: "Kienzle-Hylbert Stadium",
    sourceUrl: "https://denisonbigred.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NCAC · Home games stream free on northcoastnetwork.com/denison",
    notes: "Home games at Kienzle-Hylbert Stadium, Granville OH. All home games stream free on North Coast Network.",
    games: [
      { date: "Aug 21", day: "Fri", opponent: "at Marietta (Scrimmage)",      type: "Exhibition",     time: "4:00 PM ET",   home: false },
      { date: "Aug 25", day: "Tue", opponent: "Mount St. Joseph (Scrimmage)", type: "Exhibition",     time: "7:00 PM ET",   home: true  },
      { date: "Sep 1",  day: "Tue", opponent: "at Capital University",        type: "Non-Conference", time: "7:00 PM ET",   home: false },
      { date: "Sep 4",  day: "Fri", opponent: "Otterbein (Home Opener)",      type: "Non-Conference", time: "6:00 PM ET",   home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Kalamazoo College",            type: "Non-Conference", time: "12:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Johns Hopkins ⚡",             type: "Non-Conference", time: "12:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 13", day: "Sun", opponent: "at Baldwin Wallace",           type: "Non-Conference", time: "1:00 PM ET",   home: false },
      { date: "Sep 18", day: "Fri", opponent: "at Centre College",            type: "Non-Conference", time: "6:00 PM ET",   home: false },
      { date: "Sep 22", day: "Tue", opponent: "Ohio Northern University",     type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Case Western Reserve ⚡",      type: "Non-Conference", time: "12:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 30", day: "Wed", opponent: "at Wilmington College",        type: "Non-Conference", time: "4:00 PM ET",   home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Kenyon College",            type: "NCAC",           time: "12:00 PM ET",  home: false },
      { date: "Oct 6",  day: "Tue", opponent: "John Carroll University",      type: "NCAC",           time: "7:00 PM ET",   home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Wittenberg University",     type: "NCAC",           time: "3:30 PM ET",   home: false },
      { date: "Oct 17", day: "Sat", opponent: "College of Wooster ⚡",        type: "NCAC",           time: "12:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 20", day: "Tue", opponent: "DePauw University",            type: "NCAC",           time: "7:00 PM ET",   home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Oberlin College ⚡",        type: "NCAC",           time: "11:30 AM ET",  home: false, arlington: true },
      { date: "Oct 31", day: "Sat", opponent: "Ohio Wesleyan University",     type: "NCAC",           time: "12:00 PM ET",  home: true  },
      { date: "Nov 4",  day: "Wed", opponent: "NCAC Tournament Semifinals",   type: "NCAC Tournament",time: "TBA",       home: false },
      { date: "Nov 7",  day: "Sat", opponent: "NCAC Tournament Final",        type: "NCAC Tournament",time: "TBA",       home: false },
    ]
  },
  "Manhattan College": {
    fullName: "Manhattan Jaspers", location: "Riverdale, NY", stadium: "Gaelic Park",
    sourceUrl: "https://gojaspers.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 7-6-5 (6-5-1 Metro Conference) · MAAC rebranded to 'The Metro Conference' effective May 2026",
    notes: "Home games at Gaelic Park, Riverdale NY (4513 Manhattan College Pkwy). Metro Conference games on ESPN+. Schedule announced July 22, 2026.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at Stony Brook (Exh.)",  type: "Exhibition",      time: "TBA",       home: false },
      { date: "Aug 8",  day: "Sat", opponent: "at Bucknell (Exh.)",     type: "Exhibition",      time: "TBA",       home: false },
      { date: "Aug 12", day: "Wed", opponent: "at Monmouth",             type: "Non-Conference",  time: "6:00 PM ET", home: false },
      { date: "Aug 16", day: "Sun", opponent: "at LIU",                  type: "Non-Conference",  time: "12:00 PM ET", home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Fordham",              type: "Non-Conference",  time: "7:00 PM ET", home: false },
      { date: "Aug 23", day: "Sun", opponent: "Wagner",                  type: "Non-Conference",  time: "11:00 AM ET", home: true  },
      { date: "Aug 31", day: "Mon", opponent: "Delaware State",          type: "Non-Conference",  time: "3:00 PM ET", home: true  },
      { date: "Sep 5",  day: "Sat", opponent: "at Siena",                type: "Metro",           time: "TBA",       home: false },
      { date: "Sep 19", day: "Sat", opponent: "Niagara",                 type: "Metro",           time: "1:30 PM ET", home: true  },
      { date: "Sep 23", day: "Wed", opponent: "at Marist",               type: "Metro",           time: "TBA",       home: false },
      { date: "Sep 26", day: "Sat", opponent: "Quinnipiac",              type: "Metro",           time: "1:30 PM ET", home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Merrimack",            type: "Metro",           time: "TBA",       home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Rider",                   type: "Metro",           time: "3:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Mount St. Mary's",     type: "Metro",           time: "TBA",       home: false },
      { date: "Oct 17", day: "Sat", opponent: "Sacred Heart",            type: "Metro",           time: "2:00 PM ET", home: true  },
      { date: "Oct 21", day: "Wed", opponent: "at Saint Peter's",        type: "Metro",           time: "TBA",       home: false },
      { date: "Oct 24", day: "Sat", opponent: "Fairfield",               type: "Metro",           time: "1:30 PM ET", home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at Canisius",             type: "Metro",           time: "TBA",       home: false },
      { date: "Nov 4",  day: "Wed", opponent: "Iona ⚡",                 type: "Metro",           time: "3:00 PM ET", home: true,  arlington: true },
      { date: "Nov 8",  day: "Sun", opponent: "Metro First Round",       type: "Metro Tournament", time: "TBA",       home: false },
      { date: "Nov 12", day: "Thu", opponent: "Metro Semifinal",         type: "Metro Tournament", time: "TBA",       home: false },
      { date: "Nov 15", day: "Sun", opponent: "Metro Championship",      type: "Metro Tournament", time: "TBA",       home: false },
    ]
  },
  "American University": {
    fullName: "American University Eagles", location: "Washington, DC", stadium: "Reeves Field",
    sourceUrl: "https://aueagles.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · Patriot League",
    notes: "All home games at Reeves Field, Washington DC. All games on ESPN+.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "at La Salle",       type: "Non-Conference",   time: "6:00 PM ET", home: false },
      { date: "Aug 16", day: "Sun", opponent: "at UMBC",           type: "Non-Conference",   time: "6:00 PM ET", home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Richmond ⚡",    type: "Non-Conference",   time: "5:00 PM ET", home: false, arlington: true },
      { date: "Aug 23", day: "Sun", opponent: "USMMA",              type: "Non-Conference",   time: "1:00 PM ET", home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "UNC Greensboro",    type: "Non-Conference",   time: "1:00 PM ET", home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Elon",              type: "Non-Conference",   time: "11:00 AM ET", home: true },
      { date: "Sep 10", day: "Thu", opponent: "at George Washington", type: "Non-Conference", time: "3:00 PM ET", home: false },
      { date: "Sep 13", day: "Sun", opponent: "William & Mary ⚡", type: "Non-Conference",   time: "1:00 PM ET", home: true, arlington: true },
      { date: "Sep 19", day: "Sat", opponent: "at Army",           type: "Patriot League",   time: "1:00 PM ET", home: false },
      { date: "Sep 26", day: "Sat", opponent: "Lafayette",         type: "Patriot League",   time: "1:00 PM ET", home: true  },
      { date: "Sep 30", day: "Wed", opponent: "at Loyola Maryland", type: "Patriot League",  time: "6:00 PM ET", home: false },
      { date: "Oct 4",  day: "Sun", opponent: "at Lehigh ⚡",      type: "Patriot League",   time: "2:00 PM ET", home: false, arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "Colgate",           type: "Patriot League",   time: "1:00 PM ET", home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Boston University ⚡", type: "Patriot League", time: "1:00 PM ET", home: true, arlington: true },
      { date: "Oct 23", day: "Fri", opponent: "at Navy",           type: "Patriot League",   time: "7:00 PM ET", home: false },
      { date: "Nov 1",  day: "Sun", opponent: "at Holy Cross",     type: "Patriot League",   time: "1:00 PM ET", home: false },
      { date: "Nov 4",  day: "Wed", opponent: "Bucknell",          type: "Patriot League",   time: "1:00 PM ET", home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "Patriot League First Round", type: "Patriot League Tournament", time: "TBD", home: false },
      { date: "Nov 11", day: "Wed", opponent: "Patriot League Semifinals",  type: "Patriot League Tournament", time: "TBD", home: false },
      { date: "Nov 15", day: "Sun", opponent: "Patriot League Championship", type: "Patriot League Tournament", time: "TBD", home: false },
    ]
  },
  "Macalester": {
    fullName: "Macalester Scots", location: "St. Paul, MN", stadium: "John Leaney Field at Macalester Stadium",
    sourceUrl: "https://athletics.macalester.edu/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 9-7-2 (MIAC) · Lost in MIAC Quarterfinals to Augsburg 2-1",
    notes: "Home games at John Leaney Field at Macalester Stadium, St. Paul MN. All home games stream free via Macalester athletics site. Regular season ends at Augsburg — 2025 playoff rematch.",
    games: [
      { date: "Sep 4",  day: "Fri", opponent: "at University of Chicago", type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at UW-Oshkosh",            type: "Non-Conference", time: "11:00 AM ET", home: false },
      { date: "Sep 10", day: "Thu", opponent: "UW-Superior",               type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "Claremont-Mudd-Scripps",   type: "Non-Conference", time: "11:00 AM ET", home: true  },
      { date: "Sep 16", day: "Wed", opponent: "St. Catherine University",  type: "MIAC",           time: "7:30 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at College of St. Scholastica", type: "MIAC",      time: "1:00 PM ET",  home: false },
      { date: "Sep 23", day: "Wed", opponent: "UW-Eau Claire",             type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Hamline University",        type: "MIAC",           time: "1:00 PM ET",  home: true  },
      { date: "Sep 29", day: "Tue", opponent: "Gustavus Adolphus",         type: "MIAC",           time: "7:30 PM ET",  home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at College of Saint Benedict", type: "MIAC",        time: "3:30 PM ET",  home: false },
      { date: "Oct 4",  day: "Sun", opponent: "Wartburg College",          type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Bethel University",      type: "MIAC",           time: "1:00 PM ET",  home: false },
      { date: "Oct 14", day: "Wed", opponent: "Concordia College (MN)",    type: "MIAC",           time: "7:30 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "St. Olaf College",          type: "MIAC",           time: "1:00 PM ET",  home: true  },
      { date: "Oct 20", day: "Tue", opponent: "at Carleton College",       type: "MIAC",           time: "4:00 PM ET",  home: false },
      { date: "Oct 24", day: "Sat", opponent: "Saint Mary's (MN) — Senior Day", type: "MIAC",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 30", day: "Fri", opponent: "at Augsburg University",    type: "MIAC",           time: "5:00 PM ET",  home: false },
      { date: "Nov 3",  day: "Tue", opponent: "MIAC Playoffs",             type: "MIAC Tournament",time: "TBA",      home: false },
      { date: "Nov 7",  day: "Sat", opponent: "MIAC Playoffs",             type: "MIAC Tournament",time: "TBA",      home: false },
    ]
  },
  "Pennsylvania": {
    fullName: "Penn Quakers", location: "Philadelphia, PA", stadium: "Rhodes Field",
    sourceUrl: "https://pennathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 5-4-6 (1-3-3 Ivy League, 6th) · Did not qualify for Ivy League Tournament",
    notes: "Home games at Rhodes Field. Ivy League and select home games on ESPN+. Ivy Tournament Nov 12 & 15.",
    games: [
      { date: "Aug 20", day: "Thu", opponent: "at George Mason",    type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Aug 23", day: "Sun", opponent: "FDU",               type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Aug 27", day: "Thu", opponent: "George Washington",  type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Stony Brook",    type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 3",  day: "Thu", opponent: "at Villanova",      type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 10", day: "Thu", opponent: "Saint Joseph's",    type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at Towson ⚡",      type: "Non-Conference", time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Sep 16", day: "Wed", opponent: "Jefferson",         type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at St. John's",     type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Dartmouth ⚡",   type: "Ivy League",     time: "3:00 PM ET",  home: false, arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "Brown",             type: "Ivy League",     time: "7:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Princeton",      type: "Ivy League",     time: "7:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "Columbia",          type: "Ivy League",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Cornell",        type: "Ivy League",     time: "1:00 PM ET",  home: false },
      { date: "Oct 31", day: "Sat", opponent: "Harvard ⚡",        type: "Ivy League",     time: "4:00 PM ET",  home: true,  arlington: true },
      { date: "Nov 7",  day: "Sat", opponent: "at Yale",           type: "Ivy League",     time: "6:00 PM ET",  home: false },
    ]
  },
  "Old Dominion": {
    fullName: "Old Dominion Monarchs", location: "Norfolk, VA", stadium: "ODU Soccer Stadium",
    sourceUrl: "https://odusports.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 10-2-4 (6-1-3 Sun Belt) · Sun Belt East Division Champions · Lost SBC Semifinals to ULM 3-2",
    notes: "Home games at ODU Soccer Stadium, Norfolk. Sun Belt Championship in Foley, AL. ESPN+.",
    games: [
      { date: "Aug 6",  day: "Thu", opponent: "Hampton (Exh.)",      type: "Exhibition",     time: "7:00 PM ET",  home: true  },
      { date: "Aug 9",  day: "Sun", opponent: "Blue/White (Exh.)",   type: "Exhibition",     time: "6:00 PM ET",  home: true  },
      { date: "Aug 13", day: "Thu", opponent: "at Virginia Tech",    type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Aug 16", day: "Sun", opponent: "Springfield College", type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Aug 20", day: "Thu", opponent: "at UNCW",             type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Aug 23", day: "Sun", opponent: "at Wake Forest",      type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Aug 27", day: "Thu", opponent: "Duke",                type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "at Maryland",         type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 13", day: "Sun", opponent: "at Liberty",          type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 18", day: "Fri", opponent: "at ULM",              type: "Sun Belt",       time: "8:00 PM ET",  home: false },
      { date: "Sep 24", day: "Thu", opponent: "Louisiana",           type: "Sun Belt",       time: "TBA",      home: true  },
      { date: "Sep 27", day: "Sun", opponent: "at App State",        type: "Sun Belt",       time: "1:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "South Alabama",       type: "Sun Belt",       time: "6:00 PM ET",  home: true  },
      { date: "Oct 8",  day: "Thu", opponent: "Marshall",            type: "Sun Belt",       time: "6:00 PM ET",  home: true  },
      { date: "Oct 11", day: "Sun", opponent: "at JMU",              type: "Sun Belt",       time: "6:00 PM ET",  home: false },
      { date: "Oct 18", day: "Sun", opponent: "Georgia Southern",    type: "Sun Belt",       time: "1:00 PM ET",  home: true  },
      { date: "Oct 22", day: "Thu", opponent: "at LA Tech",          type: "Sun Belt",       time: "8:00 PM ET",  home: false },
      { date: "Oct 25", day: "Sun", opponent: "Coastal Carolina",    type: "Sun Belt",       time: "1:00 PM ET",  home: true  },
      { date: "Nov 1",  day: "Sun", opponent: "at Georgia State",    type: "Sun Belt",       time: "5:00 PM ET",  home: false },
    ]
  },
  "Union College": {
    fullName: "Union Garnet Chargers", location: "Schenectady, NY", stadium: "College Park Field",
    sourceUrl: "https://unionathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, Liberty League",
    notes: "Home games at College Park Field, Schenectady NY. All home games stream free on unionathletics.com. Liberty League Tournament at higher seeds Nov 3–8.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at WPI",                    type: "Non-Conference",      time: "4:00 PM ET", home: false },
      { date: "Sep 5",  day: "Sat", opponent: "at Babson",                 type: "Non-Conference",      time: "1:00 PM ET", home: false },
      { date: "Sep 8",  day: "Tue", opponent: "Middlebury",                type: "Non-Conference",      time: "5:00 PM ET", home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Misericordia",              type: "Non-Conference",      time: "2:00 PM ET", home: true  },
      { date: "Sep 15", day: "Tue", opponent: "at Smith College",          type: "Non-Conference",      time: "4:00 PM ET", home: false },
      { date: "Sep 19", day: "Sat", opponent: "at SUNY Oneonta",           type: "Non-Conference",      time: "1:00 PM ET", home: false },
      { date: "Sep 23", day: "Wed", opponent: "at Eastern Connecticut",    type: "Non-Conference",      time: "5:00 PM ET", home: false },
      { date: "Sep 26", day: "Sat", opponent: "Clarkson",                  type: "Liberty League",      time: "2:00 PM ET", home: true  },
      { date: "Sep 30", day: "Wed", opponent: "at Bard",                   type: "Liberty League",      time: "7:00 PM ET", home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at RPI",                   type: "Liberty League",      time: "2:00 PM ET", home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Vassar",                    type: "Liberty League",      time: "7:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at RIT",                   type: "Liberty League",      time: "2:00 PM ET", home: false },
      { date: "Oct 13", day: "Tue", opponent: "Hamilton",                  type: "Non-Conference",      time: "4:00 PM ET", home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Ithaca",                    type: "Liberty League",      time: "2:00 PM ET", home: true  },
      { date: "Oct 21", day: "Wed", opponent: "Skidmore",                  type: "Liberty League",      time: "4:00 PM ET", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "William Smith (Homecoming)", type: "Liberty League",     time: "2:00 PM ET", home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at St. Lawrence",           type: "Liberty League",      time: "TBA",     home: false },
      { date: "Nov 3",  day: "Tue", opponent: "LL First Round",            type: "Liberty League Tournament", time: "TBA", home: false },
      { date: "Nov 6",  day: "Fri", opponent: "LL Semifinals",             type: "Liberty League Tournament", time: "TBA", home: false },
      { date: "Nov 8",  day: "Sun", opponent: "LL Championship",           type: "Liberty League Tournament", time: "TBA", home: false },
    ]
  },

  // ── 2024 Class Schools ────────────────────────────────────────────────────
  "Howard": {
    fullName: "Howard Bison", location: "Washington, DC", stadium: "Greene Stadium",
    sourceUrl: "https://hubison.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 9-6-3 (7-2-2 NEC, #3 seed) · Northeast Conference (NEC) · Lost NEC Tournament SF to Wagner",
    notes: "Home games at Greene Stadium, Washington DC. NEC games on NEC Front Row. Note: Howard plays soccer in the NEC, not MEAC.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "American (Exh.)",           type: "Exhibition",     time: "TBD",      home: true  },
      { date: "Aug 9",  day: "Sun", opponent: "at Towson (Exh.)",          type: "Exhibition",     time: "6:00 PM ET",  home: false },
      { date: "Aug 19", day: "Wed", opponent: "George Washington",         type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Aug 22", day: "Sat", opponent: "Hampton ⚡",                type: "Non-Conference", time: "3:00 PM ET",  home: false, neutral: "Audi Field, Washington DC", arlington: true },
      { date: "Aug 27", day: "Thu", opponent: "at Florida Atlantic",       type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Aug 30", day: "Sun", opponent: "at FIU",                    type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at La Salle",               type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 13", day: "Sun", opponent: "at Richmond ⚡",            type: "Non-Conference", time: "3:00 PM ET",  home: false, arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at New Haven",              type: "NEC",            time: "1:00 PM ET",  home: false },
      { date: "Sep 27", day: "Sun", opponent: "at Wagner",                 type: "NEC",            time: "1:00 PM ET",  home: false },
      { date: "Oct 1",  day: "Thu", opponent: "Central Connecticut State", type: "NEC",            time: "1:00 PM ET",  home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "at Delaware State",         type: "NEC",            time: "5:00 PM ET",  home: false },
      { date: "Oct 11", day: "Sun", opponent: "Le Moyne College",          type: "NEC",            time: "TBD",      home: true  },
      { date: "Oct 18", day: "Sun", opponent: "at LIU",                    type: "NEC",            time: "TBD",      home: false },
      { date: "Oct 22", day: "Thu", opponent: "FDU",                       type: "NEC",            time: "TBD",      home: true  },
      { date: "Oct 25", day: "Sun", opponent: "at Stonehill College",      type: "NEC",            time: "1:00 PM ET",  home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Chicago State",             type: "NEC",            time: "TBD",      home: true  },
      { date: "Nov 8",  day: "Sun", opponent: "Mercyhurst (Senior Day)",   type: "NEC",            time: "1:00 PM ET",  home: true  },
      { date: "Nov 12", day: "Thu", opponent: "NEC Semifinals",            type: "NEC Tournament", time: "TBD",      home: false },
      { date: "Nov 15", day: "Sun", opponent: "NEC Championship",          type: "NEC Tournament", time: "TBD",      home: false },
    ]
  },
  "Franklin & Marshall": {
    fullName: "Franklin & Marshall Diplomats", location: "Lancaster, PA", stadium: "Tylus Field (Kenny Gramas '88 Pavilion)",
    sourceUrl: "https://godiplomats.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, Centennial Semifinalists (lost to Swarthmore 1-0)",
    notes: "Home games at Tylus Field, Lancaster PA. All home games stream free on centennialconference.tv/godiplomats.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at Elizabethtown",          type: "Non-Conference",        time: "7:30 PM ET",  home: false },
      { date: "Sep 4",  day: "Fri", opponent: "at St. Mary's (MD)",        type: "Non-Conference",        time: "4:00 PM ET",  home: false },
      { date: "Sep 9",  day: "Wed", opponent: "York (PA)",                 type: "Non-Conference",        time: "4:30 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Eastern University",     type: "Non-Conference",        time: "4:30 PM ET",  home: false },
      { date: "Sep 16", day: "Wed", opponent: "Arcadia",                   type: "Non-Conference",        time: "7:00 PM ET",  home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at Muhlenberg",             type: "Centennial",            time: "4:00 PM ET",  home: false },
      { date: "Sep 23", day: "Wed", opponent: "Washington College",        type: "Centennial",            time: "7:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Swarthmore ⚡",             type: "Centennial",            time: "12:00 PM ET", home: true,  arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "at Dickinson",              type: "Centennial",            time: "3:30 PM ET",  home: false },
      { date: "Oct 7",  day: "Wed", opponent: "at McDaniel",               type: "Centennial",            time: "4:00 PM ET",  home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Penn State Harrisburg",  type: "Non-Conference",        time: "2:00 PM ET",  home: false },
      { date: "Oct 14", day: "Wed", opponent: "Gettysburg",                type: "Centennial",            time: "7:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at Johns Hopkins ⚡",       type: "Centennial",            time: "4:00 PM ET",  home: false, arlington: true },
      { date: "Oct 24", day: "Sat", opponent: "at Haverford",              type: "Centennial",            time: "12:00 PM ET", home: false },
      { date: "Oct 28", day: "Wed", opponent: "Ursinus",                   type: "Centennial",            time: "4:30 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Bryn Mawr",                 type: "Centennial",            time: "3:00 PM ET",  home: true  },
      { date: "Nov 3",  day: "Tue", opponent: "CC First Round",            type: "Centennial Tournament", time: "TBA",      home: false },
      { date: "Nov 6",  day: "Fri", opponent: "CC Semifinal",              type: "Centennial Tournament", time: "TBA",      home: false },
      { date: "Nov 8",  day: "Sun", opponent: "CC Championship",           type: "Centennial Tournament", time: "TBA",      home: false },
    ]
  },
  "Johns Hopkins": {
    fullName: "Johns Hopkins Blue Jays", location: "Baltimore, MD", stadium: "Homewood Field",
    sourceUrl: "https://hopkinssports.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, Centennial Conference · 2022 NCAA D3 National Champions",
    notes: "Home games at Homewood Field. All home games stream on centennialconference.tv/hopkinssports.",
    games: [
      { date: "Aug 25", day: "Tue", opponent: "Stevens (Scrimmage)",    type: "Exhibition",     time: "5:00 PM ET", home: true  },
      { date: "Aug 28", day: "Fri", opponent: "at NYU (Scrimmage)",     type: "Exhibition",     time: "6:00 PM ET", home: false },
      { date: "Sep 1",  day: "Tue", opponent: "Catholic",               type: "Non-Conference", time: "7:00 PM ET", home: true  },
      { date: "Sep 5",  day: "Sat", opponent: "Shenandoah",             type: "Non-Conference", time: "4:00 PM ET", home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "at Messiah",             type: "Non-Conference", time: "TBA",     home: false },
      { date: "Sep 12", day: "Sat", opponent: "at Denison ⚡",          type: "Non-Conference", time: "12:00 PM ET", home: false, arlington: true },
      { date: "Sep 13", day: "Sun", opponent: "at Kenyon",              type: "Non-Conference", time: "1:30 PM ET", home: false },
      { date: "Sep 16", day: "Wed", opponent: "Penn State Harrisburg",  type: "Non-Conference", time: "4:00 PM ET", home: true  },
      { date: "Sep 19", day: "Sat", opponent: "at Swarthmore ⚡",       type: "Centennial",     time: "1:00 PM ET", home: false, arlington: true },
      { date: "Sep 23", day: "Wed", opponent: "McDaniel",               type: "Centennial",     time: "4:00 PM ET", home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Haverford",              type: "Centennial",     time: "4:00 PM ET", home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Bryn Mawr",           type: "Centennial",     time: "1:00 PM ET", home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Gettysburg",             type: "Centennial",     time: "7:00 PM ET", home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Washington College",  type: "Centennial",     time: "TBA",     home: false },
      { date: "Oct 17", day: "Sat", opponent: "Franklin & Marshall ⚡", type: "Centennial",     time: "4:00 PM ET", home: true,  arlington: true },
      { date: "Oct 24", day: "Sat", opponent: "at Muhlenberg",          type: "Centennial",     time: "TBA",     home: false },
      { date: "Oct 28", day: "Wed", opponent: "at Dickinson",           type: "Centennial",     time: "6:00 PM ET", home: false },
      { date: "Oct 31", day: "Sat", opponent: "Ursinus",                type: "Centennial",     time: "5:00 PM ET", home: true  },
    ]
  },
  "Dartmouth": {
    fullName: "Dartmouth Big Green", location: "Hanover, NH", stadium: "Burnham Field",
    sourceUrl: "https://dartmouthsports.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 11-4-4 · Won 2025 Ivy League Tournament · NCAA D1, Ivy League",
    notes: "Home games at Burnham Field, Hanover NH. Ivy League games on ESPN+. No kick-off times listed yet.",
    games: [
      { date: "Aug 20", day: "Thu", opponent: "UMass Lowell",        type: "Non-Conference", time: "TBA", home: true  },
      { date: "Aug 23", day: "Sun", opponent: "at New Hampshire",    type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 27", day: "Thu", opponent: "San Francisco",       type: "Non-Conference", time: "TBA", home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Boston College",   type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "at Arizona State",    type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at Arizona",          type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 10", day: "Thu", opponent: "Holy Cross",          type: "Non-Conference", time: "TBA", home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at Colgate",          type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 20", day: "Sun", opponent: "Bryant",              type: "Non-Conference", time: "TBA", home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Penn",                type: "Non-Conference", time: "TBA", home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Columbia",         type: "Ivy League",     time: "TBA", home: false },
      { date: "Oct 10", day: "Sat", opponent: "Harvard",             type: "Ivy League",     time: "TBA", home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Brown",               type: "Ivy League",     time: "TBA", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at Princeton",        type: "Ivy League",     time: "TBA", home: false },
      { date: "Oct 31", day: "Sat", opponent: "Yale",                type: "Ivy League",     time: "TBA", home: true  },
      { date: "Nov 7",  day: "Sat", opponent: "at Cornell",          type: "Ivy League",     time: "TBA", home: false },
    ]
  },
  "Case Western Reserve": {
    fullName: "Case Western Reserve Spartans", location: "Cleveland, OH", stadium: "DiSanto Field",
    sourceUrl: "https://athletics.case.edu/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, UAA",
    notes: "Home games at DiSanto Field, Cleveland. Home games stream on FloSports (flosports.link/4lOFKPc). Away UAA games also on FloSports.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "John Carroll",        type: "Non-Conference", time: "5:00 PM ET",  home: true  },
      { date: "Sep 4",  day: "Fri", opponent: "Pacific Lutheran",    type: "Non-Conference", time: "3:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Capital",             type: "Non-Conference", time: "12:00 PM ET", home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "at Baldwin Wallace",  type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 12", day: "Sat", opponent: "Grove City",          type: "Non-Conference", time: "2:30 PM ET",  home: true  },
      { date: "Sep 18", day: "Fri", opponent: "at Hope",             type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Calvin",           type: "Non-Conference", time: "4:30 PM ET",  home: false },
      { date: "Sep 23", day: "Wed", opponent: "at Penn St. Behrend", type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Denison ⚡",       type: "Non-Conference", time: "12:00 PM ET", home: false, arlington: true },
      { date: "Sep 29", day: "Tue", opponent: "Heidelberg",          type: "Non-Conference", time: "7:30 PM ET",  home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Rochester",        type: "UAA",            time: "7:30 PM ET",  home: false },
      { date: "Oct 10", day: "Sat", opponent: "at WashU",            type: "UAA",            time: "1:30 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "UChicago",            type: "UAA",            time: "1:30 PM ET",  home: true  },
      { date: "Oct 23", day: "Fri", opponent: "Brandeis",            type: "UAA",            time: "7:30 PM ET",  home: true  },
      { date: "Oct 25", day: "Sun", opponent: "NYU",                 type: "UAA",            time: "1:30 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at Emory ⚡",         type: "UAA",            time: "1:30 PM ET",  home: false, arlington: true },
      { date: "Nov 7",  day: "Sat", opponent: "Carnegie Mellon ⚡",  type: "UAA",            time: "3:30 PM ET",  home: true,  arlington: true },
    ]
  },
  "Maryland": {
    fullName: "Maryland Terrapins", location: "College Park, MD", stadium: "Ludwig Field",
    sourceUrl: "https://umterps.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D1, Big Ten · 3 straight shutouts to open season",
    notes: "Home games at Ludwig Field. 9 home matches. Big Ten games on BTN/B1G+/ESPN+. Times TBA.",
    games: [
      { date: "Aug 16", day: "Sun", opponent: "Fordham",             type: "Non-Conference", time: "TBA", home: true  },
      { date: "Aug 20", day: "Thu", opponent: "Farleigh Dickinson",  type: "Non-Conference", time: "TBA", home: true  },
      { date: "Aug 23", day: "Sun", opponent: "at Virginia Tech",    type: "Non-Conference", time: "TBA", home: false },
      { date: "Aug 27", day: "Thu", opponent: "at Navy",             type: "Non-Conference", time: "TBA", home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Old Dominion",        type: "Non-Conference", time: "TBA", home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Binghamton",          type: "Non-Conference", time: "TBA", home: true  },
      { date: "Sep 10", day: "Thu", opponent: "at Washington",       type: "Big Ten",        time: "TBA", home: false },
      { date: "Sep 13", day: "Sun", opponent: "at Oregon",           type: "Big Ten",        time: "TBA", home: false },
      { date: "Sep 18", day: "Fri", opponent: "Penn State",          type: "Big Ten",        time: "TBA", home: true  },
      { date: "Sep 24", day: "Thu", opponent: "Wisconsin",           type: "Big Ten",        time: "TBA", home: true  },
      { date: "Sep 27", day: "Sun", opponent: "UCLA",                type: "Big Ten",        time: "TBA", home: true  },
      { date: "Oct 2",  day: "Fri", opponent: "at Minnesota",        type: "Big Ten",        time: "TBA", home: false },
      { date: "Oct 8",  day: "Thu", opponent: "Nebraska",            type: "Big Ten",        time: "TBA", home: true  },
      { date: "Oct 11", day: "Sun", opponent: "Northwestern ⚡",     type: "Big Ten",        time: "TBA", home: true,  arlington: true },
      { date: "Oct 16", day: "Fri", opponent: "Iowa",                type: "Big Ten",        time: "TBA", home: true  },
      { date: "Oct 22", day: "Thu", opponent: "at Michigan",         type: "Big Ten",        time: "TBA", home: false },
      { date: "Oct 25", day: "Sun", opponent: "at Michigan State",   type: "Big Ten",        time: "TBA", home: false },
      { date: "Oct 30", day: "Fri", opponent: "at Rutgers",          type: "Big Ten",        time: "TBA", home: false },
    ]
  },
  "Bates College": {
    fullName: "Bates Bobcats", location: "Lewiston, ME", stadium: "Russell Street Track and Field",
    sourceUrl: "https://gobatesbobcats.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NESCAC",
    notes: "All home games at Russell Street Track and Field. All games stream free at nsnsports.net/colleges/bates.",
    games: [
      { date: "Sep 5",  day: "Sat", opponent: "at Williams ⚡",            type: "NESCAC",         time: "10:00 AM ET", home: false, arlington: true },
      { date: "Sep 8",  day: "Tue", opponent: "Emmanuel",                  type: "Non-Conference", time: "6:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Hamilton",               type: "NESCAC",         time: "11:00 AM ET", home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Southern Maine",         type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 22", day: "Tue", opponent: "Husson",                    type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "at Wesleyan",               type: "NESCAC",         time: "11:00 AM ET", home: false },
      { date: "Sep 29", day: "Tue", opponent: "Bowdoin ⚡",                type: "NESCAC",         time: "7:00 PM ET",  home: true, arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "Trinity",                   type: "NESCAC",         time: "11:00 AM ET", home: true  },
      { date: "Oct 7",  day: "Wed", opponent: "at Maine Maritime",         type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Oct 10", day: "Sat", opponent: "at Connecticut College ⚡", type: "NESCAC",         time: "11:00 AM ET", home: false, arlington: true },
      { date: "Oct 12", day: "Mon", opponent: "Maine-Farmington",          type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Tufts",                     type: "NESCAC",         time: "12:00 PM ET", home: true  },
      { date: "Oct 18", day: "Sun", opponent: "Amherst",                   type: "NESCAC",         time: "12:00 PM ET", home: true  },
      { date: "Oct 24", day: "Sat", opponent: "Middlebury",                type: "NESCAC",         time: "11:00 AM ET", home: true  },
      { date: "Oct 27", day: "Tue", opponent: "at Colby",                  type: "NESCAC",         time: "7:00 PM ET",  home: false },
    ]
  },
  "Georgetown": {
    fullName: "Georgetown Hoyas", location: "Washington, DC", stadium: "Shaw Field",
    sourceUrl: "https://guhoyas.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Ranked 10th nationally · NCAA Tournament Round of 16 · 14 consecutive NCAA Tournament appearances",
    notes: "Home games at Shaw Field. 9 home matches. Big East games on FOX/FS1/FloSports. Sep 10 at Delaware ⚡ cross-Arlington matchup.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at Penn State (Exh.)",  type: "Exhibition",     time: "TBA",      home: false },
      { date: "Aug 8",  day: "Sat", opponent: "at Rutgers (Exh.)",     type: "Exhibition",     time: "TBA",      home: false },
      { date: "Aug 13", day: "Thu", opponent: "Fordham",               type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Aug 20", day: "Thu", opponent: "at Stanford",           type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Aug 23", day: "Sun", opponent: "at Saint Mary's",       type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Aug 30", day: "Sun", opponent: "Longwood",           type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "at James Madison",      type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "Virginia",              type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 10", day: "Thu", opponent: "at Delaware ⚡",        type: "Non-Conference", time: "7:00 PM ET",  home: false, arlington: true },
      { date: "Sep 16", day: "Tue", opponent: "George Washington",     type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Xavier",                type: "Big East",       time: "7:00 PM ET",  home: true  },
      { date: "Sep 30", day: "Wed", opponent: "Marquette",             type: "Big East",       time: "7:00 PM ET",  home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Villanova",          type: "Big East",       time: "4:00 PM ET",  home: false },
      { date: "Oct 7",  day: "Wed", opponent: "at Providence",         type: "Big East",       time: "6:00 PM ET",  home: false },
      { date: "Oct 10", day: "Sat", opponent: "St. John's",            type: "Big East",       time: "7:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at Butler",             type: "Big East",       time: "7:00 PM ET",  home: false },
      { date: "Oct 21", day: "Wed", opponent: "at DePaul",             type: "Big East",       time: "2:00 PM ET",  home: false },
      { date: "Oct 24", day: "Sat", opponent: "Seton Hall",            type: "Big East",       time: "7:00 PM ET",  home: true  },
      { date: "Oct 28", day: "Wed", opponent: "Creighton",             type: "Big East",       time: "7:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at UConn",              type: "Big East",       time: "7:00 PM ET",  home: false },
    ]
  },
  "Connecticut College": {
    fullName: "Connecticut College Camels", location: "New London, CT", stadium: "Freeman Field",
    sourceUrl: "https://camelathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NESCAC",
    notes: "Home games at Freeman Field (and Silfen Field & Track for Oct 21). All games stream free at nsnsports.net/colleges/connecticut-college.",
    games: [
      { date: "Sep 5",  day: "Sat", opponent: "at Amherst",              type: "NESCAC",         time: "TBA",      home: false },
      { date: "Sep 7",  day: "Mon", opponent: "Salve Regina",            type: "Non-Conference", time: "4:30 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Middlebury",           type: "NESCAC",         time: "11:00 AM ET", home: false },
      { date: "Sep 19", day: "Sat", opponent: "at Tufts",               type: "NESCAC",         time: "TBA",      home: false },
      { date: "Sep 20", day: "Sun", opponent: "at Colby",               type: "NESCAC",         time: "TBA",      home: false },
      { date: "Sep 23", day: "Wed", opponent: "Coast Guard",            type: "Non-Conference", time: "4:30 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Hamilton",               type: "NESCAC",         time: "11:00 AM ET", home: true  },
      { date: "Sep 30", day: "Wed", opponent: "at Johnson & Wales",     type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Williams ⚡",         type: "NESCAC",         time: "TBA",      home: false, arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "Bates ⚡",               type: "NESCAC",         time: "11:00 AM ET", home: true,  arlington: true },
      { date: "Oct 14", day: "Wed", opponent: "at Emmanuel",            type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Oct 17", day: "Sat", opponent: "at Bridgewater State",   type: "Non-Conference", time: "3:30 PM ET",  home: false },
      { date: "Oct 21", day: "Wed", opponent: "Trinity",                type: "NESCAC",         time: "7:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "Bowdoin ⚡",             type: "NESCAC",         time: "11:00 AM ET", home: true,  arlington: true },
      { date: "Oct 27", day: "Tue", opponent: "Wesleyan",               type: "NESCAC",         time: "4:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "NESCAC QF",              type: "NESCAC Tournament", time: "TBA",   home: false },
      { date: "Nov 7",  day: "Sat", opponent: "NESCAC SF",              type: "NESCAC Tournament", time: "TBA",   home: false },
      { date: "Nov 8",  day: "Sun", opponent: "NESCAC Final",           type: "NESCAC Tournament", time: "TBA",   home: false },
    ]
  },
  "Denver": {
    fullName: "Denver Pioneers", location: "Denver, CO", stadium: "University of Denver Soccer Stadium",
    sourceUrl: "https://denverpioneers.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 9-4-4 (6-1-1 Summit League) · Summit League Regular Season Co-Champions · #2 seed in Summit Tournament",
    notes: "⚠️ Denver joins the West Coast Conference (WCC) in 2026-27 — this is their first WCC season. Home games at DU Soccer Stadium, Denver CO. All times MT. WCC games on ESPN+.",
    games: [
      { date: "Aug 9",  day: "Sun", opponent: "at Wyoming (Exh.)",   type: "Exhibition",     time: "3:00 PM ET",  home: false },
      { date: "Aug 13", day: "Thu", opponent: "at Northern Colorado", type: "Non-Conference", time: "TBA",         home: false },
      { date: "Aug 16", day: "Sun", opponent: "at Colorado State",    type: "Non-Conference", time: "TBA",         home: false },
      { date: "Aug 20", day: "Thu", opponent: "at DePaul",            type: "Non-Conference", time: "TBA",         home: false },
      { date: "Aug 23", day: "Sun", opponent: "at Northwestern ⚡",   type: "Non-Conference", time: "TBA",         home: false, arlington: true },
      { date: "Aug 27", day: "Thu", opponent: "Colorado College",     type: "Non-Conference", time: "9:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Montana",              type: "Non-Conference", time: "3:00 PM ET",  home: true  },
      { date: "Sep 11", day: "Fri", opponent: "at Colorado",          type: "Non-Conference", time: "9:00 PM ET",  home: false },
      { date: "Sep 17", day: "Thu", opponent: "Air Force",            type: "Non-Conference", time: "9:00 PM ET",  home: true  },
      { date: "Sep 26", day: "Sat", opponent: "Saint Mary's (CA)",    type: "WCC",            time: "9:00 PM ET",  home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Santa Clara",       type: "WCC",            time: "TBA",         home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Pepperdine",           type: "WCC",            time: "9:00 PM ET",  home: true  },
      { date: "Oct 11", day: "Sun", opponent: "at San Diego",         type: "WCC",            time: "TBA",         home: false },
      { date: "Oct 17", day: "Sat", opponent: "Portland",             type: "WCC",            time: "3:00 PM ET",  home: true  },
      { date: "Oct 24", day: "Sat", opponent: "at San Francisco",     type: "WCC",            time: "TBA",         home: false },
      { date: "Oct 28", day: "Wed", opponent: "at LMU",               type: "WCC",            time: "TBA",         home: false },
      { date: "Oct 31", day: "Sat", opponent: "Pacific",              type: "WCC",            time: "5:00 PM ET",  home: true  },
      { date: "Nov 7",  day: "Sat", opponent: "at Seattle",           type: "WCC",            time: "TBA",         home: false },
      { date: "Nov 11", day: "Wed", opponent: "WCC Tournament",       type: "WCC Tournament", time: "TBA",         home: false },
      { date: "Nov 14", day: "Sat", opponent: "WCC Tournament Final", type: "WCC Tournament", time: "TBA",         home: false },
    ]
  },
  "Swarthmore": {
    fullName: "Swarthmore Garnet", location: "Swarthmore, PA", stadium: "Clothier Field Stadium",
    sourceUrl: "https://swarthmoreathletics.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: 15-3-5 (9-0-1 Centennial, #1 seed) · Centennial Conference Runner-Up · Lost to Johns Hopkins in Centennial Final",
    notes: "Home games at Clothier Field Stadium. All home games stream free on centennialconference.tv/swarthmoreathletics.",
    games: [
      { date: "Sep 4",  day: "Fri", opponent: "Skidmore College",              type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Sep 5",  day: "Sat", opponent: "King's College (PA)",           type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "Rowan University",              type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at College of New Jersey",      type: "Non-Conference", time: "12:00 PM ET", home: false },
      { date: "Sep 14", day: "Mon", opponent: "at Lancaster Bible College",    type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "Johns Hopkins ⚡",              type: "Centennial",     time: "1:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 23", day: "Wed", opponent: "at Bryn Mawr College",         type: "Centennial",     time: "4:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "at Franklin & Marshall ⚡",     type: "Centennial",     time: "12:00 PM ET", home: false, arlington: true },
      { date: "Oct 3",  day: "Sat", opponent: "at McDaniel College",          type: "Centennial",     time: "12:00 PM ET", home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Muhlenberg College",           type: "Centennial",     time: "7:00 PM ET",  home: true  },
      { date: "Oct 10", day: "Sat", opponent: "Ursinus College",              type: "Centennial",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 14", day: "Wed", opponent: "at Dickinson College",         type: "Centennial",     time: "6:00 PM ET",  home: false },
      { date: "Oct 24", day: "Sat", opponent: "at Gettysburg College",        type: "Centennial",     time: "4:00 PM ET",  home: false },
      { date: "Oct 27", day: "Tue", opponent: "Washington College (MD)",      type: "Centennial",     time: "7:00 PM ET",  home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Haverford College",            type: "Centennial",     time: "4:00 PM ET",  home: true  },
    ]
  },
  "Bowdoin": {
    fullName: "Bowdoin Polar Bears", location: "Brunswick, ME", stadium: "Whittier Field",
    sourceUrl: "https://athletics.bowdoin.edu/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NESCAC",
    notes: "All home games at Whittier Field, Brunswick ME. All games stream free.",
    games: [
      { date: "Sep 4",  day: "Fri", opponent: "Colby",                      type: "NESCAC",         time: "7:30 PM ET",  home: true  },
      { date: "Sep 9",  day: "Wed", opponent: "Saint Joseph's (Maine)",      type: "Non-Conference", time: "7:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "at Amherst",                  type: "NESCAC",         time: "12:00 PM ET", home: false },
      { date: "Sep 15", day: "Tue", opponent: "at UNew England",             type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "Wesleyan",                    type: "NESCAC",         time: "12:30 PM ET", home: true  },
      { date: "Sep 20", day: "Sun", opponent: "Williams ⚡",                 type: "NESCAC",         time: "2:00 PM ET",  home: true, arlington: true },
      { date: "Sep 23", day: "Wed", opponent: "at Emerson",                  type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 26", day: "Sat", opponent: "Middlebury",                  type: "NESCAC",         time: "12:00 PM ET", home: true  },
      { date: "Sep 29", day: "Tue", opponent: "at Bates ⚡",                 type: "NESCAC",         time: "7:00 PM ET",  home: false, arlington: true },
      { date: "Oct 4",  day: "Sun", opponent: "Batten University ⚡",        type: "Non-Conference", time: "3:00 PM ET",  home: false, neutral: "Arlington, VA", arlington: true },
      { date: "Oct 10", day: "Sat", opponent: "at Trinity",                  type: "NESCAC",         time: "11:00 AM ET", home: false },
      { date: "Oct 17", day: "Sat", opponent: "Hamilton",                    type: "NESCAC",         time: "12:00 PM ET", home: true  },
      { date: "Oct 21", day: "Wed", opponent: "at Southern Maine",           type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Oct 24", day: "Sat", opponent: "at Connecticut College ⚡",   type: "NESCAC",         time: "TBD",      home: false, arlington: true },
      { date: "Oct 27", day: "Tue", opponent: "Tufts",                       type: "NESCAC",         time: "6:00 PM ET",  home: true  },
    ]
  },
  "Wellesley": {
    fullName: "Wellesley Blue", location: "Wellesley, MA", stadium: "Wellesley Athletic Fields",
    sourceUrl: "https://wellesleyblue.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D3, NEWMAC",
    notes: "Home games at Wellesley campus fields, Wellesley MA. All home games stream free. NEWMAC Championship Nov 3-7. Solveig Unteroberdoerster '24 on roster.",
    games: [
      { date: "Sep 1",  day: "Tue", opponent: "at Simmons University",      type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 5",  day: "Sat", opponent: "at Endicott College",        type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at Worcester State",         type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 9",  day: "Wed", opponent: "UMass Boston (Home Opener)", type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Sep 12", day: "Sat", opponent: "Mass Maritime Academy",      type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 16", day: "Wed", opponent: "Brandeis University",        type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 19", day: "Sat", opponent: "Coast Guard Academy",        type: "NEWMAC",         time: "TBA",      home: true  },
      { date: "Sep 23", day: "Wed", opponent: "University of Hartford",     type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 26", day: "Sat", opponent: "at MIT",                    type: "NEWMAC",         time: "TBA",      home: false },
      { date: "Oct 3",  day: "Sat", opponent: "at Smith College",          type: "NEWMAC",         time: "TBA",      home: false },
      { date: "Oct 7",  day: "Wed", opponent: "Emerson College",           type: "NEWMAC",         time: "TBA",      home: true  },
      { date: "Oct 10", day: "Sat", opponent: "at Wheaton College",        type: "NEWMAC",         time: "TBA",      home: false },
      { date: "Oct 14", day: "Wed", opponent: "WPI (#Earn The W Day)",     type: "NEWMAC",         time: "3:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "Salve Regina University",   type: "NEWMAC",         time: "TBA",      home: true  },
      { date: "Oct 21", day: "Wed", opponent: "at Springfield College",    type: "NEWMAC",         time: "TBA",      home: false },
      { date: "Oct 24", day: "Sat", opponent: "Clark University (Senior Day)", type: "NEWMAC",     time: "1:00 PM ET",  home: true  },
      { date: "Oct 28", day: "Tue", opponent: "Babson College",            type: "NEWMAC",         time: "TBA",      home: true  },
      { date: "Oct 31", day: "Sat", opponent: "at Mount Holyoke",         type: "NEWMAC",         time: "TBA",      home: false },
      { date: "Nov 3",  day: "Tue", opponent: "NEWMAC Championship",      type: "NEWMAC Tournament", time: "TBA",    home: false },
      { date: "Nov 7",  day: "Sat", opponent: "NEWMAC Championship Final",type: "NEWMAC Tournament", time: "TBA",    home: false },
    ]
  },

  // ── 2023 Class Schools ────────────────────────────────────────────────────
  "Purdue": {
    fullName: "Purdue Boilermakers", location: "West Lafayette, IN", stadium: "Folk Field",
    sourceUrl: "https://purduesports.com/sports/soccer/schedule", status: "confirmed",
    record2025: "2025: Season record TBA · Did not qualify for 2025 Big Ten Tournament · Phoebe Carver '23 transferred from USC",
    notes: "Home games at Folk Field, West Lafayette IN. Big Ten games on BTN/Peacock/ESPN+. All times EDT.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at Bowling Green",        type: "Non-Conference", time: "4:00 PM ET",   home: false },
      { date: "Aug 13", day: "Thu", opponent: "Evansville",              type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Aug 16", day: "Sun", opponent: "Purdue Fort Wayne ⚡",    type: "Non-Conference", time: "1:00 PM ET",   home: true,  arlington: true },
      { date: "Aug 20", day: "Thu", opponent: "Chicago State",           type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Aug 23", day: "Sun", opponent: "Eastern Illinois",        type: "Non-Conference", time: "1:00 PM ET",   home: true  },
      { date: "Aug 27", day: "Thu", opponent: "Ball State",              type: "Non-Conference", time: "7:00 PM ET",   home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Southern Indiana",     type: "Non-Conference", time: "2:00 PM ET",   home: false },
      { date: "Sep 3",  day: "Thu", opponent: "at Middle Tennessee",     type: "Non-Conference", time: "8:00 PM ET",   home: false },
      { date: "Sep 10", day: "Thu", opponent: "at UCLA",                 type: "Big Ten",        time: "10:00 PM ET",  home: false },
      { date: "Sep 13", day: "Sun", opponent: "at USC ⚡",               type: "Big Ten",        time: "4:00 PM ET",   home: false, arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "at Rutgers",              type: "Big Ten",        time: "1:00 PM ET",   home: false },
      { date: "Sep 24", day: "Thu", opponent: "Illinois",                type: "Big Ten",        time: "7:00 PM ET",   home: true  },
      { date: "Sep 27", day: "Sun", opponent: "Minnesota",               type: "Big Ten",        time: "1:00 PM ET",   home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Penn State",           type: "Big Ten",        time: "7:00 PM ET",   home: false },
      { date: "Oct 8",  day: "Thu", opponent: "Michigan",                type: "Big Ten",        time: "7:00 PM ET",   home: true  },
      { date: "Oct 11", day: "Sun", opponent: "Michigan State",          type: "Big Ten",        time: "1:00 PM ET",   home: true  },
      { date: "Oct 18", day: "Sun", opponent: "Ohio State",              type: "Big Ten",        time: "1:00 PM ET",   home: true  },
      { date: "Oct 22", day: "Thu", opponent: "at Indiana",              type: "Big Ten",        time: "7:00 PM ET",   home: false },
      { date: "Oct 25", day: "Sun", opponent: "at Northwestern ⚡",      type: "Big Ten",        time: "5:00 PM ET",   home: false, arlington: true },
      { date: "Oct 30", day: "Fri", opponent: "Nebraska",                type: "Big Ten",        time: "7:00 PM ET",   home: true  },
      { date: "Oct 31", day: "Sat", opponent: "Big Ten Tournament",      type: "Big Ten Tournament", time: "TBA",   home: false },
    ]
  },
  "Northwestern": {
    fullName: "Northwestern Wildcats", location: "Evanston, IL", stadium: "Northwestern Medicine Field at Martin Stadium",
    sourceUrl: "https://nusports.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: 4-2-5 (Big Ten, 7th seed) · Lost Big Ten QF to Iowa",
    notes: "Home games at Northwestern Medicine Field at Martin Stadium, Evanston IL. Big Ten games on BTN/Peacock/ESPN+.",
    games: [
      { date: "Aug 5",  day: "Wed", opponent: "at Notre Dame (Exh.)",  type: "Exhibition",     time: "TBA",      home: false },
      { date: "Aug 12", day: "Wed", opponent: "at Virginia",           type: "Non-Conference", time: "TBA",      home: false },
      { date: "Aug 20", day: "Thu", opponent: "Syracuse",              type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Aug 23", day: "Sun", opponent: "Denver ⚡",             type: "Non-Conference", time: "TBA",      home: true,  arlington: true },
      { date: "Aug 27", day: "Thu", opponent: "Illinois State",        type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Aug 30", day: "Sun", opponent: "at Butler",             type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 3",  day: "Thu", opponent: "Loyola Chicago",        type: "Non-Conference", time: "TBA",      home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "at Tennessee",          type: "Non-Conference", time: "TBA",      home: false },
      { date: "Sep 10", day: "Thu", opponent: "Michigan",              type: "Big Ten",        time: "TBA",      home: true  },
      { date: "Sep 13", day: "Sun", opponent: "at Wisconsin",          type: "Big Ten",        time: "TBA",      home: false },
      { date: "Sep 20", day: "Sun", opponent: "at Minnesota",          type: "Big Ten",        time: "TBA",      home: false },
      { date: "Sep 24", day: "Thu", opponent: "Oregon",                type: "Big Ten",        time: "TBA",      home: true  },
      { date: "Sep 27", day: "Sun", opponent: "Indiana",               type: "Big Ten",        time: "TBA",      home: true  },
      { date: "Oct 3",  day: "Sat", opponent: "at Ohio State",         type: "Big Ten",        time: "TBA",      home: false },
      { date: "Oct 8",  day: "Thu", opponent: "at Rutgers",            type: "Big Ten",        time: "TBA",      home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Maryland ⚡",        type: "Big Ten",        time: "TBA",      home: false, arlington: true },
      { date: "Oct 17", day: "Sat", opponent: "USC ⚡",                type: "Big Ten",        time: "3:00 PM ET", home: true,  arlington: true },
      { date: "Oct 22", day: "Thu", opponent: "at Illinois",           type: "Big Ten",        time: "TBA",      home: false },
      { date: "Oct 25", day: "Sun", opponent: "Purdue ⚡",             type: "Big Ten",        time: "5:00 PM ET",  home: true,  arlington: true },
      { date: "Oct 30", day: "Fri", opponent: "Michigan State",        type: "Big Ten",        time: "TBA",      home: true  },
      { date: "Nov 4",  day: "Wed", opponent: "Big Ten Tournament",    type: "Big Ten Tournament", time: "TBA",   home: false },
    ]
  },
  "Boston University": {
    fullName: "Boston University Terriers", location: "Boston, MA", stadium: "Nickerson Field",
    sourceUrl: "https://goterriers.com/sports/womens-soccer/schedule", status: "confirmed",
    record2025: "2025: Patriot League Finalists · Lost PL Championship to Army 3-2 · PL Regular Season Champions",
    notes: "All home games at Nickerson Field. Patriot League games stream on ESPN+ via patriotleague.tv.",
    games: [
      { date: "Aug 13", day: "Thu", opponent: "Northeastern",          type: "Non-Conference",          time: "6:00 PM ET",  home: true  },
      { date: "Aug 16", day: "Sun", opponent: "at UAlbany",            type: "Non-Conference",          time: "2:00 PM ET",  home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Fairfield",          type: "Non-Conference",          time: "6:00 PM ET",  home: false },
      { date: "Aug 23", day: "Sun", opponent: "at UConn",              type: "Non-Conference",          time: "7:00 PM ET",  home: false },
      { date: "Aug 30", day: "Sun", opponent: "San Francisco",         type: "Non-Conference",          time: "1:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "Harvard ⚡",            type: "Non-Conference",          time: "6:00 PM ET",  home: true, arlington: true },
      { date: "Sep 6",  day: "Sun", opponent: "Providence",            type: "Non-Conference",          time: "1:00 PM ET",  home: true  },
      { date: "Sep 10", day: "Thu", opponent: "at Boston College",     type: "Non-Conference",          time: "4:00 PM ET",  home: false },
      { date: "Sep 13", day: "Sun", opponent: "at Bryant",             type: "Non-Conference",          time: "1:00 PM ET",  home: false },
      { date: "Sep 19", day: "Sat", opponent: "Navy",                  type: "Patriot League",          time: "12:00 PM ET", home: true  },
      { date: "Sep 26", day: "Sat", opponent: "at Loyola Maryland",    type: "Patriot League",          time: "1:00 PM ET",  home: false },
      { date: "Sep 30", day: "Wed", opponent: "Army West Point",       type: "Patriot League",          time: "6:00 PM ET",  home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "at Lafayette",          type: "Patriot League",          time: "2:00 PM ET",  home: false },
      { date: "Oct 10", day: "Sat", opponent: "Bucknell",              type: "Patriot League",          time: "1:00 PM ET",  home: true  },
      { date: "Oct 17", day: "Sat", opponent: "at American ⚡",        type: "Patriot League",          time: "1:00 PM ET",  home: false, arlington: true },
      { date: "Oct 23", day: "Fri", opponent: "at Holy Cross",         type: "Patriot League",          time: "4:00 PM ET",  home: false },
      { date: "Oct 31", day: "Sat", opponent: "Lehigh ⚡",             type: "Patriot League",          time: "1:00 PM ET",  home: true, arlington: true },
      { date: "Nov 4",  day: "Wed", opponent: "at Colgate",            type: "Patriot League",          time: "6:00 PM ET",  home: false },
      { date: "Nov 8",  day: "Sun", opponent: "PL First Round",        type: "Patriot League Tournament", time: "TBA",    home: false },
      { date: "Nov 11", day: "Wed", opponent: "PL Semifinal",          type: "Patriot League Tournament", time: "TBA",    home: false },
      { date: "Nov 15", day: "Sun", opponent: "PL Final",              type: "Patriot League Tournament", time: "TBA",    home: false },
    ]
  },
  "VMI": {
    fullName: "VMI Keydets", location: "Lexington, VA", stadium: "Patchin Field",
    sourceUrl: "https://vmikeydets.com/sports/womens-soccer/schedule/2026", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D1, Southern Conference (SoCon)",
    notes: "Home games at Patchin Field, Lexington VA. SoCon games on ESPN+. Eva Torres '23 on roster.",
    games: [
      { date: "Aug 9",  day: "Sun", opponent: "Radford (Scrimmage)",       type: "Exhibition",     time: "2:00 PM ET",  home: true  },
      { date: "Aug 13", day: "Thu", opponent: "at George Mason",           type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Aug 16", day: "Sun", opponent: "at Virginia Tech",          type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Aug 20", day: "Thu", opponent: "at Winthrop",               type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Aug 27", day: "Thu", opponent: "Longwood",           type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Aug 30", day: "Sun", opponent: "Gardner-Webb",              type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 3",  day: "Thu", opponent: "Elon",                      type: "Non-Conference", time: "4:00 PM ET",  home: true  },
      { date: "Sep 6",  day: "Sun", opponent: "Navy",                      type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Sep 10", day: "Thu", opponent: "Richmond ⚡",               type: "Non-Conference", time: "4:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 13", day: "Sun", opponent: "at UNC Asheville",         type: "Non-Conference", time: "4:00 PM ET",  home: false },
      { date: "Sep 17", day: "Thu", opponent: "at The Citadel ⚡",        type: "SoCon",          time: "4:00 PM ET",  home: false, arlington: true },
      { date: "Sep 20", day: "Sun", opponent: "UNCG",                     type: "SoCon",          time: "2:00 PM ET",  home: true  },
      { date: "Sep 27", day: "Sun", opponent: "at Furman",                type: "SoCon",          time: "2:00 PM ET",  home: false },
      { date: "Oct 1",  day: "Thu", opponent: "Chattanooga",              type: "SoCon",          time: "4:00 PM ET",  home: true  },
      { date: "Oct 4",  day: "Sun", opponent: "at Tennessee Tech",        type: "SoCon",          time: "2:00 PM ET",  home: false },
      { date: "Oct 11", day: "Sun", opponent: "ETSU",                     type: "SoCon",          time: "1:00 PM ET",  home: true  },
      { date: "Oct 15", day: "Thu", opponent: "Western Carolina",         type: "SoCon",          time: "3:00 PM ET",  home: true  },
      { date: "Oct 18", day: "Sun", opponent: "at Mercer",                type: "SoCon",          time: "2:00 PM ET",  home: false },
      { date: "Oct 29", day: "Thu", opponent: "at Wofford",               type: "SoCon",          time: "6:00 PM ET",  home: false },
      { date: "Nov 1",  day: "Sun", opponent: "Samford",                  type: "SoCon",          time: "2:00 PM ET",  home: true  },
      { date: "Nov 5",  day: "Thu", opponent: "SoCon Championship",       type: "SoCon Tournament", time: "TBA",    home: false },
    ]
  },
  "Hampton": {
    fullName: "Hampton Pirates", location: "Hampton, VA", stadium: "Powhatan Field",
    sourceUrl: "https://hamptonpirates.com/sports/womens-soccer/schedule/", status: "confirmed",
    record2025: "2025: Season record TBA · NCAA D1, CAA",
    notes: "Ava Milisits '24 transferred from Richmond for 2026. Home games at Powhatan Field; W&M game at Armstrong Stadium. CAA games on FloCollege.",
    games: [
      { date: "Aug 6",  day: "Thu", opponent: "at Old Dominion (Exh.)",    type: "Exhibition",     time: "7:00 PM ET",  home: false },
      { date: "Aug 12", day: "Wed", opponent: "at Indiana",                type: "Non-Conference", time: "8:00 PM ET",  home: false },
      { date: "Aug 15", day: "Sat", opponent: "Temple",                    type: "Non-Conference", time: "1:00 PM ET",  home: true  },
      { date: "Aug 22", day: "Sat", opponent: "Howard ⚡",                 type: "Non-Conference", time: "3:00 PM ET",  home: false, neutral: "Audi Field, Washington DC", arlington: true },
      { date: "Aug 30", day: "Sun", opponent: "at USC Upstate",            type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Sep 3",  day: "Thu", opponent: "at Delaware State",         type: "Non-Conference", time: "5:00 PM ET",  home: false },
      { date: "Sep 6",  day: "Sun", opponent: "at Longwood",               type: "Non-Conference", time: "5:00 PM ET",  home: false },
      { date: "Sep 13", day: "Sun", opponent: "at George Mason",           type: "Non-Conference", time: "1:00 PM ET",  home: false },
      { date: "Sep 20", day: "Sun", opponent: "UNCW",                      type: "CAA",            time: "1:00 PM ET",  home: true  },
      { date: "Sep 24", day: "Thu", opponent: "Drexel",                    type: "CAA",            time: "12:00 PM ET", home: true  },
      { date: "Sep 27", day: "Sun", opponent: "Towson ⚡",                 type: "CAA",            time: "1:00 PM ET",  home: true,  arlington: true },
      { date: "Sep 30", day: "Wed", opponent: "at S.C. State",             type: "Non-Conference", time: "6:00 PM ET",  home: false },
      { date: "Oct 4",  day: "Sun", opponent: "Charleston",                type: "CAA",            time: "1:00 PM ET",  home: true  },
      { date: "Oct 8",  day: "Thu", opponent: "at Stony Brook",            type: "CAA",            time: "6:00 PM ET",  home: false },
      { date: "Oct 11", day: "Sun", opponent: "at Hofstra",                type: "CAA",            time: "1:00 PM ET",  home: false },
      { date: "Oct 14", day: "Wed", opponent: "at Virginia State",         type: "Non-Conference", time: "7:00 PM ET",  home: false },
      { date: "Oct 18", day: "Sun", opponent: "at Campbell ⚡",            type: "CAA",            time: "2:00 PM ET",  home: false, arlington: true },
      { date: "Oct 25", day: "Sun", opponent: "at Elon",                   type: "CAA",            time: "1:00 PM ET",  home: false },
      { date: "Oct 28", day: "Wed", opponent: "at Regent",                 type: "Non-Conference", time: "2:00 PM ET",  home: false },
      { date: "Nov 1",  day: "Sun", opponent: "William & Mary ⚡",         type: "CAA",            time: "12:00 PM ET", home: true,  arlington: true },
    ]
  },
};



function getGameWatch(college, gameType) {
  const w = WATCH[college];
  if (!w) return null;
  const isConf = !gameType.includes("Non-Conference") && !gameType.includes("Exhibition");
  return isConf ? w.conference : w.nonConf;
}

const STATUS_BADGE = {
  confirmed: { bg: "#0a2a0a", text: "#44cc44", border: "#1a4a1a", label: "✓ CONFIRMED" },
  partial:   { bg: "#1a1a0a", text: "#cccc44", border: "#3a3a1a", label: "~ PARTIAL" },
  tba:       { bg: "#112040", text: "#1a4a80", border: "#1a3260", label: "SCHEDULE TBA" },
};

const CONF_COLORS = {
  "Big Ten": "#0066CC", "Atlantic 10": "#CC4400", "CAA": "#006633",
  "Patriot League": "#8B1A1A", "MAAC": "#2a7dd4", "ODAC": "#336699",
  "UAA": "#002878", "CAC": "#003DA5", "Horizon": "#8B0000",
  "SIAC": "#8B8000", "NCAC": "#CC6600", "NESCAC": "#4B0082",
  "Southern": "#005500", "SSC": "#005566", "Non-Conference": "#555",
  "Exhibition": "#888",
};
const getTypeColor = t => { for (const k of Object.keys(CONF_COLORS)) if (t.includes(k)) return CONF_COLORS[k]; return "#555"; };

const DIV_BADGE = {
  "D1": { bg: "#0d1e3a", text: "#e8c547" },
  "D2": { bg: "#1a2e1a", text: "#47e847" },
  "D3": { bg: "#112040", text: "#C8102E" },
};

// ── component ─────────────────────────────────────────────────────────────
// ─── Google Sheet Data Source ────────────────────────────────────────────────
// Set this to your Google Apps Script Web App URL after completing setup.
// Leave as empty string to use the hardcoded data below (default during dev).
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxMWIv0eg10MO-zAgVsl2Og-72nLgZ_ZtO1gY8Z_ceK1Ug5zIE0EMg033JW4KhPiG1N9A/exec";

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const normalizeSheetDate = (val) => {
  if (!val) return "";
  const s = String(val).trim();
  if (s.match(/^\d{4}-\d{2}-\d{2}/)) { const d = new Date(s); return `${MONTH_ABBR[d.getUTCMonth()]} ${d.getUTCDate()}`; }
  if (s.match(/^[A-Za-z]{3}\s+\d{1,2}$/)) return s;
  if (val instanceof Date) return `${MONTH_ABBR[val.getUTCMonth()]} ${val.getUTCDate()}`;
  if (typeof val === "number") { const d = new Date(Math.round((val - 25569) * 86400 * 1000)); return `${MONTH_ABBR[d.getUTCMonth()]} ${d.getUTCDate()}`; }
  return s;
};

const normalizeSheetTime = (val) => {
  if (!val) return "TBA";
  const s = String(val).trim();
  if (!s || s === "TBA" || s === "TBD") return "TBA";
  if (s.match(/\d+:\d+\s*(AM|PM)/i)) return s.includes("ET") ? s : s + " ET";
  if (val instanceof Date) { let h = val.getHours(), m = val.getMinutes(); const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${String(m).padStart(2,"0")} ${ampm} ET`; }
  return "TBA";
};

const FALLBACK_PLAYERS = [
  ...PLAYERS.map(p => ({ ...p, classYear: 2026 })),
  ...PLAYERS_2025,
  ...PLAYERS_2024,
  ...PLAYERS_2023,
];

export default function App() {
  const [sheetData, setSheetData] = useState(null);
  const [sheetLoading, setSheetLoading] = useState(!!SHEET_URL);
  const [sheetError, setSheetError] = useState(false);
  const [liveSchedules, setLiveSchedules] = useState(SCHEDULES);
  const [livePlayers, setLivePlayers] = useState(FALLBACK_PLAYERS);

  // Fetch live data from Google Sheet on mount (only if URL is configured)
  useEffect(() => {
    if (!SHEET_URL) return;
    fetch(SHEET_URL + "?t=" + Date.now(), { redirect: "follow" })
      .then(r => r.json())
      .then(data => {
        // Set schedule data directly into liveSchedules state
        if (data.games) {
          const byCollege = {};
          data.games.forEach(g => {
            if (!byCollege[g.college]) byCollege[g.college] = [];
            const dateStr = normalizeSheetDate(g.date);
            const timeStr = normalizeSheetTime(g.time);
            byCollege[g.college].push({
              date: dateStr, day: g.day || "",
              opponent: (g.arlingtonRivalry === true || g.arlingtonRivalry === "TRUE")
                ? g.opponent + " ⚡" : g.opponent,
              type: g.type, time: timeStr,
              home: g.homeAway === "Home",
              neutral: g.neutral || undefined,
              arlington: g.arlingtonRivalry === true || g.arlingtonRivalry === "TRUE",
            });
          });
          const result = {};
          Object.keys(SCHEDULES).forEach(col => {
            result[col] = byCollege[col]
              ? { ...SCHEDULES[col], games: byCollege[col] }
              : SCHEDULES[col];
          });
          setLiveSchedules(result);
        }
        if (data.athletes) {
          setLivePlayers(data.athletes
            .filter(a => a.active !== false && a.active !== "FALSE")
            .map(a => ({ ...a, classYear: parseInt(a.classYear) })));
        }
        setSheetData(data);
        setSheetLoading(false);
      })
      .catch(err => { console.error("Sheet fetch error:", err); setSheetError(true); setSheetLoading(false); });
  }, []);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [filterDiv, setFilterDiv] = useState("All");
  const [activeTab, setActiveTab] = useState("schools");
  const [selectedYears, setSelectedYears] = useState(new Set(["2026"]));
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const schedulePanelRef = useRef(null);
  const [scheduleJustOpened, setScheduleJustOpened] = useState(false);
  const [athleteSort, setAthleteSort] = useState("firstName");
  const [calMonthKey, setCalMonthKey] = useState(null); // null = auto (current/first with games)
  const [calSelectedDay, setCalSelectedDay] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("add");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // ── Live clock ───────────────────────────────────────────────────────────
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // ── Responsive viewport tracking ────────────────────────────────────────
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = vw < 640;
  const isNarrow = vw < 420;

  // ── Scroll to + flash the schedule panel whenever a school is selected ────
  useEffect(() => {
    if (!selectedCollege) return;
    const id = requestAnimationFrame(() => {
      schedulePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    setScheduleJustOpened(true);
    const t = setTimeout(() => setScheduleJustOpened(false), 1400);
    return () => { cancelAnimationFrame(id); clearTimeout(t); };
  }, [selectedCollege]);

  // ── Tour keyboard navigation ─────────────────────────────────────────────
  useEffect(() => {
    if (!showTour) return;
    const handler = (e) => {
      if (e.key === "Escape") { setShowTour(false); setTourStep(0); return; }
      if (e.key === "ArrowLeft") { setTourStep(s => Math.max(0, s - 1)); return; }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        setTourStep(s => { if (s >= 6) { setShowTour(false); return 0; } return s + 1; });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showTour]);

  // ── Auth / registration state ──────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arlUser") || "null"); } catch { return null; }
  });
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem("arlWelcomeSeen"); } catch { return true; }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("register"); // "register" | "login"
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyText, setNotifyText] = useState(false);
  const [authStep, setAuthStep] = useState("form"); // "form" | "success" | "loading"
  const [authError, setAuthError] = useState("");
  const [authToken, setAuthToken] = useState(() => {
    try { return localStorage.getItem("arlToken") || null; } catch { return null; }
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    try { return localStorage.getItem("arlRefreshToken") || null; } catch { return null; }
  });

  const dismissWelcome = (openReg = false) => {
    try { localStorage.setItem("arlWelcomeSeen", "1"); } catch {}
    setShowWelcome(false);
    if (openReg) { setAuthMode("register"); setShowAuth(true); }
  };

  const handleRegister = async () => {
    if (!authEmail.includes("@")) { setAuthError("Please enter a valid email address."); return; }
    if (!authPassword || authPassword.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
    setAuthStep("loading");
    setAuthError("");
    try {
      const res = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email: authEmail, password: authPassword, name: authName }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || "Registration failed."); setAuthStep("form"); return; }
      const newUser = { name: authName || authEmail.split("@")[0], email: authEmail, phone: authPhone, notifyEmail, notifyText };
      try { localStorage.setItem("arlUser", JSON.stringify(newUser)); } catch {}
      setUser(newUser);
      setAuthStep("success");
    } catch {
      setAuthError("Network error. Please try again.");
      setAuthStep("form");
    }
  };

  const handleLogin = async () => {
    if (!authEmail.includes("@")) { setAuthError("Please enter a valid email address."); return; }
    if (!authPassword) { setAuthError("Please enter your password."); return; }
    setAuthStep("loading");
    setAuthError("");
    try {
      const res = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || "Login failed. Check your email and password."); setAuthStep("form"); return; }
      const token = data.session?.access_token;
      const rToken = data.session?.refresh_token;
      if (token) { try { localStorage.setItem("arlToken", token); } catch {} setAuthToken(token); }
      if (rToken) { try { localStorage.setItem("arlRefreshToken", rToken); } catch {} setRefreshToken(rToken); }
      const newUser = { name: data.user?.user_metadata?.name || authEmail.split("@")[0], email: authEmail, phone: authPhone, notifyEmail, notifyText };
      try { localStorage.setItem("arlUser", JSON.stringify(newUser)); } catch {}
      setUser(newUser);
      setShowAuth(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthStep("form");
      // Load favorites from Supabase
      if (token) loadFavoritesFromDB(token);
    } catch {
      setAuthError("Network error. Please try again.");
      setAuthStep("form");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setFavSchools(new Set());
    setFavAthletes(new Set());
    try { localStorage.removeItem("arlUser"); localStorage.removeItem("arlToken"); localStorage.removeItem("arlRefreshToken"); } catch {}
  };

  // Load favorites from Supabase on page load if user is already logged in
  useEffect(() => {
    if (authToken) loadFavoritesFromDB(authToken);
  }, []);

  const loadFavoritesFromDB = async (token) => {
    try {
      const res = await fetch("/.netlify/functions/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getFavorites", token }),
      });
      if (!res.ok) return;
      const data = await res.json();

      // Load favorited athletes
      const athleteSet = new Set(data.athletes || []);
      setFavAthletes(athleteSet);

      // Derive pinned schools from favorited athletes + any explicitly favorited schools
      const allPlayers = [
        ...PLAYERS.map(p => ({...p, classYear: 2026})),
        ...PLAYERS_2025, ...PLAYERS_2024, ...PLAYERS_2023,
      ];
      const schoolsFromAthletes = new Set(
        allPlayers.filter(p => athleteSet.has(p.name)).map(p => p.college)
      );
      // Merge with explicitly favorited schools from DB
      const explicitSchools = new Set(data.schools || []);
      setFavSchools(new Set([...schoolsFromAthletes, ...explicitSchools]));
    } catch {}
  };

  const saveNotificationPrefs = () => {
    if (!user) return;
    const updated = { ...user, notifyEmail, notifyText, phone: authPhone };
    setUser(updated);
    try { localStorage.setItem("arlUser", JSON.stringify(updated)); } catch {}
  };

  // Auto-refresh token when it expires or is about to expire
  useEffect(() => {
    if (!authToken || !refreshToken) return;

    const checkAndRefresh = async () => {
      try {
        // Decode the JWT to check expiry (no library needed — just base64 decode the payload)
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const expiresAt = payload.exp * 1000; // convert to ms
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        // Refresh if expired or expiring within 5 minutes
        if (expiresAt - now < fiveMinutes) {
          console.log("Token expiring soon, refreshing...");
          const res = await fetch("/.netlify/functions/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "refresh", refreshToken }),
          });
          if (res.ok) {
            const data = await res.json();
            const newToken = data.session?.access_token;
            const newRefresh = data.session?.refresh_token;
            if (newToken) {
              try { localStorage.setItem("arlToken", newToken); } catch {}
              setAuthToken(newToken);
            }
            if (newRefresh) {
              try { localStorage.setItem("arlRefreshToken", newRefresh); } catch {}
              setRefreshToken(newRefresh);
            }
            console.log("Token refreshed successfully");
          } else {
            // Refresh failed — token is invalid, sign user out gracefully
            console.log("Token refresh failed, signing out");
            setUser(null); setAuthToken(null); setRefreshToken(null);
            try { localStorage.removeItem("arlUser"); localStorage.removeItem("arlToken"); localStorage.removeItem("arlRefreshToken"); } catch {}
          }
        }
      } catch {}
    };

    // Check immediately on mount, then every 4 minutes
    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [authToken, refreshToken]);
  const favKey = (k) => user ? `arlFav_${user.email}_${k}` : `arlFav${k}`;
  const [favSchools, setFavSchools] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("arlUser") || "null");
      const k = u ? `arlFav_${u.email}_Schools` : "arlFavSchools";
      return new Set(JSON.parse(localStorage.getItem(k) || "[]"));
    } catch { return new Set(); }
  });
  const [favAthletes, setFavAthletes] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("arlUser") || "null");
      const k = u ? `arlFav_${u.email}_Athletes` : "arlFavAthletes";
      return new Set(JSON.parse(localStorage.getItem(k) || "[]"));
    } catch { return new Set(); }
  });

  // Authenticated fetch — auto-refreshes token on 401, signs out if refresh fails
  const authedFetch = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, token: authToken }),
    });
    if (res.status === 401 && refreshToken) {
      // Try to refresh the token
      try {
        const rRes = await fetch("/.netlify/functions/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "refresh", refreshToken }),
        });
        if (rRes.ok) {
          const rData = await rRes.json();
          const newToken = rData.session?.access_token;
          const newRefresh = rData.session?.refresh_token;
          if (newToken) {
            try { localStorage.setItem("arlToken", newToken); } catch {}
            setAuthToken(newToken);
          }
          if (newRefresh) {
            try { localStorage.setItem("arlRefreshToken", newRefresh); } catch {}
            setRefreshToken(newRefresh);
          }
          // Retry with new token
          return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, token: newToken }),
          });
        }
      } catch {}
      // Refresh failed — sign out gracefully
      setUser(null); setAuthToken(null); setRefreshToken(null);
      setFavSchools(new Set()); setFavAthletes(new Set());
      try { localStorage.removeItem("arlUser"); localStorage.removeItem("arlToken"); localStorage.removeItem("arlRefreshToken"); } catch {}
    }
    return res;
  };

  const toggleFavSchool = (e, college) => {
    e.stopPropagation();
    setFavSchools(prev => {
      const next = new Set(prev);
      next.has(college) ? next.delete(college) : next.add(college);
      try { localStorage.setItem(favKey("Schools"), JSON.stringify([...next])); } catch {}
      // Sync to Supabase if logged in
      if (authToken) {
        authedFetch("/.netlify/functions/favorites", { action: "toggleSchool", college }).catch(() => {});
      }
      return next;
    });
  };

  const toggleFavAthlete = (e, name, college) => {
    e.stopPropagation();
    setFavAthletes(prev => {
      const next = new Set(prev);
      const wasFav = next.has(name);
      wasFav ? next.delete(name) : next.add(name);
      try { localStorage.setItem(favKey("Athletes"), JSON.stringify([...next])); } catch {}
      // Sync athlete to Supabase if logged in
      if (authToken) {
        authedFetch("/.netlify/functions/favorites", { action: "toggleAthlete", athleteName: name, college }).catch(() => {});
      }

      if (college) {
        setFavSchools(prevSchools => {
          const allPlayers = [
            ...PLAYERS.map(p => ({...p, classYear: 2026})),
            ...PLAYERS_2025, ...PLAYERS_2024, ...PLAYERS_2023,
          ];
          const schoolHasFav = allPlayers.some(p =>
            p.college === college && p.name !== name && next.has(p.name)
          );
          const nextSchools = new Set(prevSchools);
          if (wasFav) {
            if (!schoolHasFav) {
              nextSchools.delete(college);
              // Also remove school from Supabase favorite_schools
              if (authToken) {
                authedFetch("/.netlify/functions/favorites", { action: "toggleSchool", college }).catch(() => {});
              }
            }
          } else {
            nextSchools.add(college);
            // Also add school to Supabase favorite_schools so alerts work
            if (authToken) {
              authedFetch("/.netlify/functions/favorites", { action: "toggleSchool", college }).catch(() => {});
            }
          }
          try { localStorage.setItem(favKey("Schools"), JSON.stringify([...nextSchools])); } catch {}
          return nextSchools;
        });
      }
      return next;
    });
  };

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  const toggleYear = (year) => {
    setSelectedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) { if (next.size > 1) next.delete(year); } // always keep at least one
      else next.add(year);
      return next;
    });
    setSelectedCollege(null);
    setFilterDiv("All");
  };

  const include2025 = selectedYears.has("2025");
  const include2024 = selectedYears.has("2024");
  const include2023 = selectedYears.has("2023");
  const include2026 = selectedYears.has("2026");

  // ── Google Sheet data merge (must come after all hooks, before any derived state) ──

  // ── Live schedule state — updated when sheet data arrives ─────────────

  const normalizeSheetTime = (val) => {
    if (!val) return "TBA";
    const s = String(val).trim();
    if (!s || s === "TBA" || s === "TBD") return "TBA";
    // Already formatted: "7:00 PM ET"
    if (s.match(/\d+:\d+\s*(AM|PM)/i)) return s.includes("ET") ? s : s + " ET";
    if (val instanceof Date) {
      let h = val.getHours(), m = val.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${h}:${String(m).padStart(2,"0")} ${ampm} ET`;
    }
    return "TBA";
  };


  if (sheetLoading) return (
    <div style={{ minHeight: "100vh", background: "#060e1c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 36 }}>⚽</div>
      <div style={{ fontSize: 16, color: "#8899bb", fontWeight: 600 }}>Loading schedule data…</div>
      <div style={{ width: 160, height: 3, background: "#0d1e3a", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#C8102E,#f7c948)", borderRadius: 4, animation: "slide 1.2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes slide{0%{width:0%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}`}</style>
    </div>
  );

  // Merge player lists and WATCH based on selected years
  const ALL_WATCH = { ...WATCH, ...WATCH_2025_EXTRA, ...WATCH_2024_EXTRA, ...WATCH_2023_EXTRA };
  const activePlayers = livePlayers.filter(p => {
    if (p.classYear === 2026 && !include2026) return false;
    if (p.classYear === 2025 && !include2025) return false;
    if (p.classYear === 2024 && !include2024) return false;
    if (p.classYear === 2023 && !include2023) return false;
    return true;
  });

  const totalAthletes = livePlayers.filter(p => selectedYears.has(String(p.classYear))).length;
  const yearsLabel = [include2026 && "2026", include2025 && "2025", include2024 && "2024", include2023 && "2023"].filter(Boolean).join(", ");

  const colleges = [...new Set(activePlayers.map(p => p.college))].filter(c => c !== "TBD").sort();
  const filteredColleges = (() => {
    const base = (filterDiv === "All"
      ? colleges
      : colleges.filter(c => activePlayers.find(p => p.college === c)?.division === filterDiv)).sort();
    const favs   = base.filter(c => favSchools.has(c));
    const others = base.filter(c => !favSchools.has(c));
    return [...favs, ...others];
  })();

  const activeMatchups = getActiveMatchups(selectedYears, activePlayers);
  const selectedPlayers = selectedCollege ? activePlayers.filter(p => p.college === selectedCollege) : [];
  const schedule = selectedCollege ? liveSchedules[selectedCollege] : null;
  const watchInfo = selectedCollege ? ALL_WATCH[selectedCollege] : null;
  const rivals = selectedCollege ? getArlingtonRivals(selectedCollege, selectedYears, activePlayers) : new Set();

  // Determine primary watch label for school card
  const getPrimaryWatch = (college) => {
    const w = ALL_WATCH[college];
    if (!w) return null;
    const conf = w.conference.label;
    const nonConf = w.nonConf.label;
    if (conf === nonConf) return conf;
    return conf; // show conference watch as primary
  };

  const isEspnPlus = (label) => label && label.includes("ESPN+");
  const isFree = (label) => label && label.toLowerCase().includes("free");

  // ── Search ──────────────────────────────────────────────────────────────
  const ALL_PLAYERS_FOR_SEARCH = [
    ...PLAYERS.map(p => ({...p, classYear: 2026})),
    ...PLAYERS_2025, ...PLAYERS_2024, ...PLAYERS_2023,
  ];

  const searchResults = searchQuery.trim().length < 2 ? [] : (() => {
    const q = searchQuery.toLowerCase();
    const results = [];
    const seenColleges = new Set();

    // Match players (search all classes regardless of toggle)
    ALL_PLAYERS_FOR_SEARCH.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        results.push({ type: "player", label: p.name, sub: `${p.college} · Class of ${p.classYear}`, college: p.college, classYear: p.classYear });
        seenColleges.add(p.college);
      }
    });

    // Match schools
    Object.keys(liveSchedules).forEach(college => {
      if (!seenColleges.has(college) && college.toLowerCase().includes(q)) {
        const players = ALL_PLAYERS_FOR_SEARCH.filter(p => p.college === college);
        results.push({ type: "school", label: college, sub: players.length ? players.map(p => p.name).join(", ") : "School", college });
      }
    });

    return results.slice(0, 8);
  })();

  const handleSearchSelect = (result) => {
    // If the class year isn't currently shown, enable it
    if (result.classYear && !selectedYears.has(String(result.classYear))) {
      setSelectedYears(prev => new Set([...prev, String(result.classYear)]));
    }
    setActiveTab("schools");
    setSelectedCollege(result.college);
    setFilterDiv("All");
    setSearchQuery("");
    setSearchOpen(false);
  };

  const parseGameDate = (dateStr, timeStr) => {
    if (!dateStr || dateStr.includes("~") || dateStr === "TBA") return null;
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    const [mon, day] = dateStr.trim().split(" ");
    if (!months.hasOwnProperty(mon) || !day) return null;
    const d = new Date(2026, months[mon], parseInt(day));
    if (timeStr && timeStr !== "TBA") {
      const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (m) {
        let h = parseInt(m[1]), mn = parseInt(m[2]);
        if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
        if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
        d.setHours(h, mn, 0, 0);
      }
    }
    return d;
  };

  // ── Next Matchday: find earliest date, collect ALL games on that date ──
  const nextMatchday = (() => {
    const activeCollegeSet = new Set(activePlayers.map(p => p.college));
    const SHORT_NAMES = { "Williams": "Williams College", "Bates": "Bates College", "Oberlin": "Oberlin College", "American": "American University" };
          const normalizeOpp = (opp) => { const n = opp.replace(/^at /, "").replace(/ ⚡$/, "").replace(/\s*\(.*?\)\s*$/, "").trim(); return SHORT_NAMES[n] || n; };

    // Collect every upcoming confirmed game across active schools
    const upcoming = [];
    Object.entries(liveSchedules).forEach(([college, sched]) => {
      if (!activeCollegeSet.has(college)) return;
      if (!sched.games) return;
      const collegePlayers = activePlayers.filter(p => p.college === college);
      if (!collegePlayers.length) return;
      sched.games.forEach(game => {
        if (game.type === "Exhibition" || game.type === "SEC Tournament") return;
        const gd = parseGameDate(game.date, game.time);
        if (!gd) return;
        if (new Date(gd.getTime() + 3 * 60 * 60 * 1000) < now) return;
        const oppName = normalizeOpp(game.opponent);
        const opponentPlayers = activeCollegeSet.has(oppName)
          ? activePlayers.filter(p => p.college === oppName) : [];
        upcoming.push({ college, game, date: gd, players: collegePlayers, opponentPlayers, wInfo: ALL_WATCH[college] });
      });
    });

    if (!upcoming.length) return null;

    // Find the earliest date (by calendar day)
    upcoming.sort((a, b) => a.date - b.date);
    const earliestDay = upcoming[0].date.toDateString();

    // All games on that same calendar day, deduped (A vs B and B vs A = one entry)
    const seen = new Set();
    const games = upcoming.filter(g => {
      if (g.date.toDateString() !== earliestDay) return false;
      const key = [g.college, normalizeOpp(g.game.opponent)].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return { date: upcoming[0].date, games };
  })();

  const fmtNextDate = (d) => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${days[d.getDay()]}, ${mons[d.getMonth()]} ${d.getDate()}`;
  };
  const isToday    = (d) => d.toDateString() === now.toDateString();
  const isTomorrow = (d) => { const t = new Date(now); t.setDate(t.getDate()+1); return d.toDateString() === t.toDateString(); };
  const daysUntil  = (d) => Math.ceil((d - now) / 86400000);

  return (
    <div style={{ minHeight: "100vh", background: "#09111f", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e8eef8" }}>

      {/* Responsive styles */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; -webkit-tap-highlight-color: transparent; }
        button { touch-action: manipulation; }
        input, button { font-family: inherit; }
        @media (max-width: 600px) {
          .next-match-band { flex-direction: column !important; gap: 6px !important; }
          .next-match-band .watch-link { display: none !important; }
          .school-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 601px) {
          .user-details { display: flex !important; }
        }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #09111f; } ::-webkit-scrollbar-thumb { background: #1a3260; border-radius: 3px; }
        @keyframes schedulePanelFlash {
          0%   { box-shadow: 0 0 0 3px rgba(42,125,212,0.9), 0 0 24px rgba(42,125,212,0.5); }
          70%  { box-shadow: 0 0 0 3px rgba(42,125,212,0.5), 0 0 24px rgba(42,125,212,0.25); }
          100% { box-shadow: 0 0 0 0 rgba(42,125,212,0); }
        }
      `}</style>
      {showWelcome && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "linear-gradient(160deg,#0d1e3a,#081428)", border: "1px solid #1a3260", borderRadius: 16, maxWidth: 480, width: "100%", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
            {/* Red accent bar */}
            <div style={{ height: 4, background: "linear-gradient(90deg,#C8102E,#e83050,#C8102E)" }} />
            <div style={{ padding: "32px 28px 28px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#8899bb", textTransform: "uppercase", marginBottom: 8 }}>Arlington Soccer Association</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>Alumni College Match Tracker</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#8899bb", lineHeight: 1.6 }}>
                Follow Arlington Soccer alumni at colleges across the country — schedules, rivalries, and live watch links, all in one place.
              </p>
              <div style={{ background: "#0b1a32", border: "1px solid #1a3260", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e8c547", marginBottom: 10 }}>Create a free account to:</div>
                {[
                  ["★", "Save favorite athletes and schools across devices"],
                  ["🔔", "Get email alerts 2 hours before a favorite's game"],
                  ["📌", "Pin your picks to the top of every list"],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: "#ccd6f0", lineHeight: 1.4 }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                <button onClick={() => dismissWelcome(true)} style={{
                  width: "100%", padding: "13px 20px", borderRadius: 8, border: "none",
                  background: "#C8102E", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", letterSpacing: "0.02em",
                }}>
                  Create free account
                </button>
                <button onClick={() => { setAuthMode("login"); setShowAuth(true); dismissWelcome(false); }} style={{
                  width: "100%", padding: "11px 20px", borderRadius: 8,
                  border: "1px solid #1a3260", background: "transparent",
                  color: "#8899bb", fontSize: 13, cursor: "pointer",
                }}>
                  Sign in to existing account
                </button>
                <button onClick={() => dismissWelcome(false)} style={{
                  background: "none", border: "none", color: "#2a3a5a", fontSize: 12,
                  cursor: "pointer", padding: "4px 0", textDecoration: "underline",
                }}>
                  Continue without an account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Auth Modal (register / login) ── */}
      {showAuth && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "linear-gradient(160deg,#0d1e3a,#081428)", border: "1px solid #1a3260", borderRadius: 16, maxWidth: 420, width: "100%", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg,#C8102E,#e83050,#C8102E)" }} />
            <div style={{ padding: "28px 28px 24px" }}>

              {authStep === "success" ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#fff" }}>You're in!</h3>
                  <p style={{ fontSize: 14, color: "#8899bb", margin: "0 0 20px", lineHeight: 1.6 }}>
                    Welcome, {user?.name}. Your favorites will be saved and{user?.notifyEmail ? " you'll get email alerts before their games" : " you can enable email alerts in settings"}.
                  </p>
                  <button onClick={() => { setShowAuth(false); setAuthStep("form"); }} style={{
                    padding: "11px 28px", borderRadius: 8, border: "none",
                    background: "#C8102E", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                    Go to tracker
                  </button>
                </div>
              ) : (
                <>
                  {/* Tab toggle */}
                  <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#081428", borderRadius: 8, padding: 3 }}>
                    {["register","login"].map(mode => (
                      <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(""); }} style={{
                        flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                        background: authMode === mode ? "#C8102E" : "transparent",
                        color: authMode === mode ? "#fff" : "#555",
                      }}>
                        {mode === "register" ? "Create account" : "Sign in"}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {authMode === "register" && (
                      <div>
                        <label style={{ fontSize: 11, color: "#8899bb", display: "block", marginBottom: 4 }}>Your name (optional)</label>
                        <input value={authName} onChange={e => setAuthName(e.target.value)}
                          placeholder="e.g. Alex Smith"
                          style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #1a3260", background: "#0b1a32", color: "#e8eef8", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: 11, color: "#8899bb", display: "block", marginBottom: 4 }}>Email address</label>
                      <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #1a3260", background: "#0b1a32", color: "#e8eef8", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, color: "#8899bb", display: "block", marginBottom: 4 }}>Password {authMode === "register" && <span style={{ color: "#2a3a5a" }}>(min 6 characters)</span>}</label>
                      <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #1a3260", background: "#0b1a32", color: "#e8eef8", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>

                    {authMode === "register" && (
                      <>
                        <div style={{ background: "#0b1a32", border: "1px solid #1a3260", borderRadius: 8, padding: "14px 14px 10px" }}>
                          <div style={{ fontSize: 11, color: "#e8c547", fontWeight: 700, marginBottom: 6 }}>🔔 Email alerts</div>
                          <div style={{ fontSize: 12, color: "#8899bb" }}>You'll receive an email 2 hours before any favorited athlete's game.</div>
                        </div>
                      </>
                    )}

                    {authError && <div style={{ fontSize: 12, color: "#e83050", background: "#C8102E15", border: "1px solid #C8102E30", borderRadius: 6, padding: "8px 12px" }}>{authError}</div>}

                    <button onClick={authStep === "loading" ? undefined : (authMode === "register" ? handleRegister : handleLogin)} style={{
                      width: "100%", padding: "12px 20px", borderRadius: 8, border: "none",
                      background: authStep === "loading" ? "#1a3260" : "#C8102E", color: "#fff", fontSize: 14, fontWeight: 700,
                      cursor: authStep === "loading" ? "default" : "pointer", marginTop: 4,
                    }}>
                      {authStep === "loading" ? "Please wait..." : (authMode === "register" ? "Create account" : "Sign in")}
                    </button>
                    <button onClick={() => { setShowAuth(false); setAuthStep("form"); setAuthError(""); }} style={{
                      background: "none", border: "none", color: "#2a3a5a", fontSize: 12,
                      cursor: "pointer", textDecoration: "underline", padding: "2px 0",
                    }}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#09111f,#0d1e3a,#081428)", borderBottom: "2px solid #1a3260", padding: isMobile ? "50px 10px 14px" : "24px 20px 18px", textAlign: "center", position: "relative" }}>

        {/* Account button — top left */}
        <div style={{ position: "absolute", top: isMobile ? 10 : 16, left: isMobile ? 10 : 18, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Tour button */}
            <button
              onClick={() => { setShowTour(true); setTourStep(0); }}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "1px solid #1a3260", background: "#0d1e3a",
                color: "#8899bb", cursor: "pointer", fontSize: 13, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1a3260"; e.currentTarget.style.color = "#e8eef8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0d1e3a"; e.currentTarget.style.color = "#8899bb"; }}
              title="App tour"
            >?</button>

            {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: "#C8102E", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {user.name[0].toUpperCase()}
              </div>
              <div style={{ display: "none" }} className="user-details">
                <span style={{ fontSize: 11, color: "#8899bb" }}>{user.name}</span>
              </div>
              <button onClick={() => { setAuthMode("register"); setShowAuth(true); setAuthStep("form"); setNotifyEmail(user.notifyEmail ?? true); setNotifyText(user.notifyText ?? false); setAuthPhone(user.phone || ""); }} style={{
                background: "none", border: "1px solid #1a3260", borderRadius: 5, padding: "3px 8px",
                color: "#8899bb", fontSize: 10, cursor: "pointer",
              }} title="Account settings">⚙ Alerts</button>
              <button onClick={handleLogout} style={{
                background: "none", border: "1px solid #1a3260", borderRadius: 5, padding: "3px 8px",
                color: "#2a3a5a", fontSize: 10, cursor: "pointer",
              }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => { setAuthMode("register"); setShowAuth(true); }} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 20, border: "1px solid #1a3260", background: "#0d1e3a",
              color: "#8899bb", fontSize: 11, cursor: "pointer", fontWeight: 600,
            }}>
              <span>👤</span> Sign in / Register
            </button>
          )}
          </div>
        </div>

        {/* ── Tour Modal ── */}
        {showTour && (() => {
          const TOUR = [
            {
              icon: "🎓",
              title: "Schools & Schedules",
              tab: null,
              body: "The default view. Browse every college program with an Arlington alumna. Use the division filter at the top to narrow by NCAA D1, D2, or D3. Click any school card to expand its full 2026 schedule — confirmed kickoff times, home/away indicators, and a direct ⚡ flag whenever another Arlington athlete is on the opposing team.",
              tip: "Tap a ⚡ game to jump straight to that school's schedule and see both athletes side by side.",
            },
            {
              icon: "⚽",
              title: "Athletes",
              tab: "athletes",
              body: "A complete roster of all tracked Arlington alumni across four graduating classes. Filter by class year using the color-coded pills at the top of the page — gold for 2026, red for 2025, teal for 2024, blue for 2023. Each athlete card shows their college, conference, division, class year, and position. Click an athlete's card to jump directly to their school's full schedule.",
              tip: "Use the search bar (🔍) to find any athlete or school instantly from any tab.",
            },
            {
              icon: "⚡",
              title: "Arlington vs Arlington",
              tab: "matchups",
              body: "Every confirmed head-to-head matchup between Arlington alumni playing in the same conference. Cards are grouped by division (D1 then D3) and conference. Each card shows the schools involved, the athletes, and every confirmed game date with kickoff time and watch link. Toggle class years on and off to see only the rivalry games relevant to you.",
              tip: "Multi-class rivalries unlock as you add class years — turn on all four to see the full NCAC Ohio cluster, the NESCAC web, and the Big Ten face-offs.",
            },
            {
              icon: "📅",
              title: "Calendar",
              tab: "calendar",
              body: "A month-by-month view of every confirmed game for the selected athletes. Navigate between August, September, October, and November using the pills at the top. Tap any day with game chips to open a detail panel showing full kickoff times (in ET), athlete name tags, and a watch link. Each game appears only once — rivalry games show all athletes from both sides in a single entry.",
              tip: "The calendar auto-opens to the current month, or August if the season hasn't started yet.",
            },
            {
              icon: "🎓",
              title: "Class Year Filters",
              tab: null,
              body: "The four colored pills below the page title control which graduating classes are visible across all tabs. Gold = ASA 08/07G (Class of 2026), Red = ASA 07/06G (Class of 2025), Teal = ASA 06/05G (Class of 2024), Blue = ASA 05/04G (Class of 2023). Toggle any combination — the schedules, athletes list, rivalry matchups, and calendar all update instantly.",
              tip: "Start with just 2026 to focus on the current freshman class, then add older classes to uncover cross-year rivalries.",
            },
            {
              icon: "👤",
              title: "Sign In & Alerts",
              tab: null,
              body: "Create a free account to save favorite athletes and receive match-day alerts. Registered users receive email notifications 2 hours before games involving their favorites. Your favorites are saved across sessions — sign in on any device to access them.",
              tip: "Alerts are sent 2 hours before kickoff for any favorited athlete's confirmed games.",
            },
            {
              icon: "✏️",
              title: "Submit a Request",
              tab: null,
              body: "See a missing athlete, a schedule change, or a school update? Tap the ✏ pencil icon in the top-right corner to open the request form. Choose a category (add athlete, remove athlete, schedule correction, school/conference update, or other), describe the change, and click Send Request — your message goes directly and silently to the tracker team. No email app required.",
              tip: "The tracker is updated regularly — most corrections appear within a few days of being submitted.",
            },
          ];

          const step = TOUR[tourStep];
          const isLast = tourStep === TOUR.length - 1;

          const advance = () => {
            if (isLast) { setShowTour(false); setTourStep(0); }
            else setTourStep(s => s + 1);
          };

          return (
            <div
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
              onClick={e => { if (e.target === e.currentTarget) { setShowTour(false); setTourStep(0); }}}
            >
              <div style={{ background: "#07101e", border: "1px solid #1a3260", borderRadius: 20, width: "100%", maxWidth: 500, overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.9)", position: "relative" }}>

                {/* Progress bar */}
                <div style={{ height: 3, background: "#0d1e3a", borderRadius: "20px 20px 0 0" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg,#C8102E,#f7c948)", borderRadius: "20px 0 0 0", width: `${((tourStep + 1) / TOUR.length) * 100}%`, transition: "width 0.3s ease" }} />
                </div>

                {/* Step counter & close */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px 0" }}>
                  <div style={{ fontSize: 10, color: "#2a3a5a", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {tourStep + 1} of {TOUR.length}
                  </div>
                  <button onClick={() => { setShowTour(false); setTourStep(0); }} style={{ background: "none", border: "none", color: "#2a3a5a", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>✕</button>
                </div>

                {/* Step content */}
                <div style={{ padding: "16px 28px 28px", minHeight: 260 }}>
                  {/* Icon + title */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{step.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.15 }}>{step.title}</div>
                  </div>

                  {/* Body */}
                  <p style={{ fontSize: 14, color: "#8899bb", lineHeight: 1.75, margin: "0 0 18px" }}>{step.body}</p>

                  {/* Tip */}
                  <div style={{ background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
                    <span style={{ fontSize: 12, color: "#6688aa", lineHeight: 1.6 }}>{step.tip}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ padding: "0 28px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => setTourStep(s => s - 1)}
                    disabled={tourStep === 0}
                    style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid #1a3260", background: "transparent", color: tourStep === 0 ? "#1a2a3a" : "#8899bb", cursor: tourStep === 0 ? "default" : "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}
                  >← Back</button>

                  {/* Step dots */}
                  <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
                    {TOUR.map((_, i) => (
                      <button key={i} onClick={() => setTourStep(i)} style={{ width: i === tourStep ? 20 : 8, height: 8, borderRadius: 4, border: "none", background: i === tourStep ? "#C8102E" : i < tourStep ? "#2a3a5a" : "#1a2a3a", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
                    ))}
                  </div>

                  <button
                    onClick={advance}
                    style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: isLast ? "linear-gradient(90deg,#C8102E,#a00c24)" : "linear-gradient(90deg,#1a4a8a,#1a3260)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "all 0.15s" }}
                  >{isLast ? "Done ✓" : "Next →"}</button>
                </div>

                {/* Keyboard hint */}
                <div style={{ textAlign: "center", paddingBottom: 14, fontSize: 9, color: "#1a2a3a", letterSpacing: "0.08em" }}>
                  ENTER or → to advance · ← to go back · ESC to close
                </div>
              </div>
            </div>
          );
        })()}
        <div style={{ position: "absolute", top: 16, right: 62, zIndex: 20 }}>
          <button
            onClick={() => setShowFeedback(true)}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid #1a3260", background: "#0d1e3a",
              color: "#8899bb", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a3260"; e.currentTarget.style.color = "#e8eef8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0d1e3a"; e.currentTarget.style.color = "#8899bb"; }}
            title="Submit a correction or request"
          >
            ✏️
          </button>
        </div>

        {/* Feedback modal */}
        {showFeedback && (() => {
          const TYPES = [
            { id: "add",      label: "➕ Add an athlete",        subject: "ASA Tracker — Add Athlete Request" },
            { id: "remove",   label: "➖ Remove an athlete",     subject: "ASA Tracker — Remove Athlete Request" },
            { id: "schedule", label: "📅 Schedule correction",   subject: "ASA Tracker — Schedule Correction" },
            { id: "school",   label: "🏟️ School/conference update", subject: "ASA Tracker — School or Conference Update" },
            { id: "other",    label: "💬 Other",                 subject: "ASA Tracker — General Feedback" },
          ];
          const selected = TYPES.find(t => t.id === feedbackType) || TYPES[0];
          const canSend = feedbackText.trim().length >= 10;

          const handleSend = async () => {
            try {
              const res = await fetch("/.netlify/functions/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: feedbackType, message: feedbackText.trim() }),
              });
              if (res.ok) {
                setFeedbackSent(true);
              } else {
                // Fall back to clipboard if function fails
                handleCopy();
              }
            } catch {
              handleCopy();
            }
          };

          const handleCopy = () => {
            const full = `Subject: ${selected.subject}\n\n${feedbackText.trim()}`;
            navigator.clipboard.writeText(full).catch(() => {});
            setFeedbackSent(true);
          };

          return (
            <div
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
              onClick={e => { if (e.target === e.currentTarget) { setShowFeedback(false); setFeedbackText(""); }}}
            >
              <div style={{ background: "#0a1828", border: "1px solid #1a3260", borderRadius: 16, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
                {/* Header */}
                <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #112040", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#e8eef8" }}>Submit a Request</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>Corrections, additions, or feedback for the tracker</div>
                  </div>
                  <button onClick={() => { setShowFeedback(false); setFeedbackText(""); }} style={{ background: "none", border: "none", color: "#555", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Request type */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8899bb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Request Type</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {TYPES.map(t => (
                        <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", borderRadius: 8, background: feedbackType === t.id ? "#1a3260" : "#0d1e3a", border: `1px solid ${feedbackType === t.id ? "#2a7dd4" : "#1a2a3a"}`, transition: "all 0.1s" }}>
                          <input
                            type="radio" name="feedbackType" value={t.id}
                            checked={feedbackType === t.id}
                            onChange={() => setFeedbackType(t.id)}
                            style={{ accentColor: "#2a7dd4", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 13, color: feedbackType === t.id ? "#e8eef8" : "#8899bb", fontWeight: feedbackType === t.id ? 600 : 400 }}>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8899bb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Details</div>
                    <textarea
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder={
                        feedbackType === "add"      ? "e.g. Jane Smith '27 — forward at Duke University (ACC)" :
                        feedbackType === "remove"   ? "e.g. John Doe — no longer enrolled at UVA" :
                        feedbackType === "schedule" ? "e.g. Maryland vs Penn State on Oct 10 should be 7:00 PM ET, not TBA" :
                        feedbackType === "school"   ? "e.g. Iona's conference should be Metro, not MAAC" :
                        "What would you like to share or request?"
                      }
                      rows={4}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 8,
                        color: "#e8eef8", fontSize: 13, padding: "10px 12px",
                        outline: "none", resize: "vertical", lineHeight: 1.6,
                        fontFamily: "inherit",
                      }}
                      onFocus={e => e.target.style.borderColor = "#2a7dd4"}
                      onBlur={e => e.target.style.borderColor = "#1a3260"}
                    />
                    <div style={{ fontSize: 10, color: "#2a3a5a", marginTop: 5 }}>
                      {feedbackText.length < 10 ? `${10 - feedbackText.length} more characters needed` : "✓ Ready to send"}
                    </div>
                  </div>

                  {/* Send options */}
                  {feedbackSent ? (
                    <div style={{ textAlign: "center", padding: "12px 0" }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>✅</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#44cc44", marginBottom: 4 }}>Request submitted!</div>
                      <div style={{ fontSize: 12, color: "#555", marginBottom: 14 }}>Thanks — the tracker team will review your request.</div>
                      <button onClick={() => { setShowFeedback(false); setFeedbackText(""); setFeedbackType("add"); setFeedbackSent(false); }}
                        style={{ padding: "8px 22px", borderRadius: 8, border: "1px solid #1a3260", background: "#0d1e3a", color: "#8899bb", cursor: "pointer", fontSize: 13 }}>
                        Close
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* Primary: mailto link */}
                      <a
                        href="#"
                        onClick={e => { e.preventDefault(); if (canSend) handleSend(); }}
                        style={{
                          display: "block", textAlign: "center",
                          padding: "11px 0", borderRadius: 10,
                          background: canSend ? "linear-gradient(90deg,#C8102E,#a00c24)" : "#1a2a3a",
                          color: canSend ? "#fff" : "#2a3a5a",
                          fontSize: 14, fontWeight: 700,
                          textDecoration: "none", cursor: canSend ? "pointer" : "default",
                          transition: "all 0.15s",
                        }}
                      >
                        📧 Send Request
                      </a>
                      {/* Fallback: copy to clipboard */}
                      <button
                        onClick={canSend ? handleCopy : undefined}
                        disabled={!canSend}
                        style={{
                          padding: "9px 0", borderRadius: 10,
                          border: `1px solid ${canSend ? "#1a3260" : "#111"}`,
                          background: "transparent",
                          color: canSend ? "#8899bb" : "#2a3a5a",
                          fontSize: 13, cursor: canSend ? "pointer" : "default",
                          transition: "all 0.15s",
                        }}
                      >
                        📋 Copy message to clipboard
                      </button>
                      <div style={{ fontSize: 10, color: "#2a3a5a", textAlign: "center" }}>
                        {canSend
                          ? "Open in Email App launches your mail client · Copy lets you paste into any email manually"
                          : `${10 - feedbackText.length} more characters needed`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Search icon + input — top right */}
        <div style={{ position: "absolute", top: isMobile ? 10 : 16, right: isMobile ? 10 : 18, zIndex: 20 }} ref={searchRef}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {searchOpen && (
              <div style={{ position: "relative" }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
                  placeholder="Search…"
                  style={{
                    width: isMobile ? Math.min(150, vw - 90) : 220, padding: "7px 12px 7px 34px", borderRadius: "20px 0 0 20px",
                    border: "1px solid #1a3260", borderRight: "none",
                    background: "#0d1e3a", color: "#e8eef8", fontSize: 13, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#8899bb", pointerEvents: "none" }}>🔍</span>

                {/* Results dropdown */}
                {searchResults.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: isMobile ? "auto" : 0,
                    background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", overflow: "hidden", zIndex: 100,
                    width: isMobile ? Math.min(260, vw - 24) : "auto",
                    minWidth: isMobile ? 0 : 260,
                  }}>
                    {searchResults.map((r, i) => (
                      <div key={i} onClick={() => handleSearchSelect(r)} style={{
                        padding: "9px 14px", cursor: "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid #112040" : "none",
                        display: "flex", alignItems: "center", gap: 10,
                        background: "transparent",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1a3260"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{r.type === "player" ? "⚽" : "🏟️"}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e8eef8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: "#8899bb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</div>
                        </div>
                        {r.classYear && (
                          <span style={{ marginLeft: "auto", fontSize: 9, color: "#8899bb", flexShrink: 0, border: "1px solid #1a3260", borderRadius: 3, padding: "1px 5px" }}>
                            '{String(r.classYear).slice(2)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: isMobile ? "auto" : 0,
                    background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 10,
                    padding: "12px 14px", fontSize: 12, color: "#555", zIndex: 100,
                    width: isMobile ? Math.min(260, vw - 24) : "auto",
                  }}>
                    No athletes or schools found
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => { setSearchOpen(o => !o); setSearchQuery(""); }}
              style={{
                width: 34, height: 34, borderRadius: searchOpen ? "0 20px 20px 0" : "50%",
                border: "1px solid #1a3260", background: searchOpen ? "#C8102E" : "#0d1e3a",
                color: "#e8eef8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
              title="Search athletes or schools"
            >
              {searchOpen ? "✕" : "🔍"}
            </button>
          </div>
        </div>
        <div style={{ fontSize: isMobile ? 9 : 11, letterSpacing: "0.2em", color: "#8899bb", textTransform: "uppercase", marginBottom: 5 }}>Arlington Soccer Association</div>
        <h1 style={{ margin: 0, fontSize: "clamp(18px,5.5vw,34px)", fontWeight: 800, letterSpacing: "-0.01em" }}>
          <span style={{ color: "#C8102E" }}>Alumni College Match Tracker</span>
        </h1>
        <p style={{ color: "#8899bb", marginTop: 6, fontSize: isMobile ? 11 : 12, padding: isMobile ? "0 6px" : 0 }}>
          {totalAthletes} athletes · {new Set(activePlayers.map(p => p.college)).size} programs · Classes of {yearsLabel} · 3 NCAA divisions
        </p>
        <div style={{
          display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
          justifyContent: "center", gap: isMobile ? 7 : 8, marginTop: 14,
        }}>
          {[
            { id: "schools", icon: "🎓", label: "Schools & Schedules", short: "Schools" },
            { id: "athletes", icon: "⚽", label: "Athletes", short: "Athletes" },
            { id: "matchups", icon: "⚡", label: "Arlington vs Arlington", short: "Rivalries" },
            { id: "calendar", icon: "📅", label: "Calendar", short: "Calendar" },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedCollege(null); setCalSelectedDay(null); }} style={{
              padding: isMobile ? "9px 8px" : "7px 18px", borderRadius: isMobile ? 12 : 20, border: activeTab === tab.id ? "none" : "1px solid #333",
              background: activeTab === tab.id ? (tab.id === "matchups" ? "linear-gradient(90deg,#f7c948,#ff6b35)" : tab.id === "athletes" ? "#C8102E" : tab.id === "calendar" ? "#1a6b4a" : "#2a7dd4") : "transparent",
              color: activeTab === tab.id ? "#fff" : "#888", cursor: "pointer", fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: isMobile ? 12 : 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{tab.icon} {isMobile ? tab.short : tab.label}</button>
          ))}
        </div>

        {/* Graduating class toggles */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#555", marginRight: 2 }}>Show classes:</span>
          {[
            { year: "2026", label: "2026 · ASA 08/07G", color: "#e8c547", bg: "#e8c54720", border: "#e8c54750", count: PLAYERS.length },
            { year: "2025", label: "2025 · ASA 07/06G", color: "#e83050", bg: "#c8102e20", border: "#C8102E50", count: livePlayers.filter(p=>p.classYear===2025).length },
            { year: "2024", label: "2024 · ASA 06/05G", color: "#47e8b8", bg: "#47e8b820", border: "#47e8b850", count: PLAYERS_2024.length },
            { year: "2023", label: "2023 · ASA 05/04G", color: "#47b8e8", bg: "#47b8e820", border: "#47b8e850", count: PLAYERS_2023.length },
          ].map(({ year, label, color, bg, border, count }) => {
            const active = selectedYears.has(year);
            return (
              <button key={year} onClick={() => toggleYear(year)} style={{
                padding: isMobile ? "5px 9px" : "5px 13px", borderRadius: 20, fontSize: isMobile ? 10 : 11, cursor: "pointer",
                border: `1px solid ${active ? border : "#333"}`,
                background: active ? bg : "transparent",
                color: active ? color : "#555",
                fontWeight: active ? 700 : 400,
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? color : "#444", display: "inline-block" }} />
                {label}
                <span style={{ fontSize: 10, opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Next Matchday Band ── */}
      {nextMatchday ? (() => {
        const { date, games } = nextMatchday;
        const today    = isToday(date);
        const tomorrow = !today && isTomorrow(date);
        const days     = daysUntil(date);
        const urgency  = today ? "#C8102E" : tomorrow ? "#e86420" : days <= 7 ? "#e8c547" : "#2a7dd4";
        const urgencyBg = today ? "#C8102E14" : tomorrow ? "#e8642010" : days <= 7 ? "#e8c5470c" : "#2a7dd40c";
        const dayLabel = today ? "TODAY" : tomorrow ? "TOMORROW" : `IN ${days} DAY${days !== 1 ? "S" : ""}`;
        const dateStr  = fmtNextDate(date);

        return (
          <div style={{ background: `linear-gradient(180deg,${urgencyBg},transparent)`, borderBottom: `1px solid ${urgency}30`, borderTop: `1px solid ${urgency}20` }}>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: isMobile ? "10px 12px 8px" : "10px 20px 8px", borderBottom: `1px solid ${urgency}18`, flexWrap: "wrap" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: urgency, background: `${urgency}20`, border: `1px solid ${urgency}50`, borderRadius: 4, padding: "3px 9px", whiteSpace: "nowrap", flexShrink: 0 }}>
                📅 Next Matchday · {dayLabel}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e8eef8" }}>{dateStr}</div>
              <div style={{ fontSize: 11, color: "#555" }}>
                {games.length} match{games.length !== 1 ? "es" : ""} · {[...new Set(games.map(g => g.college))].length} Arlington school{[...new Set(games.map(g => g.college))].length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* One row per game */}
            <div style={{ padding: "6px 12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
              {games.map((g, i) => {
                const timeStr = g.game.time && g.game.time !== "TBA" ? g.game.time.replace(/ ET| PT/g, "") : null;
                const isAway = g.game.opponent.startsWith("at ");
                const isArlington = g.game.arlington;
                const oppDisplay = g.game.opponent.replace(/ ⚡$/, "").replace(/^at /, "");
                const watchLabel = g.game.opponent?.includes("BYU") ? "ESPN+" : g.wInfo?.conference?.label;
                const watchUrl   = g.game.opponent?.includes("BYU") ? "https://www.espnplus.com" : g.wInfo?.conference?.url;
                const watchFree  = isFree(watchLabel);

                return (
                  <div key={i}
                    onClick={() => { setActiveTab("schools"); setSelectedCollege(g.college); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 7, cursor: "pointer", background: "transparent", flexWrap: "wrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#ffffff07"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Time */}
                    <div style={{ fontSize: 10, color: "#555", width: 44, flexShrink: 0, textAlign: "right" }}>
                      {timeStr || "TBA"}
                    </div>

                    {/* Arlington ⚡ badge */}
                    <div style={{ width: 14, flexShrink: 0, textAlign: "center" }}>
                      {isArlington && <span style={{ fontSize: 10, color: "#f7c948" }}>⚡</span>}
                    </div>

                    {/* Matchup */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e8eef8", whiteSpace: "nowrap" }}>{g.college}</span>
                      <span style={{ fontSize: 10, color: "#2a3a5a" }}>{isAway ? "at" : "vs"}</span>
                      <span style={{ fontSize: 12, color: "#8899bb", whiteSpace: "nowrap" }}>{oppDisplay}</span>
                      {g.game.neutral && <span style={{ fontSize: 9, color: "#555" }}>({g.game.neutral})</span>}
                    </div>

                    {/* Athletes */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flexShrink: 0 }}>
                      {g.players.map(p => (
                        <span key={p.name} style={{ fontSize: 10, color: urgency, background: `${urgency}15`, border: `1px solid ${urgency}30`, borderRadius: 3, padding: "1px 6px", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {p.name}{selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                        </span>
                      ))}
                      {g.opponentPlayers.length > 0 && <>
                        <span style={{ fontSize: 9, color: "#333", alignSelf: "center" }}>vs</span>
                        {g.opponentPlayers.map(p => (
                          <span key={p.name} style={{ fontSize: 10, color: "#47b8e8", background: "#47b8e815", border: "1px solid #47b8e830", borderRadius: 3, padding: "1px 6px", fontWeight: 600, whiteSpace: "nowrap" }}>
                            {p.name}{selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                          </span>
                        ))}
                      </>}
                    </div>

                    {/* Watch */}
                    {watchLabel && watchUrl ? (
                      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ fontSize: 10, fontWeight: 700, color: watchFree ? "#44cc44" : "#47b8e8", background: watchFree ? "#0a2a0a" : "#0a1a2a", border: `1px solid ${watchFree ? "#1a4a1a" : "#1a2a4a"}`, borderRadius: 4, padding: "2px 8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                        📺 {watchLabel} ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: 10, color: "#2a3a5a", flexShrink: 0 }}>Watch TBA</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })() : (
        <div style={{ background: "#09111f", borderBottom: "1px solid #112040", padding: "8px 20px", textAlign: "center", fontSize: 11, color: "#2a3a5a", letterSpacing: "0.1em" }}>
          No upcoming confirmed matches for selected classes — schedules publish Aug 2026
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 8px" : "20px 14px" }}>

        {/* ── MATCHUPS TAB ── */}
        {/* ══════════════════════════════════════════════════════
            CALENDAR TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === "calendar" && (() => {
          const activeCollegeSet = new Set(activePlayers.map(p => p.college));
          const SHORT_NAMES = { "Williams": "Williams College", "Bates": "Bates College", "Oberlin": "Oberlin College", "American": "American University" };
          const normalizeOpp = (opp) => { const n = opp.replace(/^at /, "").replace(/ ⚡$/, "").replace(/\s*\(.*?\)\s*$/, "").trim(); return SHORT_NAMES[n] || n; };
          const isFreeWatch = (label) => label && (label.toLowerCase().includes("free") || label.toLowerCase().includes("nsn") || label.toLowerCase().includes("flocollege") || label.toLowerCase().includes("centennial") || label.toLowerCase().includes("northcoast"));

          // Collect ALL confirmed games for active players — one event per unique game
          // For rivalry games (both teams have Arlington athletes), merge all players into one event
          const eventMap = new Map(); // key → event object
          Object.entries(liveSchedules).forEach(([college, sched]) => {
            if (!activeCollegeSet.has(college) || !sched.games) return;
            const collegePlayers = activePlayers.filter(p => p.college === college);
            if (!collegePlayers.length) return;
            sched.games.forEach(game => {
              if (game.type === "Exhibition") return;
              const gd = parseGameDate(game.date, game.time);
              if (!gd) return;
              const oppName = normalizeOpp(game.opponent);
              const opponentPlayers = activeCollegeSet.has(oppName)
                ? activePlayers.filter(p => p.college === oppName) : [];

              const isArlingtonMatch = opponentPlayers.length > 0;
              const key = isArlingtonMatch
                ? [college, oppName].sort().join("|") + "|" + game.date
                : college + "|" + game.date + "|" + oppName;

              if (eventMap.has(key)) {
                // Already exists — merge any missing players to the right side
                const ev = eventMap.get(key);
                [...collegePlayers, ...opponentPlayers].forEach(p => {
                  const alreadyIn = ev.players.some(x => x.name === p.name) || ev.opponentPlayers.some(x => x.name === p.name);
                  if (!alreadyIn) {
                    if (p.college === ev.schoolA) ev.players.push(p);
                    else ev.opponentPlayers.push(p);
                  }
                });
              } else {
                // New event — pick schoolA/schoolB so display is always "schoolA vs schoolB"
                const [schoolA, schoolB] = isArlingtonMatch
                  ? [college, oppName].sort()
                  : [college, oppName];
                const isAway = game.opponent.startsWith("at ");
                eventMap.set(key, {
                  college: schoolA,         // used for watch info & nav
                  schoolA,                   // always canonical "left" school
                  schoolB,                   // always canonical "right" school
                  isArlingtonMatch,
                  game,
                  date: gd,
                  players: activePlayers.filter(p => p.college === schoolA),
                  opponentPlayers: activePlayers.filter(p => p.college === schoolB),
                  wInfo: ALL_WATCH[schoolA] || ALL_WATCH[college],
                  past: new Date(gd.getTime() + 3 * 60 * 60 * 1000) < now,
                });
              }
            });
          });
          const allEvents = [...eventMap.values()].sort((a, b) => a.date - b.date);

          // Group by month
          const months = {};
          allEvents.forEach(ev => {
            const mk = `${ev.date.getFullYear()}-${ev.date.getMonth()}`;
            if (!months[mk]) months[mk] = { year: ev.date.getFullYear(), month: ev.date.getMonth(), events: [] };
            months[mk].events.push(ev);
          });

          const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
          const classColor = (yr) => yr === 2026 ? "#e8c547" : yr === 2025 ? "#e83050" : yr === 2024 ? "#47e8b8" : "#47b8e8";

          // Resolve which month to display (default to current month or first month with games)
          // Fixed month order: August (7), September (8), October (9), November (10)
          const FIXED_MONTH_KEYS = ["2026-7", "2026-8", "2026-9", "2026-10"];
          const monthKeys = FIXED_MONTH_KEYS.filter(mk => months[mk]);

          // Default: current month if Aug–Nov, otherwise August
          const nowMonth = now.getMonth(); // 0-indexed
          const nowYear = now.getFullYear();
          const nowKey = `${nowYear}-${nowMonth}`;
          const augustKey = "2026-7";
          const isInSeason = nowYear === 2026 && nowMonth >= 7 && nowMonth <= 10;
          const defaultKey = isInSeason && months[nowKey] ? nowKey : augustKey;

          const calMonth = calMonthKey && months[calMonthKey] ? calMonthKey : defaultKey;
          const curIdx = monthKeys.indexOf(calMonth);
          const cur = months[calMonth] || { year: 2026, month: 7, events: [] };

          // Build calendar grid for the month
          const firstDay = new Date(cur.year, cur.month, 1).getDay();
          const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
          const cells = [];
          for (let i = 0; i < firstDay; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(d);
          while (cells.length % 7 !== 0) cells.push(null);

          // Map events by day number
          const byDay = {};
          (cur.events || []).forEach(ev => {
            const d = ev.date.getDate();
            if (!byDay[d]) byDay[d] = [];
            byDay[d].push(ev);
          });

          const selectedDay = calSelectedDay;
          const setSelectedDay = setCalSelectedDay;
          const selectedEvents = selectedDay ? (byDay[selectedDay] || []) : [];
          const today = now.getDate();
          const isThisMonth = cur.year === now.getFullYear() && cur.month === now.getMonth();

          const fmtTime = (t) => t && t !== "TBA" && t !== "TBD" ? t.replace(/ ET| PT| MT| CT/g, "") : (t || "TBA");
          const fmtTimeFull = (t) => t && t !== "TBA" && t !== "TBD" ? t : (t || "TBA");
          const fmtOpp = (opp) => opp.replace(/^at /, "").replace(/ ⚡$/, "").replace(/\s*\(.*?\)\s*$/, "");
          const isAway = (opp) => opp.startsWith("at ");

          return (
            <div style={{ padding: "0 0 32px" }}>
              {/* Month nav */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 4px" }}>
                <button onClick={() => { const prev = monthKeys[curIdx - 1]; if (prev) { setCalMonthKey(prev); setSelectedDay(null); } }}
                  disabled={curIdx <= 0}
                  style={{ background: curIdx > 0 ? "#112040" : "transparent", border: "1px solid #1a3260", borderRadius: 8, color: curIdx > 0 ? "#e8eef8" : "#2a3a5a", padding: isMobile ? "6px 10px" : "6px 14px", cursor: curIdx > 0 ? "pointer" : "default", fontSize: 14 }}>
                  {isMobile ? "←" : "← Prev"}
                </button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: "#e8eef8" }}>{MONTH_NAMES[cur.month]} {cur.year}</div>
                  <div style={{ fontSize: isMobile ? 10 : 11, color: "#555", marginTop: 2 }}>
                    {(cur.events || []).filter(e => !e.past).length} upcoming · {(cur.events || []).filter(e => e.past).length} played
                  </div>
                </div>
                <button onClick={() => { const next = monthKeys[curIdx + 1]; if (next) { setCalMonthKey(next); setSelectedDay(null); } }}
                  disabled={curIdx >= monthKeys.length - 1}
                  style={{ background: curIdx < monthKeys.length - 1 ? "#112040" : "transparent", border: "1px solid #1a3260", borderRadius: 8, color: curIdx < monthKeys.length - 1 ? "#e8eef8" : "#2a3a5a", padding: isMobile ? "6px 10px" : "6px 14px", cursor: curIdx < monthKeys.length - 1 ? "pointer" : "default", fontSize: 14 }}>
                  {isMobile ? "→" : "Next →"}
                </button>
              </div>

              {/* Quick month jump */}
              <div style={{ display: "flex", gap: isMobile ? 5 : 6, flexWrap: "wrap", marginBottom: 16, justifyContent: "center" }}>
                {[{abbr:"Aug",num:7},{abbr:"Sep",num:8},{abbr:"Oct",num:9},{abbr:"Nov",num:10}].map(({abbr, num}) => {
                  const fullNames = { Aug: "August", Sep: "September", Oct: "October", Nov: "November" };
                  const mk = `2026-${num}`;
                  const m = months[mk];
                  if (!m) return null;
                  const isCur = mk === calMonth;
                  return (
                    <button key={mk} onClick={() => { setCalMonthKey(mk); setSelectedDay(null); }} style={{
                      padding: isMobile ? "5px 11px" : "5px 16px", borderRadius: 20, fontSize: isMobile ? 11 : 12, cursor: "pointer",
                      background: isCur ? "#1a6b4a" : "#0d1e3a",
                      border: `1px solid ${isCur ? "#2aaa77" : "#1a3260"}`,
                      color: isCur ? "#fff" : "#8899bb",
                      fontWeight: isCur ? 700 : 400,
                    }}>
                      {isMobile ? abbr : fullNames[abbr]}
                      <span style={{ marginLeft: 5, opacity: 0.65, fontSize: 10 }}>({m.events.filter(e => !e.past).length})</span>
                    </button>
                  );
                })}
              </div>

              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 1 : 2, marginBottom: 2 }}>
                {DAY_NAMES.map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: isMobile ? 9 : 10, fontWeight: 700, color: "#444", padding: "4px 0", letterSpacing: "0.05em" }}>{isMobile ? d[0] : d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 1 : 2 }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={i} style={{ minHeight: isMobile ? 40 : 72, background: "#080f1e", borderRadius: 6, opacity: 0.3 }} />;
                  const dayEvents = byDay[day] || [];
                  const upcoming = dayEvents.filter(e => !e.past);
                  const past = dayEvents.filter(e => e.past);
                  const isSelected = selectedDay === day;
                  const isTod = isThisMonth && day === today;
                  const hasArlington = dayEvents.some(e => e.game.arlington);

                  return (
                    <div key={i} onClick={() => setSelectedDay(isSelected ? null : day)}
                      style={{
                        minHeight: isMobile ? 40 : 72, background: isSelected ? "#0d2a1e" : isTod ? "#1a1a08" : "#0d1e3a",
                        borderRadius: isMobile ? 5 : 6, padding: isMobile ? "3px 2px" : "4px 5px", cursor: dayEvents.length ? "pointer" : "default",
                        border: `1px solid ${isSelected ? "#2aaa77" : isTod ? "#4a4a10" : dayEvents.length ? "#1a3260" : "#0d1825"}`,
                        transition: "background 0.15s",
                        position: "relative",
                      }}
                    >
                      {/* Day number */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginBottom: isMobile ? 0 : 3 }}>
                        <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: isTod ? 800 : 600, color: isTod ? "#e8c547" : dayEvents.length ? "#c0cce8" : "#2a3a5a" }}>{day}</span>
                        {hasArlington && <span style={{ fontSize: 8, color: "#f7c948" }}>⚡</span>}
                      </div>

                      {isMobile ? (
                        /* Mobile: compact dot indicators — tap the day to see full details below */
                        dayEvents.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", marginTop: 2 }}>
                            {dayEvents.slice(0, 4).map((ev, j) => {
                              const evYears = [...new Set([...ev.players, ...ev.opponentPlayers].map(p => p.classYear))];
                              const col = evYears.length === 1 ? classColor(evYears[0]) : "#e8c547";
                              return <span key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: col, opacity: ev.past ? 0.35 : 1, flexShrink: 0 }} />;
                            })}
                            {dayEvents.length > 4 && <span style={{ fontSize: 7, color: "#666", lineHeight: "5px" }}>+{dayEvents.length - 4}</span>}
                          </div>
                        )
                      ) : (
                        /* Game dots / mini chips */
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {dayEvents.slice(0, 3).map((ev, j) => {
                            const evYears = [...new Set([...ev.players, ...ev.opponentPlayers].map(p => p.classYear))];
          const col = evYears.length === 1 ? classColor(evYears[0]) : "#e8c547";
                            const alpha = ev.past ? "55" : "cc";
                            return (
                              <div key={j} style={{
                                fontSize: 8, lineHeight: 1.2, padding: "2px 4px", borderRadius: 3,
                                background: `${col}22`, borderLeft: `2px solid ${col}${alpha}`,
                                color: ev.past ? "#444" : "#aab8cc", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                              }}>
                                {fmtTime(ev.game.time) !== "TBA" && <span style={{ color: `${col}${alpha}`, marginRight: 3, fontWeight: 700 }}>{fmtTime(ev.game.time)}</span>}
                                {(ev.schoolA || ev.college).split(" ").slice(-1)[0]}
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div style={{ fontSize: 8, color: "#444", textAlign: "center" }}>+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isMobile && (
                <div style={{ fontSize: 10, color: "#444", textAlign: "center", marginTop: 8 }}>
                  Tap a day to see its matches
                </div>
              )}

              {/* Selected day detail panel */}
              {selectedDay && (
                <div style={{ marginTop: 16, background: "#0a1828", border: "1px solid #1a3260", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid #112040", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, color: "#e8eef8", fontSize: 14 }}>
                      {DAY_NAMES[new Date(cur.year, cur.month, selectedDay).getDay()]}, {MONTH_NAMES[cur.month]} {selectedDay}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>{selectedEvents.length} match{selectedEvents.length !== 1 ? "es" : ""}</div>
                  </div>

                  <div style={{ padding: isMobile ? 10 : 0, display: "flex", flexDirection: "column", gap: isMobile ? 8 : 0 }}>
                  {selectedEvents.map((ev, i) => {
                    const evYears = [...new Set([...ev.players, ...ev.opponentPlayers].map(p => p.classYear))];
          const col = evYears.length === 1 ? classColor(evYears[0]) : "#e8c547";
                    const watchLabel = ev.wInfo?.conference?.label;
                    const watchUrl   = ev.wInfo?.conference?.url;
                    const free = isFreeWatch(watchLabel);
                    const timeStr = fmtTimeFull(ev.game.time);
                    const oppDisplay = ev.schoolB || fmtOpp(ev.game.opponent);
                    const away = ev.isArlingtonMatch ? false : isAway(ev.game.opponent);

                    return (
                      <div key={i}
                        onClick={() => { setActiveTab("schools"); setSelectedCollege(ev.college); }}
                        style={isMobile ? {
                          padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                          background: ev.game.arlington ? "#f7c94810" : "#0d1e3a",
                          border: `1px solid ${ev.game.arlington ? "#f7c94840" : "#1a3260"}`,
                          borderLeft: `3px solid ${ev.past ? "#333" : col}`,
                          opacity: ev.past ? 0.6 : 1,
                        } : { padding: "10px 16px", borderBottom: i < selectedEvents.length - 1 ? "1px solid #0d1a2e" : "none",
                          background: ev.past ? "transparent" : ev.game.arlington ? "#f7c94808" : "transparent",
                          cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = isMobile ? e.currentTarget.style.background : "#ffffff06"}
                        onMouseLeave={e => e.currentTarget.style.background = isMobile ? e.currentTarget.style.background : (ev.past ? "transparent" : ev.game.arlington ? "#f7c94808" : "transparent")}
                      >
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {/* Time column */}
                        <div style={{ width: 52, flexShrink: 0, textAlign: "right", paddingTop: 2 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: ev.past ? "#333" : col }}>{timeStr !== "TBA" ? timeStr : "—"}</div>
                          {timeStr === "TBA" && <div style={{ fontSize: 9, color: "#333" }}>TBA</div>}
                        </div>

                        {/* Main content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* School + matchup */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                            {ev.game.arlington && <span style={{ fontSize: 10, color: "#f7c948" }}>⚡</span>}
                            <span style={{ fontSize: 13, fontWeight: 700, color: ev.past ? "#555" : "#e8eef8" }}>{ev.schoolA || ev.college}</span>
                            <span style={{ fontSize: 11, color: "#2a3a5a" }}>{away ? "at" : "vs"}</span>
                            <span style={{ fontSize: 13, color: ev.past ? "#444" : "#8899bb" }}>{oppDisplay}</span>
                            {ev.game.neutral && <span style={{ fontSize: 9, color: "#444" }}>({ev.game.neutral})</span>}
                            {ev.past && <span style={{ fontSize: 9, color: "#2a3a5a", marginLeft: 4 }}>played</span>}
                          </div>

                          {/* Athletes */}
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: watchLabel ? 4 : 0 }}>
                            {ev.players.map(p => (
                              <span key={p.name} style={{
                                fontSize: 10, color: ev.past ? "#444" : col,
                                background: `${col}15`, border: `1px solid ${col}30`,
                                borderRadius: 3, padding: "1px 6px", fontWeight: 600,
                              }}>
                                {p.name}{selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                              </span>
                            ))}
                            {ev.opponentPlayers.length > 0 && <>
                              <span style={{ fontSize: 9, color: "#2a3a5a", alignSelf: "center" }}>vs</span>
                              {ev.opponentPlayers.map(p => (
                                <span key={p.name} style={{
                                  fontSize: 10, color: "#47b8e8", background: "#47b8e815",
                                  border: "1px solid #47b8e830", borderRadius: 3, padding: "1px 6px", fontWeight: 600,
                                }}>
                                  {p.name}{selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                                </span>
                              ))}
                            </>}
                          </div>

                          {/* Conference + watch */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 9, color: "#2a3a5a" }}>{ev.game.type}</span>
                            {watchLabel && watchUrl && (
                              <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                style={{
                                  fontSize: 10, fontWeight: 700,
                                  color: free ? "#44cc44" : "#47b8e8",
                                  background: free ? "#0a2a0a" : "#0a1a2a",
                                  border: `1px solid ${free ? "#1a4a1a" : "#1a2a4a"}`,
                                  borderRadius: 4, padding: "1px 7px", textDecoration: "none",
                                }}>
                                📺 {watchLabel} ↗
                              </a>
                            )}
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}

              {/* Full month list view below calendar */}
              {!selectedDay && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, padding: "0 2px" }}>
                    All Matches — {MONTH_NAMES[cur.month]}
                  </div>
                  {(cur.events || []).length === 0 ? (
                    <div style={{ textAlign: "center", color: "#2a3a5a", fontSize: 13, padding: 24 }}>No confirmed matches this month yet</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Group by day */}
                      {Object.entries(byDay).sort(([a],[b]) => +a - +b).map(([d, evs]) => (
                        <div key={d}>
                          {/* Day header */}
                          <div style={{
                            padding: "5px 10px 3px", marginTop: 6,
                            display: "flex", alignItems: "center", gap: 8,
                          }}>
                            <div style={{
                              fontSize: 12, fontWeight: 800, color: "#8899bb",
                              minWidth: 36,
                            }}>
                              {DAY_NAMES[new Date(cur.year, cur.month, +d).getDay()]}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#c0cce8" }}>{MONTH_NAMES[cur.month].slice(0,3)} {d}</div>
                            <div style={{ height: 1, flex: 1, background: "#112040" }} />
                            <div style={{ fontSize: 10, color: "#2a3a5a" }}>{evs.length} game{evs.length !== 1 ? "s" : ""}</div>
                          </div>

                          {/* Games for this day */}
                          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 0 }}>
                          {evs.map((ev, j) => {
                            const evYears = [...new Set([...ev.players, ...ev.opponentPlayers].map(p => p.classYear))];
          const col = evYears.length === 1 ? classColor(evYears[0]) : "#e8c547";
                            const watchLabel = ev.wInfo?.conference?.label;
                            const watchUrl   = ev.wInfo?.conference?.url;
                            const free = isFreeWatch(watchLabel);
                            const timeStr = fmtTimeFull(ev.game.time);
                            const oppDisplay = ev.schoolB || fmtOpp(ev.game.opponent);
                            const away = ev.isArlingtonMatch ? false : isAway(ev.game.opponent);

                            if (isMobile) {
                              return (
                                <div key={j}
                                  onClick={() => { setActiveTab("schools"); setSelectedCollege(ev.college); }}
                                  style={{
                                    padding: "9px 11px", borderRadius: 9, cursor: "pointer",
                                    background: ev.game.arlington ? "#f7c94810" : "#0d1e3a",
                                    border: `1px solid ${ev.game.arlington ? "#f7c94840" : "#152848"}`,
                                    borderLeft: `3px solid ${ev.past ? "#333" : col}`,
                                    opacity: ev.past ? 0.55 : 1,
                                  }}
                                >
                                  {/* Line 1: time + matchup */}
                                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: timeStr !== "TBA" ? col : "#2a3a5a", flexShrink: 0 }}>
                                      {timeStr !== "TBA" ? timeStr : "TBA"}
                                    </span>
                                    {ev.game.arlington && <span style={{ fontSize: 10, color: "#f7c948" }}>⚡</span>}
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#e8eef8" }}>{ev.schoolA || ev.college}</span>
                                    <span style={{ fontSize: 10, color: "#2a3a5a" }}>{away ? "at" : "vs"}</span>
                                    <span style={{ fontSize: 12.5, color: "#8899bb" }}>{oppDisplay}</span>
                                  </div>

                                  {/* Line 2: athletes */}
                                  {(ev.players.length > 0 || ev.opponentPlayers.length > 0) && (
                                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 5 }}>
                                      {ev.players.map(p => (
                                        <span key={p.name} style={{
                                          fontSize: 9, color: col, background: `${col}15`,
                                          border: `1px solid ${col}30`, borderRadius: 3, padding: "1px 5px", fontWeight: 600,
                                        }}>
                                          {p.name.split(" ")[0][0]}. {p.name.split(" ").slice(-1)[0]}
                                          {selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                                        </span>
                                      ))}
                                      {ev.opponentPlayers.map(p => (
                                        <span key={p.name} style={{
                                          fontSize: 9, color: "#47b8e8", background: "#47b8e815",
                                          border: "1px solid #47b8e830", borderRadius: 3, padding: "1px 5px", fontWeight: 600,
                                        }}>
                                          {p.name.split(" ")[0][0]}. {p.name.split(" ").slice(-1)[0]}
                                          {selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Line 3: watch */}
                                  <div style={{ marginTop: 5 }}>
                                    {watchLabel && watchUrl ? (
                                      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        style={{
                                          fontSize: 9, fontWeight: 700,
                                          color: free ? "#44cc44" : "#47b8e8",
                                          background: free ? "#0a2a0a" : "#0a1a2a",
                                          border: `1px solid ${free ? "#1a4a1a" : "#1a2a4a"}`,
                                          borderRadius: 4, padding: "2px 7px", textDecoration: "none",
                                        }}>
                                        📺 {watchLabel.length > 22 ? watchLabel.slice(0,22)+"…" : watchLabel} ↗
                                      </a>
                                    ) : <span style={{ fontSize: 9, color: "#1a2a3a" }}>Watch TBA</span>}
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div key={j}
                                onClick={() => { setActiveTab("schools"); setSelectedCollege(ev.college); }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
                                  borderRadius: 7, cursor: "pointer", background: "transparent",
                                  opacity: ev.past ? 0.45 : 1, flexWrap: "wrap",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#ffffff07"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {/* Time */}
                                <div style={{ width: 50, flexShrink: 0, textAlign: "right", fontSize: 11, fontWeight: 700, color: timeStr !== "TBA" ? col : "#2a3a5a" }}>
                                  {timeStr !== "TBA" ? timeStr : "TBA"}
                                </div>

                                {/* ⚡ badge */}
                                <div style={{ width: 14, flexShrink: 0, textAlign: "center", fontSize: 10, color: "#f7c948" }}>
                                  {ev.game.arlington ? "⚡" : ""}
                                </div>

                                {/* School + matchup */}
                                <div style={{ flex: 1, minWidth: 120 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e8eef8" }}>{ev.schoolA || ev.college}</span>
                                  <span style={{ fontSize: 10, color: "#2a3a5a", margin: "0 5px" }}>{away ? "at" : "vs"}</span>
                                  <span style={{ fontSize: 12, color: "#8899bb" }}>{oppDisplay}</span>
                                </div>

                                {/* Athletes */}
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flexShrink: 0 }}>
                                  {ev.players.map(p => (
                                    <span key={p.name} style={{
                                      fontSize: 9, color: col, background: `${col}15`,
                                      border: `1px solid ${col}30`, borderRadius: 3, padding: "1px 5px", fontWeight: 600,
                                    }}>
                                      {p.name.split(" ")[0][0]}. {p.name.split(" ").slice(-1)[0]}
                                      {selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                                    </span>
                                  ))}
                                  {ev.opponentPlayers.map(p => (
                                    <span key={p.name} style={{
                                      fontSize: 9, color: "#47b8e8", background: "#47b8e815",
                                      border: "1px solid #47b8e830", borderRadius: 3, padding: "1px 5px", fontWeight: 600,
                                    }}>
                                      {p.name.split(" ")[0][0]}. {p.name.split(" ").slice(-1)[0]}
                                      {selectedYears.size > 1 && <span style={{ opacity: 0.5, marginLeft: 2 }}>'{String(p.classYear).slice(2)}</span>}
                                    </span>
                                  ))}
                                </div>

                                {/* Watch */}
                                {watchLabel && watchUrl ? (
                                  <a href={watchUrl} target="_blank" rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      fontSize: 9, fontWeight: 700, flexShrink: 0,
                                      color: free ? "#44cc44" : "#47b8e8",
                                      background: free ? "#0a2a0a" : "#0a1a2a",
                                      border: `1px solid ${free ? "#1a4a1a" : "#1a2a4a"}`,
                                      borderRadius: 4, padding: "2px 7px", textDecoration: "none",
                                    }}>
                                    📺 {watchLabel.length > 18 ? watchLabel.slice(0,18)+"…" : watchLabel} ↗
                                  </a>
                                ) : <span style={{ fontSize: 9, color: "#1a2a3a", flexShrink: 0 }}>Watch TBA</span>}
                              </div>
                            );
                          })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════
            MATCHUPS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === "matchups" && (() => {
          const DIV_ORDER = ["D1", "D3"];

          // Merge all matchup entries per conference into a single unified card
          const grouped = {};
          activeMatchups.forEach(m => {
            const div = m.division || "D1";
            const key = `${div}||${m.conference}`;
            if (!grouped[key]) grouped[key] = { div, conference: m.conference, matchups: [] };
            grouped[key].matchups.push(m);
          });

          // For each merged conference card, derive a smart tag pill label
          const getTag = (matchups, players) => {
            const classYearsInvolved = new Set(players ? players.map(p => p.classYear) : [2026]);
            const hasConfirmed = matchups.some(m => m.confirmed && m.pairs.length > 0);
            const hasUnconfirmed = matchups.some(m => !m.confirmed);
            const allSchools = [...new Set(matchups.flatMap(m => m.colleges))];
            const seenP = new Set();
            const totalPairs = matchups.flatMap(m => m.pairs).filter(p => {
              const k = `${p.home}|${p.away}|${p.date}`;
              if (seenP.has(k)) return false; seenP.add(k); return true;
            }).length;
            const classSpan = [...classYearsInvolved].sort();

            if (!hasConfirmed && hasUnconfirmed) return "Same Conference — No Matchup";
            if (classSpan.length === 1 && classSpan[0] === 2026) return "Confirmed Matchups";
            if (classSpan.length > 1) {
              return `${classSpan.length} Classes · ${allSchools.length} Schools · ${totalPairs} Matchup${totalPairs !== 1 ? "s" : ""}`;
            }
            return "Conference Rivals";
          };

          // ── Dynamic single-sentence description generator ───────────────
          const buildSummary = (conf, confMatchups, allColleges, allPlayers, allPairs) => {
            const totalPairs = allPairs.length;
            const schoolCount = allColleges.length;
            const playerCount = allPlayers.length;
            const classYears = [...new Set(allPlayers.map(p => p.classYear))].sort();
            const hasNoMatchup = confMatchups.every(m => !m.confirmed || m.pairs.length === 0);

            // Helper: "A, B, and C" list
            const listify = (arr) => arr.length <= 1 ? arr[0] || "" :
              arr.length === 2 ? `${arr[0]} and ${arr[1]}` :
              `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;

            // Helper: player name with year tag when multi-year selected
            const pName = (p) => selectedYears.size > 1
              ? `${p.name} '${String(p.classYear).slice(2)}`
              : p.name;

            // Build player groups per school
            const bySchool = {};
            allPlayers.forEach(p => {
              if (!bySchool[p.college]) bySchool[p.college] = [];
              bySchool[p.college].push(p);
            });

            // School label with player names inline
            const schoolLabel = (college) => {
              const ps = bySchool[college] || [];
              if (!ps.length) return college;
              return `${college} (${ps.map(pName).join(" & ")})`;
            };

            // Watch platform — pull from first pair or infer from conf name
            const watchPlatform = allPairs[0]?.watch || (
              ["Atlantic 10","CAA","Patriot League","MAAC","Ivy League","Big East","MEAC","Southern","Summit","America East","Big South"].includes(conf) ? "ESPN+"
              : ["Big Ten","SEC"].includes(conf) ? "BTN / ESPN+"
              : "ACC Network / ESPN+"
            );
            const watchNote = isFree(watchPlatform) ? "All games stream free." : `All games on ${watchPlatform}.`;

            if (hasNoMatchup) {
              const schools = listify(allColleges);
              return `${schools} share the ${conf} but don't face each other in the 2026 schedule.`;
            }

            // Single class (2026 only)
            if (classYears.length === 1) {
              const schools = listify(allColleges.map(schoolLabel));
              return `${schools} all compete in the ${conf} — ${totalPairs} confirmed head-to-head matchup${totalPairs !== 1 ? "s" : ""} across ${schoolCount} schools. ${watchNote}`;
            }

            // Multiple classes — build a cross-class summary
            const schoolsStr = listify(allColleges.map(schoolLabel));
            const classStr = listify(classYears.map(y => `'${String(y).slice(2)}`));
            return `${playerCount} Arlington alumni (${classStr}) play ${conf} soccer across ${schoolsStr} — ${totalPairs} cross-class matchup${totalPairs !== 1 ? "s" : ""}. ${watchNote}`;
          };

          // Sort by div then conference alpha
          const sortedKeys = Object.keys(grouped).sort((a, b) => {
            const divA = grouped[a].div === "D1" ? 0 : 1;
            const divB = grouped[b].div === "D1" ? 0 : 1;
            if (divA !== divB) return divA - divB;
            return grouped[a].conference.localeCompare(grouped[b].conference);
          });

          return (
            <div>
              {/* Summary line */}
              <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 22 }}>
                {selectedYears.size > 1
                  ? `${sortedKeys.length} conference groups · ${activeMatchups.filter(m => m.confirmed).reduce((a, m) => a + m.pairs.length, 0)} guaranteed matchups · Classes of ${yearsLabel}`
                  : `${sortedKeys.length} conference group${sortedKeys.length !== 1 ? "s" : ""} · ${activeMatchups.filter(m => m.confirmed).reduce((a,m) => a + m.pairs.length, 0)} confirmed matchup${activeMatchups.filter(m=>m.confirmed).reduce((a,m)=>a+m.pairs.length,0)!==1?"s":""}`}
              </div>

              {DIV_ORDER.map(div => {
                const divKeys = sortedKeys.filter(k => grouped[k].div === div);
                if (!divKeys.length) return null;
                return (
                  <div key={div}>
                    {/* Division separator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, marginTop: div === "D3" ? 32 : 0 }}>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a3260, transparent)" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: div === "D1" ? "#2a7dd4" : "#44aa88", textTransform: "uppercase", background: div === "D1" ? "#2a7dd418" : "#44aa8818", border: `1px solid ${div === "D1" ? "#2a7dd440" : "#44aa8840"}`, borderRadius: 4, padding: "3px 10px" }}>
                        NCAA {div}
                      </span>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #1a3260)" }} />
                    </div>

                    {divKeys.map(key => {
                      const { conference: conf, matchups: confMatchupsAll } = grouped[key];

                      // Only include matchup entries whose required classes are all selected
                      const confMatchups = confMatchupsAll.filter(m =>
                        !m.requires || m.requires.length === 0 ||
                        m.requires.every(y => selectedYears.has(String(y)) || selectedYears.has(y))
                      );

                      // Merge all data across active entries, deduplicating pairs by home+away+date
                      const allColleges   = [...new Set(confMatchups.flatMap(m => m.colleges))].sort();
                      const seenPairs     = new Set();
                      const allPairs      = confMatchups.flatMap(m => m.pairs).filter(p => {
                        const k = `${p.home}|${p.away}|${p.date}`;
                        if (seenPairs.has(k)) return false;
                        seenPairs.add(k); return true;
                      });
                      const allPlayers    = activePlayers.filter(p => allColleges.includes(p.college));
                      const hasOlder      = confMatchups.some(m => m.requires && m.requires.length > 0);
                      const hasConfirmed  = confMatchups.some(m => m.confirmed);
                      const hasNoMatchup  = confMatchups.every(m => !m.confirmed || m.pairs.length === 0);
                      const tag           = getTag(confMatchups, allPlayers);

                      // Accent: gold for pure 2026-only, purple for any cross-class, grey for no matchup
                      const accentColor = !hasConfirmed || hasNoMatchup ? "#444" : hasOlder ? "#C8102E" : "#f7c948";
                      const accentDim   = !hasConfirmed || hasNoMatchup ? "#1a3260" : hasOlder ? "#8c0b1f" : "#7a6324";

                      // Class years represented in this conference
                      const classYearsHere = [...new Set(allPlayers.map(p => p.classYear))].sort();

                      return (
                        <div key={key} style={{
                          marginBottom: 20,
                          background: hasConfirmed && !hasNoMatchup
                            ? (hasOlder ? "linear-gradient(160deg,#081428,#041020)" : "linear-gradient(160deg,#0d1e3a,#091528)")
                            : "#0b1a32",
                          border: `1px solid ${accentDim}`,
                          borderRadius: 14,
                          overflow: "hidden",
                        }}>

                          {/* Conference header */}
                          <div style={{
                            padding: "16px 22px 14px",
                            borderBottom: `1px solid ${accentDim}88`,
                            background: hasConfirmed && !hasNoMatchup ? `linear-gradient(90deg, ${accentColor}12, transparent)` : "transparent",
                            display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 4, borderRadius: 2, background: accentColor, alignSelf: "stretch", minHeight: 40 }} />
                              <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                  {conf}
                                </div>
                                <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                  {/* Single smart tag pill */}
                                  <span style={{
                                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                                    background: hasNoMatchup ? "#0d1e3a" : hasOlder ? "#c8102e20" : "#f7c94820",
                                    color: hasNoMatchup ? "#555" : hasOlder ? "#e83050" : "#f7c948",
                                    border: `1px solid ${hasNoMatchup ? "#333" : hasOlder ? "#c8102e40" : "#f7c94840"}`,
                                    borderRadius: 4, padding: "2px 9px",
                                  }}>
                                    {tag}
                                  </span>
                                  {/* Class year dots */}
                                  {selectedYears.size > 1 && classYearsHere.map(y => (
                                    <span key={y} style={{ fontSize: 9, color: y === 2026 ? "#e8c547" : "#C8102E", opacity: 0.8 }}>
                                      ●'{String(y).slice(2)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* School pills */}
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: "55%" }}>
                              {allColleges.map(c => {
                                const schoolPlayers = allPlayers.filter(p => p.college === c);
                                const years = [...new Set(schoolPlayers.map(p => p.classYear))];
                                const isMultiYear = selectedYears.size > 1 && years.length > 0;
                                return (
                                  <span key={c} style={{ fontSize: 11, background: "#ffffff08", border: "1px solid #ffffff18", borderRadius: 5, padding: "3px 9px", color: "#bbb", fontWeight: 600 }}>
                                    {c}{isMultiYear && <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.5 }}>'{years.map(y=>String(y).slice(2)).join(",")}</span>}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Body: description, players, matchup pairs */}
                          <div style={{ padding: "14px 22px 18px" }}>

                            {/* Single dynamic summary sentence */}
                            <p style={{ fontSize: 13, color: "#8899bb", margin: "0 0 14px", lineHeight: 1.7 }}>
                              {buildSummary(conf, confMatchups, allColleges, allPlayers, allPairs)}
                            </p>

                            {/* All players */}
                            {allPlayers.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: allPairs.length ? 14 : 0 }}>
                                {allPlayers.map(p => (
                                  <div key={`${p.name}-${p.classYear}`} style={{
                                    background: "#ffffff06",
                                    border: "1px solid #ffffff12",
                                    borderRadius: 7, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6,
                                  }}>
                                    <span style={{ fontSize: 11 }}>⚽</span>
                                    <div>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "#ddd" }}>{p.name}</div>
                                      <div style={{ fontSize: 10, color: "#555" }}>
                                        {p.college}{selectedYears.size > 1 && <span style={{ marginLeft: 4, opacity: 0.6 }}>'{String(p.classYear).slice(2)}</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* All matchup pairs, deduped by home+away */}
                            {allPairs.length > 0 && (() => {
                              const seen = new Set();
                              const dedupedPairs = allPairs.filter(pair => {
                                const k = `${pair.home}|${pair.away}`;
                                if (seen.has(k)) return false;
                                seen.add(k);
                                return true;
                              });
                              return (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                  {dedupedPairs.map((pair, i) => {
                                    const hp = activePlayers.filter(p => p.college === pair.home).map(p => p.name.split(" ")[0]);
                                    const ap = activePlayers.filter(p => p.college === pair.away).map(p => p.name.split(" ")[0]);
                                    const watchFree = isFree(pair.watch);
                                    return (
                                      <div key={i} style={{ background: "#ffffff05", border: "1px solid #ffffff10", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                                        <div style={{ marginBottom: 3 }}>
                                          <span style={{ color: "#f7c948", fontWeight: 700 }}>{hp.join(" & ") || pair.home}</span>
                                          <span style={{ color: "#444", margin: "0 6px" }}>vs</span>
                                          <span style={{ color: "#47b8e8", fontWeight: 700 }}>{ap.join(" & ") || pair.away}</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "#555", marginBottom: 5 }}>{pair.date} · {pair.time} · {pair.home} (H)</div>
                                        <a href={pair.watchUrl} target="_blank" rel="noopener noreferrer" style={{
                                          display: "inline-block", fontSize: 10, fontWeight: 700,
                                          background: watchFree ? "#0a2a0a" : "#0a0a2a",
                                          color: watchFree ? "#44cc44" : "#47b8e8",
                                          border: `1px solid ${watchFree ? "#1a4a1a" : "#1a1a4a"}`,
                                          borderRadius: 4, padding: "2px 8px", textDecoration: "none",
                                        }}>
                                          {watchFree ? "📺 Free" : "📺"} {pair.watch} ↗
                                        </a>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <div style={{ marginTop: 8, padding: "13px 17px", background: "#080f1e", border: "1px solid #1a1a2a", borderRadius: 8, fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                ⚡ Atlantic 10 dates confirmed from official schedules. Other dates are estimated — exact dates publish when programs release full 2026 schedules.{selectedYears.size > 1 && " Class year dots (●'26 ●'25…) indicate which graduating classes have athletes at each school."} ESPN+ ~$10.99/mo or Disney Bundle.
              </div>
            </div>
          );
        })()}

        {/* ── ATHLETES TAB ── */}
        {activeTab === "athletes" && (() => {
          const yearColor = { 2026: "#e8c547", 2025: "#e83050", 2024: "#47e8b8", 2023: "#47b8e8" };
          const yearBg    = { 2026: "#e8c54718", 2025: "#c8102e18", 2024: "#47e8b818", 2023: "#47b8e818" };

          const lastName = (p) => p.name.split(" ").slice(-1)[0];

          const sorted = [...activePlayers].sort((a, b) => {
            const favA = favAthletes.has(a.name) ? 0 : 1;
            const favB = favAthletes.has(b.name) ? 0 : 1;
            if (favA !== favB) return favA - favB;
            if (athleteSort === "firstName")  return a.name.localeCompare(b.name);
            if (athleteSort === "lastName")   return lastName(a).localeCompare(lastName(b));
            if (athleteSort === "gradYear")   return a.classYear - b.classYear || lastName(a).localeCompare(lastName(b));
            if (athleteSort === "school")     return a.college.localeCompare(b.college) || lastName(a).localeCompare(lastName(b));
            return 0;
          });

          const favList   = sorted.filter(p => favAthletes.has(p.name));
          const otherList = sorted.filter(p => !favAthletes.has(p.name));

          const SORTS = [
            { id: "firstName", label: "First Name" },
            { id: "lastName",  label: "Last Name" },
            { id: "gradYear",  label: "Grad Year" },
            { id: "school",    label: "School" },
          ];

          const AthleteRow = ({ p, isFav }) => (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "24px 1fr auto" : "28px 1fr 1fr auto auto",
              gap: isMobile ? 8 : 10, alignItems: "center",
              padding: isMobile ? "10px 12px" : "10px 16px", borderBottom: "1px solid #112040",
              background: isFav ? "linear-gradient(90deg,#e8c54708,transparent)" : "transparent",
            }}>
              {/* Star */}
              <button onClick={(e) => toggleFavAthlete(e, p.name, p.college)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: 16, color: isFav ? "#e8c547" : "#2a3a5a", lineHeight: 1,
                transition: "color 0.15s",
              }} title={isFav ? "Remove from favorites" : "Add to favorites"}>
                {isFav ? "★" : "☆"}
              </button>
              {/* Name (+ school inline below on mobile) */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8eef8" }}>{p.name}</div>
                {p.note && <div style={{ fontSize: 10, color: "#555", fontStyle: "italic", marginTop: 1 }}>{p.note}</div>}
                {isMobile && (
                  <button onClick={() => { setActiveTab("schools"); setSelectedCollege(p.college); }} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", marginTop: 2, display: "block",
                  }}>
                    <span style={{ fontSize: 11, color: "#2a7dd4", fontWeight: 600 }}>{p.college}</span>
                    <span style={{ fontSize: 10, color: "#555" }}> · {p.conference} · {p.division}</span>
                  </button>
                )}
              </div>
              {/* School — clickable (desktop only, own column) */}
              {!isMobile && (
                <button onClick={() => { setActiveTab("schools"); setSelectedCollege(p.college); }} style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
                }}>
                  <div style={{ fontSize: 12, color: "#2a7dd4", fontWeight: 600 }}>{p.college}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>{p.conference} · {p.division}</div>
                </button>
              )}
              {/* Grad year + unconfirmed flag, stacked on mobile */}
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-end" : "center", gap: isMobile ? 3 : 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: yearColor[p.classYear], background: yearBg[p.classYear], border: `1px solid ${yearColor[p.classYear]}40`, borderRadius: 4, padding: "2px 8px", whiteSpace: "nowrap" }}>
                  '{String(p.classYear).slice(2)}
                </span>
                {p.unconfirmed && <span style={{ fontSize: 9, color: "#e86420", border: "1px solid #e8642030", borderRadius: 3, padding: "1px 5px" }}>⚠</span>}
              </div>
            </div>
          );

          return (
            <div>
              {/* Sort controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#555" }}>Sort by:</span>
                {SORTS.map(s => (
                  <button key={s.id} onClick={() => setAthleteSort(s.id)} style={{
                    padding: "5px 13px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                    border: athleteSort === s.id ? "none" : "1px solid #1a3260",
                    background: athleteSort === s.id ? "#2a7dd4" : "transparent",
                    color: athleteSort === s.id ? "#fff" : "#666", fontWeight: athleteSort === s.id ? 700 : 400,
                  }}>{s.label}</button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#555" }}>
                  {activePlayers.length} athletes{favList.length > 0 ? ` · ${favList.length} favorited` : ""}
                </span>
              </div>

              <div style={{ background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 12, overflow: "hidden" }}>
                {/* Column headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "24px 1fr auto" : "28px 1fr 1fr auto auto",
                  gap: isMobile ? 8 : 10, padding: isMobile ? "8px 12px" : "8px 16px", background: "#081428", borderBottom: "1px solid #1a3260",
                }}>
                  <div />
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Athlete{isMobile ? " / School" : ""}</div>
                  {!isMobile && <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>School</div>}
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: isMobile ? "right" : "left" }}>Class</div>
                  {!isMobile && <div />}
                </div>

                {/* Favorites section */}
                {favList.length > 0 && (
                  <>
                    <div style={{ padding: "6px 16px", background: "#e8c54710", borderBottom: "1px solid #e8c54720" }}>
                      <span style={{ fontSize: 9, color: "#e8c547", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>★ Favorites</span>
                    </div>
                    {favList.map(p => <AthleteRow key={p.name} p={p} isFav={true} />)}
                    <div style={{ padding: "6px 16px", background: "#112040", borderBottom: "1px solid #1a3260" }}>
                      <span style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>All Athletes</span>
                    </div>
                  </>
                )}

                {/* All athletes */}
                {otherList.map(p => <AthleteRow key={p.name} p={p} isFav={false} />)}
              </div>
            </div>
          );
        })()}

        {/* ── SCHOOLS TAB ── */}
        {activeTab === "schools" && (
          <>
            <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
              {["All", "D1", "D2", "D3"].map(div => (
                <button key={div} onClick={() => setFilterDiv(div)} style={{
                  padding: "5px 15px", borderRadius: 20, border: filterDiv === div ? "none" : "1px solid #333",
                  background: filterDiv === div ? (div === "D1" ? "#e8c547" : div === "D2" ? "#47e847" : div === "D3" ? "#C8102E" : "#fff") : "transparent",
                  color: filterDiv === div ? "#000" : "#888", cursor: "pointer", fontWeight: filterDiv === div ? 700 : 400, fontSize: 12,
                }}>{div === "All" ? "All Divisions" : `NCAA ${div}`}</button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                {Object.entries(STATUS_BADGE).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 9, background: v.bg, color: v.text, border: `1px solid ${v.border}`, borderRadius: 3, padding: "2px 6px", fontWeight: 600 }}>{v.label}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : (selectedCollege ? "300px 1fr" : "1fr"), gap: isMobile ? 14 : 18 }}>

              {/* School cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, order: isMobile && selectedCollege ? 2 : 0 }}>
                {filteredColleges.map((college, idx) => {
                  const players = activePlayers.filter(p => p.college === college);
                  const div = players[0]?.division;
                  const conf = players[0]?.conference;
                  const isSelected = selectedCollege === college;
                  const badge = DIV_BADGE[div] || DIV_BADGE["D1"];
                  const sched = liveSchedules[college];
                  const statusB = STATUS_BADGE[sched?.status || "tba"];
                  const hasUnconfirmed = players.some(p => p.unconfirmed);
                  const allUnconfirmed = players.every(p => p.unconfirmed);
                  const hasMatchup = activeMatchups.some(m => m.confirmed && m.colleges.includes(college));
                  const playerYears = [...new Set(players.map(p => p.classYear))].sort().reverse();
                  const watchLabel = getPrimaryWatch(college);
                  const isFav = favSchools.has(college);
                  const prevIsFav = idx > 0 ? favSchools.has(filteredColleges[idx - 1]) : true;

                  // Next upcoming game for this school
                  const sched2 = liveSchedules[college];
                  const nextGame = (() => {
                    if (!sched2?.games) return null;
                    for (const g of sched2.games) {
                      if (g.type === "Exhibition") continue;
                      const gd = parseGameDate(g.date, g.time);
                      if (!gd) continue;
                      if (new Date(gd.getTime() + 3 * 60 * 60 * 1000) < now) continue;
                      return { game: g, date: gd };
                    }
                    return null;
                  })();
                  const nextOpp = nextGame
                    ? nextGame.game.opponent.replace(" ⚡", "").replace(/\s*\(.*?\)\s*$/, "")
                    : null;
                  const nextDateLabel = nextGame
                    ? (() => {
                        const d = nextGame.date;
                        const mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        if (isToday(d)) return "Today";
                        if (isTomorrow(d)) return "Tomorrow";
                        return `${mons[d.getMonth()]} ${d.getDate()}`;
                      })()
                    : null;

                  return (
                    <React.Fragment key={college}>
                      {/* Divider between pinned favs and the rest */}
                      {isFav === false && prevIsFav === true && favSchools.size > 0 && filteredColleges.some(c => favSchools.has(c)) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
                          <div style={{ flex: 1, height: 1, background: "#1a3260" }} />
                          <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>All Schools</span>
                          <div style={{ flex: 1, height: 1, background: "#1a3260" }} />
                        </div>
                      )}
                    <div onClick={() => setSelectedCollege(isSelected ? null : college)} style={{
                      background: isFav ? "linear-gradient(135deg,#1a1500,#0d1e3a)" : isSelected ? "linear-gradient(135deg,#1a0a40,#0a1a40)" : "#0d1e3a",
                      border: isFav ? "1px solid #e8c54740" : isSelected ? "1px solid #2a7dd4" : hasMatchup ? "1px solid #3a2a1a" : "1px solid #112040",
                      borderRadius: 9, padding: "11px 14px", cursor: "pointer",
                      boxShadow: isFav ? "0 0 12px rgba(232,197,71,0.1)" : isSelected ? "0 0 18px rgba(100,70,200,0.3)" : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            {/* Star button */}
                            <button onClick={(e) => toggleFavSchool(e, college)} style={{
                              background: "none", border: "none", cursor: "pointer", padding: "0 2px 0 0",
                              fontSize: 14, color: isFav ? "#e8c547" : "#2a3a5a", lineHeight: 1, flexShrink: 0,
                            }} title={isFav ? "Remove from favorites" : "Favorite this school"}>
                              {isFav ? "★" : "☆"}
                            </button>
                            <span style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#e8c547" : isFav ? "#e8c547" : "#ddd" }}>{college}</span>
                            {hasMatchup && <span style={{ fontSize: 9, color: "#f7c948", background: "#f7c94815", border: "1px solid #f7c94830", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>⚡ RIVAL</span>}
                            {selectedYears.size > 1 && playerYears.map(y => (
                              <span key={y} style={{ fontSize: 9, color: y === 2026 ? "#e8c547" : "#e83050", background: y === 2026 ? "#e8c54715" : "#c8102e15", border: `1px solid ${y === 2026 ? "#e8c54730" : "#c8102e30"}`, borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>'{String(y).slice(2)}</span>
                            ))}
                            {hasUnconfirmed && <span style={{ fontSize: 9, color: "#e86420", background: "#f9731615", border: "1px solid #f9731630", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>⚠ UNCONFIRMED</span>}
                            <span style={{ fontSize: 9, background: statusB.bg, color: statusB.text, border: `1px solid ${statusB.border}`, borderRadius: 3, padding: "1px 5px", fontWeight: 600 }}>{statusB.label}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{conf}</div>
                          {watchLabel && (
                            <div style={{ fontSize: 10, marginTop: 4, color: isFree(watchLabel) ? "#44cc44" : isEspnPlus(watchLabel) ? "#47b8e8" : "#aaa" }}>
                              📺 {watchLabel}
                            </div>
                          )}
                        </div>
                        {/* Division badge — top right */}
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: badge.bg, color: badge.text, marginLeft: 8, flexShrink: 0 }}>{div}</span>
                      </div>
                      <div style={{ marginTop: 7, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        {/* Player chips */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
                          {players.map(p => (
                            <span key={p.name} style={{ fontSize: 10, background: p.unconfirmed ? "#1a1000" : p.classYear === 2025 ? "#1a0510" : "#0b1a32", border: `1px solid ${p.unconfirmed ? "#f9731640" : p.classYear === 2025 ? "#8c0b1f" : "#2a2a44"}`, borderRadius: 3, padding: "2px 6px", color: p.unconfirmed ? "#e86420" : p.classYear === 2025 ? "#e83050" : "#aaa" }}>
                              {p.unconfirmed ? "⚠ " : ""}{p.name} <span style={{ marginLeft: 2, fontSize: 9, opacity: 0.7 }}>'{String(p.classYear).slice(2)}</span>
                            </span>
                          ))}
                        </div>
                        {/* Next match — bottom right */}
                        <div style={{ textAlign: "right", marginLeft: 12, flexShrink: 0 }}>
                          <div style={{ fontSize: 8, color: "#8899bb", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 2 }}>Next Match:</div>
                          {nextGame ? (
                            <>
                              <div style={{ fontSize: 10, fontWeight: 700, color: isToday(nextGame.date) ? "#C8102E" : isTomorrow(nextGame.date) ? "#e86420" : "#8899bb", whiteSpace: "nowrap" }}>
                                {nextDateLabel}
                              </div>
                              <div style={{ fontSize: 10, color: "#555", maxWidth: 110, textAlign: "right", lineHeight: 1.3 }}>
                                {nextOpp}
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: 9, color: "#2a3a5a" }}>TBA</div>
                          )}
                        </div>
                      </div>
                    </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Schedule panel */}
              {selectedCollege && schedule && (
                <div ref={schedulePanelRef} style={{ order: isMobile ? 1 : 0, scrollMarginTop: 16 }}>
                  {isMobile && (
                    <button onClick={() => setSelectedCollege(null)} style={{
                      display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                      background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 8,
                      color: "#8899bb", fontSize: 12, padding: "7px 12px", cursor: "pointer",
                    }}>← All schools</button>
                  )}
                  <div style={{
                    background: "#0d1e3a", border: "1px solid #2a2a44", borderRadius: 11, overflow: "hidden",
                    animation: scheduleJustOpened ? "schedulePanelFlash 1.4s ease-out" : "none",
                  }}>
                    {/* Header */}
                    <div style={{ background: "linear-gradient(135deg,#1a0a40,#0a2040)", padding: "16px 20px", borderBottom: "1px solid #2a2a44" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#1a4a80", textTransform: "uppercase" }}>2026 Fall Season</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: STATUS_BADGE[schedule.status].bg, color: STATUS_BADGE[schedule.status].text, border: `1px solid ${STATUS_BADGE[schedule.status].border}` }}>{STATUS_BADGE[schedule.status].label}</span>
                      </div>
                      <div style={{ fontSize: 19, fontWeight: 800, color: "#e8c547" }}>{schedule.fullName}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 5, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#888" }}>📍 {schedule.location}</span>
                        <span style={{ fontSize: 11, color: "#888" }}>🏟️ {schedule.stadium}</span>
                      </div>

                      {/* 2025 Record */}
                      {schedule.record2025 && (
                        <div style={{ marginTop: 9, background: "rgba(100,180,100,0.07)", border: "1px solid rgba(100,180,100,0.25)", borderRadius: 5, padding: "7px 10px" }}>
                          <div style={{ fontSize: 9, color: "#6aaa6a", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>2025 Season</div>
                          <div style={{ fontSize: 12, color: "#a8d8a8", lineHeight: 1.5 }}>{schedule.record2025}</div>
                        </div>
                      )}

                      {/* Schedule notes */}
                      {schedule.notes && (
                        <div style={{ marginTop: 7, background: "rgba(255,200,50,0.07)", border: "1px solid rgba(255,200,50,0.2)", borderRadius: 5, padding: "6px 10px", fontSize: 11, color: "#c8a840" }}>ℹ️ {schedule.notes}</div>
                      )}

                      {/* Arlington Athletes */}
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                          <div style={{ fontSize: 10, color: "#1a4a80", letterSpacing: "0.1em", textTransform: "uppercase" }}>Arlington Athletes</div>
                          {watchInfo?.roster && watchInfo.roster !== "#" && (
                            <a href={watchInfo.roster} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#C8102E", textDecoration: "none", border: "1px solid #8c0b1f", borderRadius: 4, padding: "2px 8px" }}>📋 Roster ↗</a>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {selectedPlayers.map(p => (
                            <div key={`${p.name}-${p.classYear}`} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 11, background: p.unconfirmed ? "#1a1000" : "#0f2448", border: `1px solid ${p.unconfirmed ? "#f9731640" : "#1a3260"}`, borderRadius: 18, padding: "3px 9px", color: p.unconfirmed ? "#e86420" : "#ccc", fontWeight: 600 }}>
                                {p.unconfirmed ? "⚠ " : "⚽ "}{p.name}{selectedYears.size > 1 && <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.6 }}>'{String(p.classYear).slice(2)}</span>}
                              </span>
                              {p.note && <span style={{ fontSize: 9, color: "#666", paddingLeft: 9, fontStyle: "italic" }}>{p.note}</span>}
                            </div>
                          ))}
                        </div>
                        {selectedPlayers.some(p => p.unconfirmed) && (
                          <div style={{ marginTop: 6, fontSize: 10, color: "#e86420", background: "#f9731610", border: "1px solid #f9731630", borderRadius: 4, padding: "4px 8px" }}>
                            ⚠ Enrollment unconfirmed — original commitment shown. Updates pending roster cross-check.
                          </div>
                        )}
                      </div>

                      {/* How to Watch box */}
                      {watchInfo && (
                        <div style={{ marginTop: 10, background: "rgba(71,184,232,0.05)", border: "1px solid rgba(71,184,232,0.2)", borderRadius: 7, padding: "10px 12px" }}>
                          <div style={{ fontSize: 11, color: "#47b8e8", fontWeight: 700, marginBottom: 6 }}>📺 HOW TO WATCH</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Conference Games</div>
                              <a href={watchInfo.conference.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: isFree(watchInfo.conference.label) ? "#44cc44" : "#47b8e8", textDecoration: "none", marginBottom: 3 }}>
                                {watchInfo.conference.label} ↗
                              </a>
                              <div style={{ fontSize: 10, color: "#555", lineHeight: 1.5 }}>{watchInfo.conference.note}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Non-Conference</div>
                              <a href={watchInfo.nonConf.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: isFree(watchInfo.nonConf.label) ? "#44cc44" : "#47b8e8", textDecoration: "none", marginBottom: 3 }}>
                                {watchInfo.nonConf.label} ↗
                              </a>
                              <div style={{ fontSize: 10, color: "#555", lineHeight: 1.5 }}>{watchInfo.nonConf.note}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <a href={watchInfo.liveStats} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#888", textDecoration: "none", border: "1px solid #333", borderRadius: 4, padding: "2px 8px" }}>📊 Live Stats ↗</a>
                            <span style={{ fontSize: 10, color: "#555", border: "1px solid #222", borderRadius: 4, padding: "2px 8px" }}>App: {watchInfo.app}</span>
                          </div>
                        </div>
                      )}

                      {rivals.size > 0 && (
                        <div style={{ marginTop: 8, background: "rgba(247,201,72,0.05)", border: "1px solid rgba(247,201,72,0.22)", borderRadius: 5, padding: "6px 10px" }}>
                          <span style={{ fontSize: 11, color: "#f7c948", fontWeight: 700 }}>⚡ Arlington Rivalries: </span>
                          <span style={{ fontSize: 11, color: "#bbb" }}>{[...rivals].join(" · ")} — highlighted below</span>
                        </div>
                      )}
                    </div>

                    {/* Games */}
                    <div style={{ padding: "3px 0" }}>
                      {schedule.games.map((game, i) => {
                        const watchLink = getGameWatch(selectedCollege, game.type);
                        return (
                          <div key={i} style={{
                            display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 8,
                            padding: "9px 16px", borderBottom: i < schedule.games.length - 1 ? "1px solid #1a1a2a" : "none",
                            alignItems: "center",
                            background: game.arlington ? "linear-gradient(90deg,rgba(247,201,72,0.07),rgba(255,107,53,0.04))" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                            borderLeft: game.arlington ? "3px solid #f7c948" : "3px solid transparent",
                          }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: game.arlington ? "#f7c948" : "#ccc" }}>{game.date}</div>
                              <div style={{ fontSize: 10, color: "#555" }}>{game.day}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 12, color: "#ddd", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 9, background: game.home ? "#0a2a0a" : "#2a0a0a", color: game.home ? "#44cc44" : "#cc4444", border: `1px solid ${game.home ? "#1a4a1a" : "#4a1a1a"}`, borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>{game.home ? "H" : "A"}</span>
                                <span style={{ color: game.arlington ? "#ffe08a" : "#ddd" }}>{game.opponent}</span>
                                {game.arlington && <span style={{ fontSize: 9, color: "#f7c948", background: "#f7c94818", border: "1px solid #f7c94832", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>⚡ ARLINGTON</span>}
                              </div>
                              <div style={{ display: "flex", gap: 6, marginTop: 3, alignItems: "center", flexWrap: "wrap" }}>
                                {game.time !== "TBA" && <span style={{ fontSize: 10, color: "#555" }}>🕐 {game.time}</span>}
                                {watchLink && game.type !== "Exhibition" && (
                                  <a href={watchLink.url} target="_blank" rel="noopener noreferrer" style={{
                                    fontSize: 9, textDecoration: "none", fontWeight: 600,
                                    color: isFree(watchLink.label) ? "#44cc44" : "#47b8e8",
                                    background: isFree(watchLink.label) ? "#0a2a0a" : "#0a0a2a",
                                    border: `1px solid ${isFree(watchLink.label) ? "#1a4a1a" : "#1a1a4a"}`,
                                    borderRadius: 3, padding: "1px 6px",
                                  }}>
                                    📺 {isFree(watchLink.label) ? "Free Stream" : watchLink.label.split(" ")[0]} ↗
                                  </a>
                                )}
                              </div>
                            </div>
                            <span style={{ fontSize: 9, background: "rgba(0,0,0,0.3)", border: `1px solid ${getTypeColor(game.type)}44`, color: getTypeColor(game.type), borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap", fontWeight: 600 }}>{game.type}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "10px 16px", borderTop: "1px solid #1a1a2a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontSize: 10, color: "#444" }}>
                        {schedule.games.filter(g => g.type !== "Exhibition").length} matches · {schedule.games.filter(g => g.home).length}H / {schedule.games.filter(g => !g.home).length}A
                        {schedule.games.filter(g => g.arlington).length > 0 && <span style={{ color: "#f7c948", marginLeft: 8 }}>· ⚡ {schedule.games.filter(g => g.arlington).length} Arlington matchup{schedule.games.filter(g => g.arlington).length > 1 ? "s" : ""}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {watchInfo?.roster && watchInfo.roster !== "#" && (
                          <a href={watchInfo.roster} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#C8102E", textDecoration: "none" }}>📋 Roster ↗</a>
                        )}
                        <a href={schedule.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2a7dd4", textDecoration: "none" }}>Official Schedule ↗</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TBD players */}
            {(() => { const tbdPlayers = activePlayers.filter(p => p.college === "TBD"); return tbdPlayers.length > 0 && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#0d1e3a", border: "1px solid #1a3260", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#C8102E", fontWeight: 700, marginBottom: 8 }}>✦ Grads — College Destination Unconfirmed</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tbdPlayers.map(p => (
                    <span key={p.name} style={{ fontSize: 12, background: "#1a0510", border: "1px solid #8c0b1f", borderRadius: 6, padding: "4px 10px", color: "#e83050" }}>
                      ⚽ {p.name} <span style={{ opacity: 0.6, fontSize: 10 }}>'{String(p.classYear).slice(2)}</span>
                    </span>
                  ))}
                </div>
              </div>
            ); })()}

            {/* Streaming guide footer */}
            <div style={{ marginTop: 24, padding: "14px 18px", background: "#080f1e", border: "1px solid #1a1a2a", borderRadius: 8, fontSize: 11, color: "#555", lineHeight: 1.8 }}>
              <div style={{ fontWeight: 700, color: "#666", marginBottom: 8, fontSize: 12 }}>📺 Streaming Guide</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                <div><span style={{ color: "#47b8e8", fontWeight: 700 }}>ESPN+</span> — $10.99/mo or Disney Bundle ($15.99/mo with Disney+ & Hulu). Covers Atlantic 10, CAA, Patriot League, MAAC, Horizon, Southern Conf. <a href="https://www.espnplus.com" target="_blank" rel="noopener noreferrer" style={{ color: "#47b8e8" }}>espnplus.com ↗</a></div>
                <div><span style={{ color: "#47b8e8", fontWeight: 700 }}>B1G+</span> — $9.95/mo. All Big Ten women's soccer (USC). BTN selected games free with cable. <a href="https://b1gplus.com" target="_blank" rel="noopener noreferrer" style={{ color: "#47b8e8" }}>b1gplus.com ↗</a></div>
                <div><span style={{ color: "#44cc44", fontWeight: 700 }}>Free Streams</span> — All D3 schools (Emory, VWU, Randolph, Oberlin, Wooster, Williams, Marymount) stream games free on their athletics websites. No subscription needed.</div>
                <div><span style={{ color: "#aaa", fontWeight: 700 }}>Live Stats</span> — Every school offers free live stats on their athletics site even when video isn't available. Links on each school's schedule card above.</div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #1a1a2a", color: "#444" }}>
                <span style={{ color: "#44cc44", fontWeight: 600 }}>✓ CONFIRMED</span>: Duquesne, VCU, Towson, Campbell, Richmond schedules confirmed. <span style={{ color: "#cccc44", fontWeight: 600 }}>~ PARTIAL</span>: Lehigh has one confirmed date. <span style={{ color: "#1a4a80", fontWeight: 600 }}>SCHEDULE TBA</span>: All others not yet published as of July 2026. <span style={{ color: "#e86420", fontWeight: 600 }}>⚠ UNCONFIRMED</span>: Original college commitment shown — current enrollment status pending verification.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
