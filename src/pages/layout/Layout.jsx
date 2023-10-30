import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";
import { NavDropdown, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../stylesheets/sidebar.css";
import "../../js/sidebar";
import logo from "../../assets/LOGO-UNAHorizontal-BLANCO .png";
import { useAuth } from "../../auth/AuthProviders";
import { useState } from "react";

function Layout({ children }) {
  const { user } = useAuth();

  const queryClient = new QueryClient();

  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    {
      $(document).ready(function () {
        $("#sidebarCollapse").on("click", function () {
          $("#sidebar").toggleClass("active");
        });
      });
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      const roles = [];
      for (const claim in user) {
        if (claim.endsWith("/role")) {
          roles.push(user[claim]);
        }
      }
      setUserRoles(roles);
    }
  }, [user]);

  useEffect(() => {
    if (userRoles.length > 0) {
      setIsAdmin(userRoles[0].includes("Admin"));
    }
  }, [userRoles]);

  return (
    <>
      <div className="wrapper">
        {/* <!-- Sidebar  --> */}
        <nav id="sidebar">
          <div className="sidebar-header">
            <img className="logo-una" src={logo} alt="" />
          </div>

          <ul className="list-unstyled components">
            <p>Control de Giras</p>
            <li>
              <a href="/">Inicio</a>
            </li>
            {isAdmin && (
              <>
                <li>
                  <a href="/vehicles">Vehículos</a>
                </li>
                <li>
                  <a href="/vehicle">Mantenimientos</a>
                </li>
                <li>
                  <a href="/users">Usuarios</a>
                </li>
                <li>
                  <a href="/workingTimeControl">Jornada</a>
                </li>
                <li>
                  <a
                    href="#pageSubmenu"
                    data-toggle="collapse"
                    aria-expanded="false"
                    className="dropdown-toggle"
                  >
                    Solicitudes
                  </a>
                  <ul className="collapse list-unstyled" id="pageSubmenu">
                    <li>
                      <a href="/endorseRequest">Avalar</a>
                    </li>
                    <li>
                      <a href="/approveRequest">Aprobar</a>
                    </li>
                    <li>
                      <a href="/checkedRequests">Ver</a>
                    </li>
                  </ul>
                </li>
              </>
            )}

            <li>
              <a href="/requestForm">Formulario Solicitud</a>
            </li>
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        <div id="content">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <button
                type="button"
                id="sidebarCollapse"
                className="btn btn-info"
              >
                <i className="fas fa-align-left"></i>
                <span>Toggle Sidebar</span>
              </button>
              <button
                className="btn btn-dark d-inline-block d-lg-none ml-auto"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="fas fa-align-justify"></i>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="nav navbar-nav ml-auto">
                  <NavDropdown title="Nombre Usuario" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/logout">
                      <button className="btn btn-danger">Cerrar Sesión</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container m-4 d-flex justify-content-center">
            {children}
          </div>
        </div>
      </div>

      {/* <main className="flex-grow-1 p-3">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </main> */}
    </>
  );
}

export default Layout;
