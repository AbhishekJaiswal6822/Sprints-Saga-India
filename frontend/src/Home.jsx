// src/Home.jsx
import React from "react";
import HeroSection from "./Hero";
import EventCountdown from "./EventCountdown";
import EventInformation from "./EventInformation";
import RaceCategories from "./RaceCategories";
import PrizesRewards from "./PrizesRewards";
import Sponsors from "./Sponsors";
import CallToAction from "./CallToAction";
import EventOverview from "./EventOverview";
import ImageSlider from "./ImageSlider";
import Hero from "./Hero";

function Home() {
  return (
    <article>
      {/* React 19 automatically "hoists" these to the <head> section */}
      <title>Sprints Saga India | Official Marathon Registration</title>
      <meta name="description" content="Official website for Sprints Saga India. Register now for our upcoming marathons and running events across India." />
      <meta name="keywords" content="sprints saga india, sprints-saga-india, sprints_saga_india, marathon registration" />
      <meta property="og:title" content="Sprints Saga India | Marathon 2025" />
      <meta property="og:description" content="Join the biggest running event. Register now!" />
      <meta property="og:image" content="https://sprintssagaindia.com/og-image.jpg" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://sprintssagaindia.com" />
      <main className="w-full overflow-x-hidden">
        <Hero />
        {/* <HeroSection /> */}
        <EventCountdown />
        {/* <EventInformation />   */}
        {/* <RaceCategories />   */}
        <EventOverview />
        {/* <PrizesRewards /> */}
        <ImageSlider />
        <Sponsors />
        <CallToAction />
      </main>
    </article>
  );
}

export default Home;
