import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Faq from "@/pages/Faq";
import Pricing from "@/pages/Pricing";
import Reviews from "@/pages/Reviews";
import Privacy from "@/pages/Privacy";
import Insights from "@/pages/Insights";
import AnalyticsTracker from "@/components/AnalyticsTracker";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/faq" component={Faq} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/insights" component={Insights} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AnalyticsTracker />
        <Router />
      </WouterRouter>
      <Toaster />
    </>
  );
}

export default App;
