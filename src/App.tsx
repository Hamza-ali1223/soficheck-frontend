import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";

function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-12 text-center border-t border-gray-200 dark:border-gray-800 mt-20">
      <p className="text-gray-500 dark:text-slate-500 text-sm">
        © 2025 SOFI Check • Academic Integrity Services
      </p>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors font-sans">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
