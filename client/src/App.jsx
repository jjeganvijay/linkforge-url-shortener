import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AmbientLayer from "./components/AmbientLayer";
import LoadingSpinner from "./components/LoadingSpinner";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/app/DashboardHome"));
const CreateLink = lazy(() => import("./pages/app/CreateLink"));
const LinksPage = lazy(() => import("./pages/app/LinksPage"));
const BulkUploadPage = lazy(() => import("./pages/app/BulkUploadPage"));
const AnalyticsHub = lazy(() => import("./pages/app/AnalyticsHub"));
const QRCodesPage = lazy(() => import("./pages/app/QRCodesPage"));
const Profile = lazy(() => import("./pages/app/Profile"));
const Settings = lazy(() => import("./pages/app/Settings"));
const Analytics = lazy(() => import("./pages/Analytics"));
const PublicStats = lazy(() => import("./pages/PublicStats"));
const LinkError = lazy(() => import("./pages/LinkError"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LegacyAnalyticsRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/analytics/${id}`} replace />;
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="page-root">
      <AmbientLayer />
      {loading ? (
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" text="Getting things ready..." />
        </div>
      ) : (
        <div className="relative z-10">
          <Suspense
            fallback={
              <div className="relative z-10 flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" text="Loading the app..." />
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Landing />
                }
              />
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />
              <Route
                path="/signup"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Signup />
                }
              />
              <Route path="/stats" element={<PublicStats />} />
              <Route path="/link-error" element={<LinkError />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardHome />} />
                  <Route path="/dashboard/create" element={<CreateLink />} />
                  <Route path="/dashboard/links" element={<LinksPage />} />
                  <Route path="/dashboard/bulk" element={<BulkUploadPage />} />
                  <Route
                    path="/dashboard/analytics"
                    element={<AnalyticsHub />}
                  />
                  <Route
                    path="/dashboard/analytics/:id"
                    element={<Analytics />}
                  />
                  <Route path="/dashboard/qr" element={<QRCodesPage />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                </Route>
              </Route>

              <Route
                path="/analytics/:id"
                element={<LegacyAnalyticsRedirect />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </div>
  );
}
