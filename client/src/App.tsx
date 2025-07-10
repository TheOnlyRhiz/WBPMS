import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Verify from "@/pages/verify";
import Feedback from "@/pages/feedback";
import Login from "@/pages/login";
import Dashboard from "@/pages/admin/dashboard";
import Drivers from "@/pages/admin/drivers";
import Vehicles from "@/pages/admin/vehicles";
import FeedbackManagement from "@/pages/admin/feedback";
import Settings from "@/pages/admin/settings";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/lib/auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/verify" component={Verify} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/login" component={Login} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/drivers" component={Drivers} />
      <Route path="/admin/vehicles" component={Vehicles} />
      <Route path="/admin/feedback" component={FeedbackManagement} />
      <Route path="/admin/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
