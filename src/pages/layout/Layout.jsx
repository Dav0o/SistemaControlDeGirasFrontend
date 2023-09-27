import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";
import { NavDropdown, Navbar } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 

const queryClient = new QueryClient();

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


  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = async () => {
    try {
      // Aquí debes realizar la lógica de cierre de sesión, por ejemplo, enviando una solicitud al servidor para invalidar el token de autenticación.
      // Esto es solo un ejemplo simplificado.

      // Simulamos una solicitud al servidor para cerrar sesión
      const response = await fetch("/api/logout", {
        method: "POST", // Puedes usar el método HTTP adecuado
        // Añade cualquier encabezado necesario, como el token de autenticación
        // headers: {
        //   Authorization: `Bearer ${yourAuthToken}`,
        // },
      });

      if (response.status === 200) {
        // Si la solicitud de cierre de sesión fue exitosa en el servidor:

        // Elimina el token de autenticación localmente
        localStorage.removeItem("token");

        // Establece el estado de isLoggedOut a true
        setIsLoggedOut(true);

        // Redirige al usuario a la página de inicio de sesión
        navigate("/login");
      } else {
        // Maneja errores en caso de que la solicitud de cierre de sesión falle
        // Por ejemplo, muestra un mensaje de error al usuario
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      // Maneja errores de red u otros errores que puedan ocurrir durante el proceso de cierre de sesión
      console.error("Error inesperado:", error);
    }
  };
  return (
    <div>
      <Navbar bg="body-tertiary" variant="success">
        <Container>
          <Navbar.Brand href="#home">Sistema Control de Giras UNA, SRCH</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <a href="#login">
                <NavDropdown title="Usuario" id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
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
