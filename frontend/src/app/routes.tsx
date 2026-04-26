import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import LodgeGrievance from "./pages/LodgeGrievance";
import AdminAllGrievances from "./pages/AdminAllGrievances";
import MyGrievances from "./pages/MyGrievances";
import TrackStatus from "./pages/TrackStatus";
import PendingReviews from "./pages/PendingReviews";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import  Settings from "./pages/Settings";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 text-center">
    <div>
      <h1 className="text-6xl font-bold text-[#1E40AF] mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-[#1E40AF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1e3a8a] transition-all">
        Go Home
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: AuthPage,
  },
  {
    path: "/signup",
    Component: AuthPage,
  },
  {
    path: "/terms",
    Component: AuthPage,
  },
  {
    path: "/privacy",
    Component: AuthPage,
  },
  {
    path: "/dashboard",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "lodging",
        Component: LodgeGrievance, 
      },
      {
        path: "status",
        Component: TrackStatus,
      },
      {
        path: "all",
        Component: AdminAllGrievances,
      },
      {
        path: "my-grievances",
        Component: MyGrievances,
      },
      {
        path: "pending-reviews",
        Component: PendingReviews,
      },
      {
        path: "reports",
        Component: Reports,
      },  
      {
        path: "analytics",
        Component: Analytics,
      },
      {
        path: "settings",
        Component: Settings,
      }


    ],
  },
  {
    path: "*",
    Component: NotFound,
  }
]);
