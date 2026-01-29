import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Standings from "./pages/Standings";
import PlayerDetails from "./pages/PlayerDetails";
import MatchDetails from "./pages/MatchDetails";
import News from "./pages/News";
import About from "./pages/About";
import VideoHub from "./pages/VideoHub";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Matches />} />
        <Route path="/matches/:matchId" element={<MatchDetails />} />
        <Route path="/team" element={<Teams />} />
        <Route path="/team/:slug" element={<TeamDetails />} />
        <Route path="/player/:slug" element={<PlayerDetails />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        <Route path="/videohub" element={<VideoHub />} />
      </Routes>
    </Router>
  );
}

export default App;
