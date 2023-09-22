import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";
import { NavDropdown, Nav } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const queryClient = new QueryClient();

function Layout() {
  return (
    <div>
      <Navbar bg="body-tertiary" variant="success">
        <Container>
          <Navbar.Brand href="#home">Sistema Control de Giras UNA, SRCH</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Registrado como: <a href="#login"> <NavDropdown title="Nombre Usuario" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1"><button>Cerrar Sesión</button></NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              <button>Configuración</button>
            </NavDropdown.Item>
          </NavDropdown></a>
             
            </Navbar.Text>
          </Navbar.Collapse>
          
        </Container>
      </Navbar>

      <div className="d-flex">
        <nav className="bg-white py-2 collapse-inner rounded">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <hr className="sidebar-divider" />
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  <span className="material-symbols-outlined">home</span>
                </NavLink>
              </li>
              <hr className="sidebar-divider" />
              <li className="nav-item">
                <NavLink className="nav-link" to="/vehicles">
                  <span className="material-symbols-outlined">directions_car</span>
                </NavLink>
              </li>
              <hr className="sidebar-divider" />
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  <span className="material-symbols-outlined">person</span>
                </NavLink>
              </li>
              <hr className="sidebar-divider" />
              <li className="nav-item">
                <NavLink className="nav-link" to="/vehicle">
                  <span className="material-symbols-outlined">engineering</span>
                </NavLink>
              </li>

              <hr className="sidebar-divider" />
              <li className="nav-item">
                <NavDropdown title="Folder Open" id="dropdown-basic">
                  <NavDropdown.Item>
                    <NavLink className="nav-link" to="/requestForm">
                      Request Form
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink className="nav-link" to="/endorseRequest">
                      Endorse Request
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink className="nav-link" to="/approveRequest">
                      Approve Request
                    </NavLink>
                  </NavDropdown.Item>
                </NavDropdown>
              </li>

              <hr className="sidebar-divider" />
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
    </div>
  );
}

export default Layout;
