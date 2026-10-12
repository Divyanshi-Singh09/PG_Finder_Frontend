import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Instagram, Linkedin, Twitter } from 'lucide-react';
import Container from '../common/Container';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-12 sm:pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-2xl text-white tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span>PGFinder</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Find your perfect PG without the hassle. Verified listings, modern amenities, transparent pricing across top cities in India.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="X Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/search" className="hover:text-white transition-colors">Find PG</Link>
              </li>
              <li>
                <Link to="/owner/pgs/add" className="hover:text-white transition-colors">List Your PG</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="hover:text-white transition-colors">Seeker Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Safety Guidelines</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PGFinder. All rights reserved.</p>
          <p>Designed for seamless PG discovery & property management.</p>
        </div>
      </Container>
    </footer>
  );
}
