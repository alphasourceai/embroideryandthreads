import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Faq from "@/pages/Faq";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Insights from "@/pages/Insights";
import serviceLinks from "@/content/service-links.json";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import PrivacyPreferencesNotice from "@/components/PrivacyPreferencesNotice";
import { PrivacyPreferencesProvider } from "@/context/PrivacyPreferencesContext";

const ServicePage = lazy(() => import("@/pages/ServicePage"));
const Reviews = lazy(() => import("@/pages/Reviews"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reviews">
        <Suspense fallback={null}>
          <Reviews />
        </Suspense>
      </Route>
      <Route path="/pricing" component={Pricing} />
      <Route path="/faq" component={Faq} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/insights" component={Insights} />
      {serviceLinks.map((service) => (
        <Route key={service.slug} path={`/${service.slug}`}>
          <Suspense fallback={null}>
            <ServicePage serviceSlug={service.slug} />
          </Suspense>
        </Route>
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

export type AppProps = {
  ssrPath?: string;
};

function App({ ssrPath }: AppProps) {
  return (
    <PrivacyPreferencesProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <WouterRouter
        base={import.meta.env.BASE_URL.replace(/\/$/, "")}
        ssrPath={ssrPath}
      >
        <AnalyticsTracker />
        <CloudflareAnalytics />
        <Router />
        <PrivacyPreferencesNotice />
      </WouterRouter>
      <Toaster />
    </PrivacyPreferencesProvider>
  );
}

export default App;
