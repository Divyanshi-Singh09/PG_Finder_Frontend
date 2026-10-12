import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Clock, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import SectionHeading from '../../components/common/SectionHeading';
import PGCard from '../../components/pg/PGCard';
import { mockLocations, mockPGs } from '../../utils/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.append('city', selectedCity);
    if (selectedBudget) params.append('maxBudget', selectedBudget);
    if (selectedRoomType) params.append('roomType', selectedRoomType);
    navigate(`/search?${params.toString()}`);
  };

  const whyChooseFeatures = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Filter PGs by exact location, budget, room sharing preference, and facilities.',
    },
    {
      icon: FileText,
      title: 'Detailed Information',
      description: 'See rent breakdowns, food menus, house rules, images, and verified owner info.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      description: 'Listings undergo physical verification for safety, hygiene, and authentic photos.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Compare properties online and send direct enquiries without unnecessary visits.',
    },
  ];

  const seekerSteps = [
    {
      step: '01',
      title: 'Search',
      description: 'Explore verified PGs based on your city, budget, and facility preferences.',
    },
    {
      step: '02',
      title: 'Compare',
      description: 'Check rent breakdowns, room types, food availability, and rules side by side.',
    },
    {
      step: '03',
      title: 'Connect',
      description: 'Send direct enquiries to PG owners to schedule a visit or confirm your booking.',
    },
  ];

  const ownerSteps = [
    { title: 'List Your PG', desc: 'Fill in property details, rent, and photos in 5 minutes.' },
    { title: 'Get Verified', desc: 'Our team verifies your listing for quality assurance.' },
    { title: 'Connect With Seekers', desc: 'Receive direct calls and enquiries from interested tenants.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-semibold text-[#2563EB]">
              <Sparkles className="w-4 h-4" />
              <span>India's Trusted PG Discovery Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Find Your Perfect PG <br className="hidden sm:inline" />
              <span className="text-[#2563EB]">Without the Hassle.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Discover verified PGs based on your location, budget, room type and preferred facilities.
            </p>

          </div>

          {/* Interactive Property Search Interface */}
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200/80">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* City Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Location / City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">All Cities</option>
                  {mockLocations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Max Budget
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">Any Budget</option>
                  <option value="7000">Under ₹7,000</option>
                  <option value="10000">Under ₹10,000</option>
                  <option value="15000">Under ₹15,000</option>
                </select>
              </div>

              {/* Room Type */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Room Type
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">All Room Types</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Double Sharing">Double Sharing</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  fullWidth 
                  icon={Search}
                  className="h-[42px]"
                >
                  Search PG
                </Button>
              </div>

            </form>
          </div>
        </Container>
      </section>

      {/* Popular Locations */}
      <section className="py-8">
        <Container>
          <SectionHeading
            title="Popular Locations"
            subtitle="Explore top educational hubs and tech corridors across India."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => navigate(`/search?city=${loc.name}`)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xs hover:shadow-md transition-all border border-slate-200/60"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <h3 className="font-bold text-base sm:text-lg">{loc.name}</h3>
                  <p className="text-xs text-slate-300">{loc.count}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured PGs Section */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <SectionHeading
              title="Featured PGs"
              subtitle="Hand-picked verified accommodations with top-rated tenant reviews."
              className="mb-0"
            />
            <Link to="/search">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                View All PGs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPGs.slice(0, 3).map((pg) => (
              <PGCard key={pg.id} pg={pg} />
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose PGFinder */}
      <section className="py-8">
        <Container>
          <SectionHeading
            title="Why Choose PGFinder?"
            subtitle="Simplifying accommodation hunting for students and working professionals."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseFeatures.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 border-y border-slate-200">
        <Container>
          <SectionHeading
            title="How It Works"
            subtitle="Simple, transparent steps for tenants and property owners."
            centered
          />

          {/* Seeker Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {seekerSteps.map((step, idx) => (
              <div key={idx} className="relative bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="text-3xl font-black text-[#2563EB] mb-4">{step.step}</div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Owner Flow Box */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" />
                  <span>For PG Owners</span>
                </div>
                <h3 className="text-2xl font-bold">List Your Property in 3 Simple Steps</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                {ownerSteps.map((s, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <p className="font-bold text-sm text-white mb-1">{idx + 1}. {s.title}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PG Owner CTA */}
      <section>
        <Container>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Have a PG? List it on PGFinder.
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Reach students and tenants who are actively looking for a PG in your area. Free verification & dedicated support.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4">
              <Link to="/owner/pgs/add">
                <Button variant="secondary" size="lg" className="bg-white text-[#0F172A] hover:bg-slate-100">
                  List Your PG Now
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
