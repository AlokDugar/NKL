import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAMS, PLAYERS } from "../../data/mockData";
import {
  Trophy,
  Zap,
  Shield,
  Users,
  Star,
  Timer,
  Activity,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import clsx from "clsx";

// Types for our simulation
type EventType =
  | "RAID_POINT"
  | "TACKLE_POINT"
  | "SUPER_RAID"
  | "SUPER_TACKLE"
  | "ALL_OUT"
  | "DO_OR_DIE";

interface GameEvent {
  id: string;
  type: EventType;
  teamId: string;
  points: number;
  description: string;
  timestamp: number;
}

const LiveScoreCard = () => {
  // Mock initial state: Kathmandu Mavericks vs Janakpur Knights
  const teamA = TEAMS.find((t) => t.id === "kathmandu-mavericks") || TEAMS[2];
  const teamB = TEAMS.find((t) => t.id === "janakpur-knights") || TEAMS[0];

  const [scoreA, setScoreA] = useState(24);
  const [scoreB, setScoreB] = useState(22);
  const [activePlayersA, setActivePlayersA] = useState(7);
  const [activePlayersB, setActivePlayersB] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes in seconds
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  const [showAnimation, setShowAnimation] = useState<EventType | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem("liveScoreMinimized");
    return saved ? JSON.parse(saved) : false;
  });
  const [currentRaider, setCurrentRaider] = useState<string>(
    "GHANSHYAM ROKA MAGAR"
  );
  const [raidingTeam, setRaidingTeam] = useState<"A" | "B">("A");

  const matchEnded = timeRemaining === 0;

  // Save minimized state
  useEffect(() => {
    localStorage.setItem("liveScoreMinimized", JSON.stringify(isMinimized));
  }, [isMinimized]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer Loop
  useEffect(() => {
    if (matchEnded) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [matchEnded]);

  // Event Simulation Loop
  useEffect(() => {
    if (matchEnded) return;

    const eventTimer = setInterval(() => {
      if (Math.random() > 0.6) {
        // 40% chance of event every 4 seconds
        triggerRandomEvent();
      }
    }, 4000);

    return () => clearInterval(eventTimer);
  }, [matchEnded, raidingTeam, activePlayersA, activePlayersB]);

  const triggerRandomEvent = () => {
    const events: EventType[] = [
      "RAID_POINT",
      "TACKLE_POINT",
      "SUPER_RAID",
      "SUPER_TACKLE",
      "ALL_OUT",
      "DO_OR_DIE",
    ];
    // Weighted random selection
    const rand = Math.random();
    let type: EventType = "RAID_POINT";

    // Logic to determine event based on current state (simplified)
    if (activePlayersA <= 3 && raidingTeam === "B" && rand > 0.8)
      type = "SUPER_TACKLE";
    else if (activePlayersB <= 3 && raidingTeam === "A" && rand > 0.8)
      type = "SUPER_TACKLE";
    else if (activePlayersA === 1 && raidingTeam === "B" && rand > 0.7)
      type = "ALL_OUT";
    else if (activePlayersB === 1 && raidingTeam === "A" && rand > 0.7)
      type = "ALL_OUT";
    else if (rand > 0.9) type = "SUPER_RAID";
    else if (rand > 0.7) type = "DO_OR_DIE";
    else if (rand > 0.4) type = "TACKLE_POINT";
    else type = "RAID_POINT";

    const isTeamA = raidingTeam === "A"; // Current raider is from Team A
    let points = 0;
    let description = "";
    let nextRaiderTeam = raidingTeam === "A" ? "B" : "A"; // Switch turn by default

    if (type === "RAID_POINT") {
      points = 1;
      if (isTeamA) {
        setScoreA((s) => s + 1);
        setActivePlayersB((p) => Math.max(0, p - 1));
        setActivePlayersA((p) => Math.min(7, p + 1)); // Revive
        description = `Raid Point: ${teamA.name}`;
      } else {
        setScoreB((s) => s + 1);
        setActivePlayersA((p) => Math.max(0, p - 1));
        setActivePlayersB((p) => Math.min(7, p + 1)); // Revive
        description = `Raid Point: ${teamB.name}`;
      }
    } else if (type === "TACKLE_POINT") {
      points = 1;
      if (isTeamA) {
        // Team A raider tackled
        setScoreB((s) => s + 1);
        setActivePlayersA((p) => Math.max(0, p - 1));
        setActivePlayersB((p) => Math.min(7, p + 1)); // Revive
        description = `Tackle Point: ${teamB.name}`;
      } else {
        // Team B raider tackled
        setScoreA((s) => s + 1);
        setActivePlayersB((p) => Math.max(0, p - 1));
        setActivePlayersA((p) => Math.min(7, p + 1)); // Revive
        description = `Tackle Point: ${teamA.name}`;
      }
    } else if (type === "SUPER_RAID") {
      points = 3;
      if (isTeamA) {
        setScoreA((s) => s + 3);
        setActivePlayersB((p) => Math.max(0, p - 3));
        setActivePlayersA((p) => Math.min(7, p + 3));
        description = `SUPER RAID: ${teamA.name}`;
      } else {
        setScoreB((s) => s + 3);
        setActivePlayersA((p) => Math.max(0, p - 3));
        setActivePlayersB((p) => Math.min(7, p + 3));
        description = `SUPER RAID: ${teamB.name}`;
      }
    } else if (type === "SUPER_TACKLE") {
      points = 2;
      if (isTeamA) {
        // Team A raider super tackled
        setScoreB((s) => s + 2);
        setActivePlayersA((p) => Math.max(0, p - 1));
        setActivePlayersB((p) => Math.min(7, p + 1)); // Revive 1
        description = `SUPER TACKLE: ${teamB.name}`;
      } else {
        setScoreA((s) => s + 2);
        setActivePlayersB((p) => Math.max(0, p - 1));
        setActivePlayersA((p) => Math.min(7, p + 1)); // Revive 1
        description = `SUPER TACKLE: ${teamA.name}`;
      }
    } else if (type === "ALL_OUT") {
      points = 2; // +2 for all out, plus points for remaining players (simplified)
      if (isTeamA) {
        // Team A gets All Out points (Team B wiped)
        setScoreA((s) => s + 2 + activePlayersB);
        setActivePlayersB(7); // Reset
        description = `ALL OUT: ${teamA.name}`;
      } else {
        setScoreB((s) => s + 2 + activePlayersA);
        setActivePlayersA(7); // Reset
        description = `ALL OUT: ${teamB.name}`;
      }
      // Raider continues? No, usually reset.
    } else if (type === "DO_OR_DIE") {
      description = "DO OR DIE RAID";
      // No points change immediately, just visual
      nextRaiderTeam = raidingTeam; // Keep same raider for animation duration
    }

    // Check for All Out condition after points update (simplified check)
    if (activePlayersA <= 0) {
      setActivePlayersA(7);
      setScoreB((s) => s + 2);
    }
    if (activePlayersB <= 0) {
      setActivePlayersB(7);
      setScoreA((s) => s + 2);
    }

    // Set event for animation
    const newEvent: GameEvent = {
      id: Date.now().toString(),
      type,
      teamId: isTeamA ? teamA.id : teamB.id,
      points,
      description,
      timestamp: Date.now(),
    };

    setLastEvent(newEvent);
    setShowAnimation(type);

    // Switch Raider
    setRaidingTeam(nextRaiderTeam as "A" | "B");
    const nextTeamId = nextRaiderTeam === "A" ? teamA.id : teamB.id;
    const teamPlayers = PLAYERS.filter((p) => p.teamId === nextTeamId);
    const randomPlayer = teamPlayers[
      Math.floor(Math.random() * teamPlayers.length)
    ] || { name: "Unknown Player" };
    setCurrentRaider(randomPlayer.name);

    // Clear animation after a few seconds
    setTimeout(() => setShowAnimation(null), 3000);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={clsx(
        "fixed right-4 z-40 transition-all duration-300",
        isMinimized ? "top-auto bottom-4 w-auto" : "top-24 w-72 md:w-80"
      )}
    >
      <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 relative">
        {/* Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-50">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/50 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/50 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {isMinimized ? (
          // Minimized View
          <div className="p-3 flex items-center gap-4 pr-16">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                {teamA.name.substring(0, 3).toUpperCase()}
              </span>
              <span className="text-red-500 font-black">{scoreA}</span>
              <span className="text-gray-500">-</span>
              <span className="text-red-500 font-black">{scoreB}</span>
              <span className="font-bold text-white">
                {teamB.name.substring(0, 3).toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          // Expanded View
          <>
            {/* Header: Live + Timer */}
            <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/10">
              {matchEnded ? (
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="text-white text-xs font-bold tracking-wider">
                    FULL TIME
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="text-red-500 text-xs font-bold tracking-wider">
                    LIVE
                  </span>
                </div>
              )}

              <div
                className={clsx(
                  "text-xs font-mono flex items-center gap-1 mr-12",
                  matchEnded ? "text-white font-bold" : "text-gray-400"
                )}
              >
                <Timer size={10} />
                {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Teams & Scores */}
            <div className="p-4 pb-2">
              <div className="flex justify-between items-start mb-2">
                {/* Team A */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <img
                    src={teamA.logo}
                    alt={teamA.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-[10px] text-gray-300 font-bold uppercase text-center leading-tight h-8 flex items-center justify-center w-full">
                    {teamA.name}
                  </span>
                  {/* Active Players Dots */}
                  <div className="flex gap-0.5">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                          i < activePlayersA
                            ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                            : "bg-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <motion.span
                      key={scoreA}
                      initial={{ scale: 1.2, color: "#ef4444" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      className="text-3xl font-black tracking-tighter"
                    >
                      {scoreA}
                    </motion.span>
                    <span className="text-gray-600 text-lg font-light">:</span>
                    <motion.span
                      key={scoreB}
                      initial={{ scale: 1.2, color: "#ef4444" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      className="text-3xl font-black tracking-tighter"
                    >
                      {scoreB}
                    </motion.span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {matchEnded ? "Final Score" : "2nd Half"}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <img
                    src={teamB.logo}
                    alt={teamB.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-[10px] text-gray-300 font-bold uppercase text-center leading-tight h-8 flex items-center justify-center w-full">
                    {teamB.name}
                  </span>
                  {/* Active Players Dots */}
                  <div className="flex gap-0.5">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                          i < activePlayersB
                            ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                            : "bg-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Raider & Event */}
            <div className="bg-white/5 px-4 py-2 border-t border-white/10 min-h-[3rem] flex items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {matchEnded ? (
                  <motion.div
                    key="ended"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {scoreA > scoreB
                        ? `${teamA.name} WON`
                        : scoreB > scoreA
                        ? `${teamB.name} WON`
                        : "MATCH DRAW"}
                    </span>
                  </motion.div>
                ) : showAnimation ? (
                  <motion.div
                    key="anim"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2 z-10"
                  >
                    {showAnimation === "SUPER_RAID" && (
                      <Zap size={14} className="text-yellow-400" />
                    )}
                    {showAnimation === "SUPER_TACKLE" && (
                      <Shield size={14} className="text-blue-400" />
                    )}
                    {showAnimation === "ALL_OUT" && (
                      <Users size={14} className="text-purple-400" />
                    )}
                    {showAnimation === "DO_OR_DIE" && (
                      <Activity size={14} className="text-red-500" />
                    )}

                    <span
                      className={clsx(
                        "text-xs font-black uppercase italic",
                        showAnimation === "SUPER_RAID"
                          ? "text-yellow-400"
                          : showAnimation === "SUPER_TACKLE"
                          ? "text-blue-400"
                          : showAnimation === "ALL_OUT"
                          ? "text-purple-400"
                          : showAnimation === "DO_OR_DIE"
                          ? "text-red-500"
                          : "text-white"
                      )}
                    >
                      {showAnimation === "RAID_POINT"
                        ? "Raid Point +1"
                        : showAnimation === "TACKLE_POINT"
                        ? "Tackle Point +1"
                        : showAnimation.replace("_", " ")}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="raider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center w-full"
                  >
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                      Current Raider
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full animate-pulse",
                          raidingTeam === "A" ? "bg-red-500" : "bg-blue-500"
                        )}
                      />
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">
                        {currentRaider}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LiveScoreCard;
