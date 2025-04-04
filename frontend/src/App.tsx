import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/common/Home";
import { Auth } from "./pages/common/Auth";
import OpdLog from "./pages/paramedics/opdLog.tsx";
import Prescribe from "./pages/doctor/Prescribe";
import { InventoryForm } from "./pages/paramedics/Inventory.tsx";
import Admin from "./pages/admin/Admin.tsx";
import AddAccount from "./pages/admin/AddAccount.tsx";
import Opd from "./pages/receptionist/Opd.tsx";
import Dashboard from "./pages/common/Dashboard.tsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/app",
      element: <AppLayout />,
      children: [
        {
          path: "admin",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "dailydetails", element: <Admin /> },
            { path: "addaccount", element: <AddAccount /> },
          ],
        },
        {
          path: "receptionist",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "opd", element: <Opd /> },
            { path: "opdLog", element: <OpdLog /> },
          ],
        },
        {
          path: "doctor",
          children: [
            { path: "dashboard", element: <Dashboard /> },

            { path: "patientqueue", element: <OpdLog /> },
            { path: "prescribe", element: <Prescribe /> },
          ],
        },
        {
          path: "paramedic",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "inventory", element: <InventoryForm /> },
            { path: "opdLog", element: <OpdLog /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
