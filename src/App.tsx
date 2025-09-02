import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Supervisors from "@/pages/Supervisors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/supervisors" element={<Supervisors />} />
              <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/add-user" element={<PlaceholderPage title="Add User" />} />
              <Route path="/add-equipment" element={<PlaceholderPage title="Add Equipment" />} />
              <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
              <Route path="/instructions" element={<PlaceholderPage title="Instructions" />} />
              <Route path="/booking" element={<PlaceholderPage title="Equipment Booking" />} />
              <Route path="/students" element={<PlaceholderPage title="My Students" />} />
              <Route path="/catalog" element={<PlaceholderPage title="Equipment Catalog" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction</p>
  </div>
);

export default App;
