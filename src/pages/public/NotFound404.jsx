import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';

export default function NotFound404() {
  return (
    <div className="py-20 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg">
          <div className="text-6xl sm:text-7xl font-black text-[#2563EB]">404</div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Page Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/" className="w-full">
              <Button variant="primary" fullWidth icon={Home}>
                Go Home
              </Button>
            </Link>
            <Link to="/search" className="w-full">
              <Button variant="outline" fullWidth icon={Search}>
                Find a PG
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
