"use client"
import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/navbar/page'
import Footer from '@/components/footer/page'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'
import Section4 from './section4'

export default function Page() {
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".landing-scroll-section");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      <main ref={mainRef} className="flex-1 w-full">
        <section className="w-full landing-scroll-section">
          <Section1 />
        </section>

        <section className="w-full landing-scroll-section">
          <Section2 />
        </section>

        <section className="w-full landing-scroll-section">
          <Section3 />
        </section>

        <section className="w-full landing-scroll-section">
          <Section4 />
        </section>
      </main>

      <Footer />
    </div>
  )
}
