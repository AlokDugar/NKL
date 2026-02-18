import React from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import LiveScoreCard from "../components/home/LiveScoreCard";
import ReigningChampions from "../components/home/ReigningChampions";
import NewsSection from "../components/home/NewsSection";
import SeasonTracker from "../components/home/SeasonTracker";
import MatchesSection from "../components/home/MatchesSection";
import StandingsSection from "../components/home/StandingsSection";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <LiveScoreCard />
      {/* <SeasonTracker /> */}
      <ReigningChampions />
      <NewsSection />
      <MatchesSection />
      <StandingsSection />
    </Layout>
  );
};

export default Home;
