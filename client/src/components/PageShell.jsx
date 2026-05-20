import Footer from './Footer';

export default function PageShell({ children, showFooter = true }) {
  return (
    <div className="page-shell">
      {children}
      {showFooter && <Footer />}
    </div>
  );
}
