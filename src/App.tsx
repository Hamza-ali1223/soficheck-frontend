import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

function Icon({ name, className }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

function Footer() {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          © 2025 SOFI Check. All rights reserved.
        </p>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Icon name="school" className="text-slate-400 text-sm" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Built for Academic Excellence
          </span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark bg-mesh transition-colors font-sans">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
