import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center border border-rose-100 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Something went wrong</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                An unexpected error occurred while loading this page. You can reload the page or return to the home screen.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200/80 overflow-x-auto text-[11px] font-mono text-slate-600">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={this.handleReload} icon={RefreshCw}>
                Reload Page
              </Button>
              <Button variant="primary" size="sm" onClick={this.handleReset} icon={Home}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
