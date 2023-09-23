import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";
import { NavDropdown, Nav } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Layout() {
  const queryClient = new QueryClient();
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);


  const handleSidebarToggleClick = () => {
    setSidebarToggled(!sidebarToggled);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarStyle = {
    backgroundColor: "#CD1719", 
    transition: "width 0.3s", // Agregar transición suave al cambiar el ancho
  };

  const sidebarClasses = ["navbar-nav", "sidebar", "sidebar-dark"];
  if (sidebarToggled) {
    sidebarClasses.push("toggled");
  }


  return (
    <div>
      
      <Navbar style={sidebarStyle} expand="lg">
  <Container>
    <Navbar.Brand href="/home">Sistema Control de Giras UNA, SRCH</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Navbar.Text>
        Registrado como:{" "}
        <a href="#login">
          <NavDropdown title="Nombre Usuario" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">
              <button className="btn btn-danger">Cerrar Sesión</button>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              <button className="btn btn-primary">Configuración</button>
            </NavDropdown.Item>
          </NavDropdown>
        </a>
      </Navbar.Text>
    </Navbar.Collapse>
  </Container>
</Navbar>

    <div className="d-flex">
      <body id="page-top">
        <div id="wrapper">
          <ul style={sidebarStyle} className={sidebarClasses.join(" ")}>
           
            <hr className="sidebar-divider my-0"style={{ backgroundColor: "white" }}></hr>
            <div className="position-sticky">
              <ul className="nav flex-column">

                <li className="nav-item">
                  <a className="nav-link" href="/home">
                    <i className="fa fa-house"></i>
                    <span>Inicio</span>
                  </a>
                </li>
                <hr className="sidebar-divider" style={{ backgroundColor: "white" }}></hr>
                <div class="sidebar-heading">
                Interfaces
            </div>
                <li className="nav-item">
                  <a className="nav-link" href="/vehicles">
                    <i className="fa-solid fa-car-side"></i>
                    <span>Vehículos</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/users">
                    <i className="fa-solid fa-user"></i>
                    <span>Usuarios</span>
                  </a>
                </li>

                <li className="nav-item" >
                  <a
                    className={`nav-link ${isCollapsed ? 'collapsed' : ''} `}
                    href="#"
                    onClick={toggleCollapse}
                    aria-expanded={!isCollapsed}
                    aria-controls="collapseTwo"
                  >
                    <i className="fas fa-fw fa-cog"></i>
                    <span>Solicitudes</span>
                  </a>
                  <div
                    id="collapseTwo"
                    className={`collapse ${!isCollapsed ? 'show' : ''}`}
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div className="bg-white py-2 collapse-inner rounded" >
                      <h6 className="collapse-header">Gestión de solicitudes:</h6>
                      <a className="collapse-item" href="/requestForm" >
                        Formulario de Solicitud
                      </a>
                      <a className="collapse-item" href="/endorseRequest">
                        Avalar la Solicitud
                      </a>
                      <a className="collapse-item" href="/approveRequest">
                        Aprobar la Solicitud
                      </a>
                      <a className="collapse-item" href="/checkedRequests">
                       Ver solicitudes
                      </a>
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/">
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span>Login</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/vehicle">
                    <i className="fa-solid fa-wrench"></i>
                    <span>Mantenimiento</span>
                  </a>
                </li>

                <hr className="sidebar-divider d-none d-md-block"></hr>

                <div className="text-center d-none d-md-inline">
                  <button className="rounded-circle border-0" id="sidebarToggle" onClick={handleSidebarToggleClick}></button>
                </div>
              </ul>
            </div>
            <footer className="sticky-footer">
              <div className="container my-auto">
                <div className="copyright text-center my-auto">
                  <span>Made for &copy; David Acuña - Rosicela Cubero - Daniel Guadamuz - Eylin Cabrera - Jesus Guevara</span>
                </div>
              </div>
            </footer>
          </ul>
        </div>
      </body>

      <main className="flex-grow-1 p-3">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </main>
    </div>
    </div>
  );
}

export default Layout;
