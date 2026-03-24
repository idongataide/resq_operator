import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Login from "../pages/auth/login/login";
import AuthPath from "../pages/auth/authPath";
import LoadingScreen from "../pages/dashboard/common/LoadingScreen";
import MainRouter from "./mainRouter";
import BookingLayouts from "@/pages/dashboard/screens/bookings/bookingLayouts";
import TeamsLayout from "@/pages/dashboard/screens/teams/teamsLayouts";
import SetupLayout from "@/pages/dashboard/screens/setup/setupLayout";
import RevenueLayout from "@/pages/dashboard/screens/revenue/revenueLayout";
import HospitalLayout from "@/pages/dashboard/screens/ambulances/AmbulanceLayouts";
import ServiceLayouts from "@/pages/dashboard/screens/serviceProvider/serviceLayouts";
import ProvidersList from "@/pages/dashboard/screens/serviceProvider/Provider/ProviderList";
import ProfileLayout from "@/pages/dashboard/screens/profile/ProfileLayouts";
import AmbulanceLayouts from "@/pages/dashboard/screens/ambulances/AmbulanceLayouts";
import AmbulanceLeadLayout from "@/pages/dashboard/screens/ambulances_lead/AmbulanceLeadLayouts";
import ActivityLog from "@/pages/dashboard/screens/activity-log/activityLog";
import BookingDetailsLayouts from "@/pages/dashboard/screens/bookings/bookingDetailsLayouts";

const DashboadScreen = lazy(() =>
  import("../pages/dashboard/screens/dashboardScreen/DashboadScreen")
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
      {
        path: "/home",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
       {
        path: "/ambulances",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AmbulanceLayouts />
          </Suspense>
        ),
      },
      {
        path: "/ambulance-leads",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AmbulanceLeadLayout />
          </Suspense>
        ),
      },
     {
        path: "/bookings",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <BookingLayouts />
              </Suspense>
            ),
          },
          {
            path: ":booking_id",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <BookingDetailsLayouts />
              </Suspense>
            ),
          },
        ]
       },
      {
        path: "/service-providers",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProvidersList />
          </Suspense>
        ),
      },

      {
        path: "/service-providers",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <ProvidersList />
              </Suspense>
            ),
          },
          {
            path: ":provider_id",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <ServiceLayouts />
              </Suspense>
            ),
          },
        ]
       },
        
        {
        path: "/hospitals",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HospitalLayout />
          </Suspense>
        ),
      },
      {
        path: "/setup",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SetupLayout />
          </Suspense>
        ),
      },
      {
        path: "/revenue",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RevenueLayout />
          </Suspense>
        ),
      },
      {
        path: "/my-team",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <TeamsLayout />
          </Suspense>
        ),
      },
         {
        path: "/activity-log",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ActivityLog />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProfileLayout />
          </Suspense>
        ),
      },

      {
        path: "*",
        element: <div>Work in Progress</div>,
      },
    ],
  },

  {
    path: "/login",
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <Login />},
      { path: "enter-otp", element: <AuthPath /> },
    ],
  },

  {
    path: "*",
    element: <>Invalid Route</>,
  },
]);