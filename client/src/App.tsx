import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Room from "@/pages/room";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/room/:code" component={Room} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <i className="fas fa-share-alt text-primary text-2xl mr-3"></i>
                  <h1 className="text-2xl font-bold text-gray-900">ShareSpace</h1>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">How it works</a>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy</a>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">Support</a>
                </nav>
              </div>
            </div>
          </header>
          
          <Router />
          
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 ShareSpace. Anonymous file sharing made simple.</p>
                <div className="mt-4 space-x-6">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
