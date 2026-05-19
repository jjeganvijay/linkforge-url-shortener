import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 text-slate-400">Please refresh the page or return home.</p>
          <Link to="/" className="btn-primary mt-6">
            Go home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
