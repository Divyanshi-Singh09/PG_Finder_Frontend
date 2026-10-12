import React from 'react';
import Container from '../../components/common/Container';
import SectionHeading from '../../components/common/SectionHeading';
import { Building2, ShieldCheck, Users, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <Container>
        <SectionHeading
          title="About PGFinder"
          subtitle="Your trusted partner in finding safe, comfortable, and affordable PG accommodations."
          centered
        />

        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#0F172A]">Our Mission</h3>
          <p className="text-[#64748B] leading-relaxed">
            PGFinder was created to solve the pain points faced by students and young working professionals relocating to new cities. Finding a PG often involves middleman fees, unverified listings, and lack of transparency. We bridge the gap between PG seekers and property owners with direct, transparent, and verified property information.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A]">Verification Standard</h4>
                <p className="text-xs text-[#64748B] mt-1">Listing checks to ensure authentic photos and amenities.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A]">Zero Brokerage</h4>
                <p className="text-xs text-[#64748B] mt-1">Connect directly with PG owners without paying commission.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
