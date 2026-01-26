"use client"
import React from 'react'
import Navbar from '@/components/navbar/page';
import Footer from '@/components/footer/page';
import Section1 from './section1';
import Section2 from './section2';
import Section3 from './section3';
import Section4 from './section4';

export default function Page() {

  return (
    <div className="bg-white">
      <Navbar />

      {/* Section 1 */}
      <Section1 />

      {/* Section 2 */}
      <Section2 />

      {/* Section 3 */}
      <Section3 />

      {/* Section 4 */}
      <Section4 />

      {/* Footer */}
      <Footer />

    </div>
  );
}