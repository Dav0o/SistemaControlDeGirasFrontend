import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../auth/AuthProviders";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../pages/home/Home";
import Users from "../pages/users/Users";
import UserRole from "../pages/users/components/UserRole";
import { Vehicles } from "../pages/vehicles/Vehicles";
import Login from "../pages/login/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../pages/layout/Layout";
import Logout from "../pages/logout/Logout";
import VehicleMaintenances from "../pages/vehicle/components/VehicleMaintenances";
import RequestForm from "../pages/requestForm/RequestForm";
import EndorseRequest from "../pages/endorseRequest/EndorseRequest";
import ApproveRequest from "../pages/approveRequest/ApproveRequest";
import CheckedRequests from "../pages/checkedRequests/CheckedRequests";
import WorkingTime from "../pages/workingTimeControl/WorkingTime";
import DriverLog from "../pages/driverLog/DriverLog";
import RequestDays from "../pages/requestDays/RequestDays";
import RequestGasoline from "../pages/requestGasoline/RequestGasoline";
import Vehicle from "../pages/vehicle/Vehicle";
import StadisticControl from "../pages/stadisticControl/StadisticControl";
import WorkingTimeDetails from "../pages/workingTimeControl/WorkingTimeDetails";
import RequestList from "../pages/requestManagement/RequestList";
import ChangePassword from "../pages/users/components/ChangePassword";
import HoursControl from "../pages/workingTimeControl/components/HoursControl";

import PasswordRecovery from "../pages/login/PasswordRecovery";
import ResetPassword from "../pages/login/ResetPassword";

import MyProfile from "../pages/profile/MyProfile";
import MyRequests from "../pages/profile/components/MyRequests";
import Notices from "../pages/notices/Notices";


const Routes = () => {
  const { token } = useAuth();
  const queryClient = new QueryClient();
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/users",
          element: (
            <Layout>
              <Users />
            </Layout>
          ),
        },
        {
          path: "/profile",
          element: (
            <Layout>
              <MyProfile />
            </Layout>
          ),
        },
        {
          path: "/profile/requests",
          element: (
            <Layout>
              <MyRequests />
            </Layout>
          ),
        },
        {
          path: "/users/UserRole/:User",
          element: (
            <Layout>
              <UserRole />
            </Layout>
          ),
        },
        {
          path: "/stadisticControl",
          element: (
            <Layout>
              <StadisticControl />
            </Layout>
          ),
        },
        {
          path: "/vehicles",
          element: (
            <Layout>
              <Vehicles />
            </Layout>
          ),
        },
       
        {
          path: "/vehicle",
          element: (
            <Layout>
              <Vehicle />
            </Layout>
          ),
        },
        {
          path: "/vehicle/:vehicleId",
          element: (
            <Layout>
              <VehicleMaintenances />
            </Layout>
          ),
        },
        {
          path: "/hourscontrol/:logId",
          element: (
            <Layout>
              <HoursControl />
            </Layout>
          ),
        },
        {
          path: "/requestForm",
          element: (
            <Layout>
              <RequestForm />
            </Layout>
          ),
        },
        {
          path: "/endorseRequest",
          element: (
            <Layout>
              <EndorseRequest />
            </Layout>
          ),
        },
        {
          path: "/approveRequest",
          element: (
            <Layout>
              <ApproveRequest />
            </Layout>
          ),
        },
        {
          path: "/checkedRequests",
          element: (
            <Layout>
              <CheckedRequests />
            </Layout>
          ),
        },
        {
          path: "/workingTimeControl",
          element: (
            <Layout>
              <WorkingTime />
            </Layout>
          ),
        },
        {
          path: "/workingTimeControl/:driverLogId",
          element: (
            <Layout>
              <WorkingTimeDetails />
            </Layout>
          ),
        },
        {
          path: "/requestDays/:requestId",
          element: (
            <Layout>
              <RequestDays />
            </Layout>
          ),
        },
        {
          path: "/requestGasoline/:requestId",
          element: (
            <Layout>
              <RequestGasoline />
            </Layout>
          ),
        },
        {
          path: "/requestManagement",
          element: (
            <Layout>
              <RequestList />
            </Layout>
          ),
        },
        {
          path: "/ChangePassword",
          element: (
            <Layout>
              <ChangePassword />
            </Layout>
          ),
        },

        {
          path: "/logout",
          element: <Logout />,
        }, 

        {
          path: "/notices",
          element: (
            <Layout>
              <Notices />
            </Layout>
          ),
        }
        
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/PasswordRecovery",
      element: <PasswordRecovery />,
    },

    {
      path: "/ResetPassword",
      element: <ResetPassword/>,
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default Routes;
