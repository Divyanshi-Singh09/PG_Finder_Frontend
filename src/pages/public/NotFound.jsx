import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, HelpCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';

export default function NotFound() {
  return (
    <Container className="py-20 font-sans max-w-lg mx-auto text-center space-y-6">
      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-blue-100">
        <HelpCircle className="w-10 h-10 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">404 — Page Not Found</h1>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          The property listing or page you are searching for may have been moved, renamed, or is no longer available.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to="/search">
          <Button variant="primary" icon={Search}>
            Search PGs
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" icon={Home}>
            Go to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
}
