import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Features from '@/components/sections/Features';
import About from '@/components/sections/About';
import Activities from '@/components/sections/Activities';
import LatestNews from '@/components/sections/LatestNews';
import UpcomingEvents from '@/components/sections/UpcomingEvents';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <About />
      <Activities />
      <LatestNews />
      <UpcomingEvents />
      <Testimonials />
      <CTA />
    </>
  );
}
