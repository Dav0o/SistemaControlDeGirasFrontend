import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Outlet, NavLink } from "react-router-dom";
import { NavDropdown, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Dropdown, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../stylesheets/sidebar.css";

import logo from "../../assets/LOGO-UNAHorizontal-BLANCO .png";
import { useAuth } from "../../auth/AuthProviders";
import { useState } from "react";
import { getByIdUser } from "../../services/UserService";

function Layout({ children }) {
  const { user } = useAuth();

  const [userId, setUserId] = useState(0);

  const {
    isLoading: userLoading,
    data: userData,
    isError: userError,
  } = useQuery(["users", userId], () => getByIdUser(userId));

  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const sidebarClass = sidebarActive ? "active" : "";

  const queryClient = new QueryClient();

  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  // const [data, isLoading, isError] = useQuery('user', ()=>getByIdUser(user.claim));

  useEffect(() => {
    if (user) {
      const roles = [];
      for (const claim in user) {
        if (claim.endsWith("/role")) {
          roles.push(user[claim]);
        }
      }
      for (const claim in user) {
        if (claim.endsWith("/nameidentifier")) {
         
          setUserId(user[claim]);
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


  if (userLoading) {
    <div>isLoading...</div>;
  }
  if (userError) {
    <div>isError...</div>;
  }

  return (
    <>
      <div className="wrapper">
        {/* <!-- Sidebar  --> */}
        <nav id="sidebar" className={sidebarClass}>
          <div className="sidebar-header">
            <img className="logo-una" src={logo} alt="" />
          </div>

          <ul className="list-unstyled components">
            <p>Control de Giras</p>
            <li>
              <a href="/">Inicio</a>
            </li>

            <li>
              <a href="/requestForm">Formulario Solicitud</a>
            </li>
            {isAdmin && (
              <>
                <li>
                  <a
                    href="#vehicleSubmenu"
                    data-toggle="collapse"
                    aria-expanded="false"
                    className="dropdown-toggle"
                  >
                    Vehículos
                  </a>
                  <ul className="collapse list-unstyled" id="vehicleSubmenu">
                    <li>
                      <a href="/vehicles">Listado Vehículos</a>
                    </li>
                    <li>
                      <a href="/vehicle">Mantenimientos</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="/users">Usuarios</a>
                </li>
                <li>
                  <a href="/workingTimeControl">Jornada</a>
                </li>
                <li>
                  <a href="/stadisticControl">Estadísticas</a>
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
                    <li>
                  <a href="/notices">Noticias</a>
                  </li>
                    
                 
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        <div id="content">
          <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
            <div className="container-fluid">
              <button
                type="button"
                id="sidebarCollapse"
                className="btn buttonLight"
                onClick={toggleSidebar}
              >
                <i className="fas fa-align-left"></i>
                <span></span>
              </button>
              <button
                className="btn  buttonNavbar d-inline-block d-lg-none ml-auto"
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
                  <NavDropdown
                    title={
                      userData
                        ? `${userData.name} ${userData.lastName1}`
                        : "..."
                    }
                    id="basic-nav-dropdown"
                  >
                    {userData ? (
                      <>
                        <NavDropdown.Item href="/profile">
                          Mi perfil
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/logout">
                          Cerrar Sesión
                        </NavDropdown.Item>
                      </>
                    ) : (
                      <NavDropdown.Item href="/login">
                        <button className="btn btn-success">
                          Iniciar Sesión
                        </button>
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container">{children}</div>
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
