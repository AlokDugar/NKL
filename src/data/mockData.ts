import { Trophy, Calendar, Users, Award, Video, Newspaper } from 'lucide-react';

export const ABOUT_CONTENT = {
  title: "Astrionix Management P. Ltd.",
  description:
    "Astrionix Management Pvt Ltd, a proud affiliate of the Begani Group with a legacy spanning half a century, is thrilled to announce the Nepal Kabaddi League (NKL). NKL aims to revitalize kabaddi with modern flair, captivating audiences nationwide. Backed by extensive expertise, we are committed to delivering a world-class kabaddi experience through strategic partnerships and cutting-edge technology. The Nepal Kabaddi League is poised to redefine entertainment in Nepal, fostering a new era of sports culture where every match is a spectacle, every player a hero, and every moment unforgettable.",
  image:
    "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/keypersons/name2025-09-25-134707.png",
};

// PLAYERS
export const PLAYERS = [
  { 
    id: 1, 
    name: "GHANSHYAM ROKA MAGAR", 
    role: "Raider", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/ghanshyam-roka/photo/ghanshyam-roka2025-01-13-140204.png", 
    teamId: "kathmandu-mavericks", 
    isCaptain: true, 
    jersey: 14,
    stats: { totalPoints: 117, raidPoints: 105, tacklePoints: 12, totalMatches: 10, successfulRaids: 85, superRaids: 8, successfulTackles: 10, superTackles: 2, doOrDieRaidPoints: 15, allOutsInflicted: 5 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" },
      { season: "2024", teamId: "janakpur-knights" }
    ]
  },
  { 
    id: 2, 
    name: "SOHAIL ISLAM", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/sohail-2/photo/sohail-22025-01-13-125945.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 7,
    stats: { totalPoints: 85, raidPoints: 40, tacklePoints: 45, totalMatches: 10, successfulRaids: 30, superRaids: 2, successfulTackles: 40, superTackles: 5, doOrDieRaidPoints: 5, allOutsInflicted: 2 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" },
      { season: "2024", teamId: "biratnagar-bandits" }
    ]
  },
  { 
    id: 3, 
    name: "PRAMOD SHRESTHA", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/pramod-2/photo/pramod-22025-01-13-130135.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 15,
    stats: { totalPoints: 60, raidPoints: 30, tacklePoints: 30, totalMatches: 9, successfulRaids: 25, superRaids: 1, successfulTackles: 28, superTackles: 2, doOrDieRaidPoints: 4, allOutsInflicted: 1 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 4, 
    name: "MEGHRAJ GIRI", 
    role: "Left Cover", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/meghraj-1/photo/meghraj-12025-01-13-130200.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 9,
    stats: { totalPoints: 45, raidPoints: 5, tacklePoints: 40, totalMatches: 10, successfulRaids: 4, superRaids: 0, successfulTackles: 38, superTackles: 2, doOrDieRaidPoints: 1, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" },
      { season: "2024", teamId: "pokhara-lakers" }
    ]
  },
  { 
    id: 5, 
    name: "DURGESHWOR KOIRI", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/durgeshwor/photo/durgeshwor2025-01-13-125913.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 10,
    stats: { totalPoints: 30, raidPoints: 15, tacklePoints: 15, totalMatches: 8, successfulRaids: 12, superRaids: 0, successfulTackles: 14, superTackles: 1, doOrDieRaidPoints: 2, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 6, 
    name: "RAHUL KUMAR RAY", 
    role: "Raider", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/rahul-kumar-1/photo/rahul-kumar-12025-01-13-130731.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 11,
    stats: { totalPoints: 90, raidPoints: 85, tacklePoints: 5, totalMatches: 10, successfulRaids: 70, superRaids: 5, successfulTackles: 4, superTackles: 1, doOrDieRaidPoints: 10, allOutsInflicted: 3 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" },
      { season: "2024", teamId: "dhangadi-wild-cats" }
    ]
  },
  { 
    id: 7, 
    name: "BINAY KUMAR KOIRI", 
    role: "Left Raider", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/binay-kumar-1/photo/binay-kumar-12025-01-13-140041.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 16,
    stats: { totalPoints: 55, raidPoints: 50, tacklePoints: 5, totalMatches: 9, successfulRaids: 40, superRaids: 3, successfulTackles: 4, superTackles: 1, doOrDieRaidPoints: 5, allOutsInflicted: 1 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 8, 
    name: "SAGAR CHAUDHARY", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/sagar-3/photo/sagar-32025-01-13-130512.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 1,
    stats: { totalPoints: 40, raidPoints: 20, tacklePoints: 20, totalMatches: 8, successfulRaids: 15, superRaids: 1, successfulTackles: 18, superTackles: 2, doOrDieRaidPoints: 3, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 9, 
    name: "ALEX SAHANI", 
    role: "Right Cover", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/alex-1/photo/alex-12025-01-13-105053.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 13,
    stats: { totalPoints: 35, raidPoints: 5, tacklePoints: 30, totalMatches: 7, successfulRaids: 4, superRaids: 0, successfulTackles: 28, superTackles: 2, doOrDieRaidPoints: 1, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 10, 
    name: "BHOLA YADAV", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/bhola-1/photo/bhola-12025-01-13-105146.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 17,
    stats: { totalPoints: 25, raidPoints: 10, tacklePoints: 15, totalMatches: 6, successfulRaids: 8, superRaids: 0, successfulTackles: 14, superTackles: 1, doOrDieRaidPoints: 2, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 11, 
    name: "LAL MOHAR YADAV", 
    role: "Raider", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/lal-mohar-1/photo/lal-mohar-12025-01-13-103839.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 2,
    stats: { totalPoints: 45, raidPoints: 40, tacklePoints: 5, totalMatches: 8, successfulRaids: 35, superRaids: 2, successfulTackles: 4, superTackles: 1, doOrDieRaidPoints: 5, allOutsInflicted: 1 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 12, 
    name: "SAHARAT PHETCHUI", 
    role: "Defender", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/saharat/photo/saharat2025-01-13-104146.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 4,
    stats: { totalPoints: 50, raidPoints: 0, tacklePoints: 50, totalMatches: 10, successfulRaids: 0, superRaids: 0, successfulTackles: 45, superTackles: 5, doOrDieRaidPoints: 0, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 13, 
    name: "MD MIJANUR RAHMAN", 
    role: "Raider", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/md-mijanur/photo/md-mijanur2025-01-13-140404.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 3,
    stats: { totalPoints: 70, raidPoints: 65, tacklePoints: 5, totalMatches: 9, successfulRaids: 55, superRaids: 4, successfulTackles: 4, superTackles: 1, doOrDieRaidPoints: 8, allOutsInflicted: 2 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  { 
    id: 14, 
    name: "ROENGROM CHATURONPHAISAN", 
    role: "All Rounder", 
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/roengrom/photo/roengrom2025-01-13-104237.png", 
    teamId: "kathmandu-mavericks", 
    jersey: 5,
    stats: { totalPoints: 35, raidPoints: 15, tacklePoints: 20, totalMatches: 7, successfulRaids: 12, superRaids: 0, successfulTackles: 18, superTackles: 2, doOrDieRaidPoints: 2, allOutsInflicted: 0 },
    history: [
      { season: "2025", teamId: "kathmandu-mavericks" }
    ]
  },
  // Adding some players for other teams to populate lists
  {
    id: 15,
    name: "RAHUL CHAUDHARY",
    role: "Raider",
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/rahul-kumar-1/photo/rahul-kumar-12025-01-13-130731.png", // Placeholder
    teamId: "janakpur-knights",
    jersey: 10,
    isCaptain: true,
    stats: { totalPoints: 150, raidPoints: 140, tacklePoints: 10, totalMatches: 10, successfulRaids: 110, superRaids: 12, successfulTackles: 8, superTackles: 2, doOrDieRaidPoints: 20, allOutsInflicted: 6 },
    history: [
      { season: "2025", teamId: "janakpur-knights" },
      { season: "2024", teamId: "kathmandu-mavericks" }
    ]
  },
  {
    id: 16,
    name: "PRADEEP NARWAL",
    role: "Raider",
    image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/ghanshyam-roka/photo/ghanshyam-roka2025-01-13-140204.png", // Placeholder
    teamId: "biratnagar-bandits",
    jersey: 9,
    isCaptain: true,
    stats: { totalPoints: 130, raidPoints: 125, tacklePoints: 5, totalMatches: 10, successfulRaids: 100, superRaids: 10, successfulTackles: 4, superTackles: 1, doOrDieRaidPoints: 15, allOutsInflicted: 4 },
    history: [
      { season: "2025", teamId: "biratnagar-bandits" }
    ]
  }
];

// TEAMS + SEASON-WISE STATS
export const TEAMS = [
  // ---------------------------
  // Example: Janakpur Knights
  // ---------------------------
  {
    id: "janakpur-knights",
    name: "Janakpur Knights",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/janakpur-knights/logo/janakpur-knights2025-01-10-165146.png",
    color: "#E63946",
    coach: "ASHISH KUMAR",
    website: "",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/janakpur-knights/featured_img/janakpur-knights2025-01-10-165146.png",

    // Season Based Stats
    statsBySeason: {
      "2025": {
        overall: { played: 10, won: 7, draw: 1, lost: 2, rank: 1, highestScore: 50, biggestWinMargin: 18 },
        attack: { totalRaids: 340, successfulRaids: 200, unsuccessfulRaids: 90, emptyRaids: 50, successRate: 24.1, superRaids: 11, touchPoints: 210, bonusPoints: 60, totalRaidPoints: 330 },
        defence: { totalTackles: 120, successfulTackles: 80, unsuccessfulTackles: 40, successRate: 12.5, superTackles: 5, allOutInflicted: 20, allOutPoints: 40, totalDefencePoints: 75 }
      },
      "2024": {
        overall: { played: 8, won: 5, draw: 0, lost: 3, rank: 3, highestScore: 43, biggestWinMargin: 12 },
        attack: { totalRaids: 300, successfulRaids: 170, unsuccessfulRaids: 90, emptyRaids: 40, successRate: 21.3, superRaids: 7, touchPoints: 180, bonusPoints: 55, totalRaidPoints: 290 },
        defence: { totalTackles: 98, successfulTackles: 60, unsuccessfulTackles: 38, successRate: 10.7, superTackles: 3, allOutInflicted: 15, allOutPoints: 30, totalDefencePoints: 58 }
      },
    },
  },

  // ---------------------------
  // Kathmandu Mavericks (Your main team with provided data)
  // ---------------------------
  {
    id: "kathmandu-mavericks",
    name: "Kathmandu Mavericks",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/kathmandu-mavericks/logo/kathmandu-mavericks2025-01-08-182546.png",
    color: "#2A9D8F",
    coach: "SAROJ KUMAR SINGH",
    website: "https://www.kathmandumavericks.com",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/kathmandu-mavericks/featured_img/kathmandu-mavericks2025-01-13-141028.png",

    // Default / Current Season Stats (2025)
    stats: {
      overall: { played: 8, won: 5, draw: 1, lost: 2, rank: 2, highestScore: 56, biggestWinMargin: 0 },
      attack: { totalRaids: 325, successfulRaids: 188, unsuccessfulRaids: 64, emptyRaids: 73, successRate: 22.38, superRaids: 9, touchPoints: 179, bonusPoints: 70, totalRaidPoints: 325 },
      defence: { totalTackles: 67, successfulTackles: 67, unsuccessfulTackles: 0, successRate: 7.88, superTackles: 4, allOutInflicted: 19, allOutPoints: 38, totalDefencePoints: 71 },
    },

    // Added Season-Wise Stats
    statsBySeason: {
      "2025": {
        overall: { played: 10, won: 6, draw: 0, lost: 4, rank: 3, highestScore: 56, biggestWinMargin: 12 },
        attack: { totalRaids: 360, successfulRaids: 200, unsuccessfulRaids: 80, emptyRaids: 80, successRate: 23.1, superRaids: 10, touchPoints: 190, bonusPoints: 75, totalRaidPoints: 340 },
        defence: { totalTackles: 100, successfulTackles: 70, unsuccessfulTackles: 30, successRate: 10.0, superTackles: 5, allOutInflicted: 18, allOutPoints: 36, totalDefencePoints: 65 },
      },

      "2024": {
        overall: { played: 8, won: 4, draw: 1, lost: 3, rank: 4, highestScore: 48, biggestWinMargin: 8 },
        attack: { totalRaids: 310, successfulRaids: 160, unsuccessfulRaids: 90, emptyRaids: 60, successRate: 20.5, superRaids: 7, touchPoints: 165, bonusPoints: 60, totalRaidPoints: 285 },
        defence: { totalTackles: 85, successfulTackles: 55, unsuccessfulTackles: 30, successRate: 8.7, superTackles: 3, allOutInflicted: 14, allOutPoints: 28, totalDefencePoints: 50 },
      },
    },
  },

  // Remaining Teams (Simplified)
  {
    id: "biratnagar-bandits",
    name: "Biratnagar Bandits",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/biratnagar-bandits/logo/biratnagar-bandits2025-01-08-182916.png",
    color: "#F4A261",
    coach: "Unknown",
    website: "",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/biratnagar-bandits/featured_img/biratnagar-bandits2025-01-08-182916.png",

    statsBySeason: {
      "2025": { overall: { played: 10, won: 6, draw: 1, lost: 3, rank: 2 } },
    },
  },

  {
    id: "dhangadi-wild-cats",
    name: "Dhangadi Wild Cats",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/dhangadi-wild-cats/logo/dhangadi-wild-cats2025-01-08-183144.png",
    color: "#E9C46A",
    coach: "Unknown",
    website: "",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/dhangadi-wild-cats/featured_img/dhangadi-wild-cats2025-01-08-183144.png",

    statsBySeason: {
      "2025": { overall: { played: 10, won: 3, draw: 1, lost: 6, rank: 4 } },
    },
  },

  {
    id: "himalayan-raiders",
    name: "Himalayan Raiders",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/himalayan-raiders/logo/butwal-bulls2025-01-08-184539.png",
    color: "#264653",
    coach: "Unknown",
    website: "",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/himalayan-raiders/featured_img/butwal-bulls2025-01-08-184539.png",

    statsBySeason: {
      "2025": { overall: { played: 10, won: 2, draw: 1, lost: 7, rank: 5 } },
    },
  },

  {
    id: "pokhara-lakers",
    name: "Pokhara Lakers",
    logo: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/pokhara-lakers/logo/pokhara-lakers-12025-01-10-165337.png",
    color: "#457B9D",
    coach: "Unknown",
    website: "",
    banner: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/teams/pokhara-lakers/featured_img/pokhara-lakers-12025-01-10-165337.png",

    statsBySeason: {
      "2025": { overall: { played: 10, won: 1, draw: 1, lost: 8, rank: 6 } },
    },
  },
];

// STANDINGS
export const STANDINGS = [
  { rank: 1, teamId: "janakpur-knights", points: 23, played: 10, won: 7, lost: 2, draw: 1 },
  { rank: 2, teamId: "biratnagar-bandits", points: 21, played: 10, won: 6, lost: 3, draw: 1 },
  { rank: 3, teamId: "kathmandu-mavericks", points: 19, played: 10, won: 6, lost: 4, draw: 0 },
  { rank: 4, teamId: "dhangadi-wild-cats", points: 11, played: 10, won: 3, lost: 6, draw: 1 },
  { rank: 5, teamId: "himalayan-raiders", points: 7, played: 10, won: 2, lost: 7, draw: 1 },
  { rank: 6, teamId: "pokhara-lakers", points: 4, played: 10, won: 1, lost: 8, draw: 1 },
];

// MATCHES
export const MATCHES = [
  { 
    id: "final", 
    type: "Final", 
    team1: "janakpur-knights", 
    team2: "kathmandu-mavericks", 
    score1: 45, 
    score2: 41, 
    status: "FT", 
    date: "Jan 31, 2025", 
    time: "6:30 PM", 
    venue: "NSC Covered Hall",
    mvp: { playerId: 15, name: "RAHUL CHAUDHARY", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/rahul-kumar-1/photo/rahul-kumar-12025-01-13-130731.png", points: 18 },
    stats: {
      team1: { raidPoints: 25, tacklePoints: 15, allOutPoints: 4, extraPoints: 1 },
      team2: { raidPoints: 22, tacklePoints: 12, allOutPoints: 4, extraPoints: 3 }
    }
  },
  { 
    id: "q2", 
    type: "Qualifier 2", 
    team1: "biratnagar-bandits", 
    team2: "kathmandu-mavericks", 
    score1: 26, 
    score2: 48, 
    status: "FT", 
    date: "Jan 29, 2025", 
    time: "6:30 PM", 
    venue: "NSC Covered Hall",
    mvp: { playerId: 1, name: "GHANSHYAM ROKA MAGAR", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/ghanshyam-roka/photo/ghanshyam-roka2025-01-13-140204.png", points: 22 },
    stats: {
      team1: { raidPoints: 15, tacklePoints: 8, allOutPoints: 2, extraPoints: 1 },
      team2: { raidPoints: 28, tacklePoints: 14, allOutPoints: 4, extraPoints: 2 }
    }
  },
  { 
    id: "elim", 
    type: "Eliminator", 
    team1: "kathmandu-mavericks", 
    team2: "dhangadi-wild-cats", 
    score1: 50, 
    score2: 45, 
    status: "FT", 
    date: "Jan 27, 2025", 
    time: "6:30 PM", 
    venue: "NSC Covered Hall",
    mvp: { playerId: 6, name: "RAHUL KUMAR RAY", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/players/rahul-kumar-1/photo/rahul-kumar-12025-01-13-130731.png", points: 15 },
    stats: {
      team1: { raidPoints: 30, tacklePoints: 12, allOutPoints: 6, extraPoints: 2 },
      team2: { raidPoints: 28, tacklePoints: 10, allOutPoints: 4, extraPoints: 3 }
    }
  },
  { id: "q1", type: "Qualifier 1", team1: "janakpur-knights", team2: "biratnagar-bandits", score1: 34, score2: 32, status: "FT", date: "Jan 27, 2025", time: "5:30 PM", venue: "NSC Covered Hall" },
  { id: "l15", type: "League", team1: "pokhara-lakers", team2: "biratnagar-bandits", score1: 25, score2: 50, status: "FT", date: "Jan 25, 2025", time: "6:30 PM", venue: "NSC Covered Hall" },
  { id: "l14", type: "League", team1: "himalayan-raiders", team2: "dhangadi-wild-cats", score1: 38, score2: 41, status: "FT", date: "Jan 25, 2025", time: "5:30 PM", venue: "NSC Covered Hall" },
];

// NEWS
export const NEWS = [
  { id: 1, title: "Janakpur Knights Crowned Champions in a Thrilling 45-41 Victory Over Kathmandu Mavericks !!", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/items/janakpur-knights-crowned-champions-in-a-thrilling-45-41-victory-over-kathmandu-mavericks/janakpur-knights-crowned-champions-in-a-thrilling-45-41-victory-over-kathmandu-mavericks2025-02-01-230832.jpg", category: "News", date: "Feb 01, 2025" },
  { id: 2, title: "Kathmandu Mavericks Become the Second Finalist after winning Against Biratnagar Bandits by 48-26", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/items/kathmandu-mavericks-become-the-second-finalist-after-winning-against-biratnagar-bandits-by-48-26/kathmandu-mavericks-become-the-second-finalist-after-winning-against-biratnagar-bandits-by-48-262025-01-30-084856.jpg", category: "News", date: "Jan 30, 2025" },
  { id: 3, title: "Kathmandu Mavericks won by 50-45 Against Dhangadi Wild Cats in High-Scoring Clash", image: "https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/items/kathmandu-mavericks-won-by-50-45-against-dhangadi-wild-cats-in-high-scoring-clash/kathmandu-mavericks-won-by-50-45-against-dhangadi-wild-cats-in-high-scoring-clash2025-01-29-203513.JPG", category: "News", date: "..." },
];


export const PARTNERS = [
  { name: 'KB SAM', role: 'Title Sponsor', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/kb-sam2025-01-14-184515.jpg' },
  { name: 'Begani Group', role: 'Brought to you by', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/brough-to-you-by2025-01-14-185643.jpg' },
  { name: 'Astrionix', role: 'Organized by', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/organised-by2025-01-15-105438.jpg' },
  { name: 'Khalti', role: 'Ticketing Partner', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/ticketing-partner2025-01-14-185948.jpg' },
  { name: 'Nabil Bank', role: 'Banking Partner', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/banking-partner2025-01-14-190155.jpg' },
  { name: 'WorldLink', role: 'Connectivity Partner', logo: 'https://nepal-kabaddi-league.s3.ap-southeast-1.amazonaws.com/media/partners/connectivity-partner2025-01-17-105555.jpg' },
];

export const NAV_LINKS = [
  { name: 'Home', path: '/', icon: Trophy },
  { name: 'Matches', path: '/schedule', icon: Calendar },
  { name: 'Teams', path: '/team', icon: Users },
  { name: 'Standings', path: '/standings', icon: Award },
  { name: 'Video Hub', path: '/videohub', icon: Video },
  { name: 'News', path: '/news', icon: Newspaper },
  { name: 'About', path: '/about', icon: Users },
];

export const HERO_IMAGES = [
  './1.png',
  './2.png',
  './3.png',
];
