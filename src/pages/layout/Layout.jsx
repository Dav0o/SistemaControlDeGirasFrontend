import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";

function Layout() {
  const queryClient = new QueryClient();
  return (
    <div className="d-flex">
      <nav className="bg-white py-2 collapse-inner rounded">
        <div className="position-sticky">
          <ul className="nav flex-column">
            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                <span className="material-symbols-outlined">home</span>
              </NavLink>
            </li>
            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vehicles">
                <span className="material-symbols-outlined">
                  directions_car
                </span>
              </NavLink>
            </li>
            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/users">
                <span className="material-symbols-outlined">person</span>
              </NavLink>
            </li>
            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vehicle">
                <span className="material-symbols-outlined">engineering</span>
              </NavLink>
            </li>

            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vehicles">
                <span className="material-symbols-outlined">folder_open</span>
              </NavLink>
            </li>

            <hr className="sidebar-divider"></hr>
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <span className="material-symbols-outlined">person</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow-1 p-3">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </main>
    </div>
  );
}

export default Layout;
