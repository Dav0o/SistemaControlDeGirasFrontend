import React, { useState, useEffect } from "react";
import "../../stylesheets/home.css";
import { Row, Col, Card } from "react-bootstrap";
import { useQuery } from "react-query";
import { getNotices } from "../../services/NoticeService";

function Home() {
  const [notices, setNotices] = useState([]);

  const { isLoading, data, isError } = useQuery("notices", getNotices, {
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      const noticesActive = data.filter((notice) => notice.status === true);
      setNotices(noticesActive);
    }
  }, [data]);

  return (
    <div className="container">
      <h2 className="display-5 fw-bold text-muted text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        Sistema de Control de Giras UNA
      </h2>
      <h2 className="display-5 fw-bold text-muted text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
        Sede Regional Chorotega
      </h2>
      <div className="container-fluid px-4 py-5 my-5 text-center">
        <div className="lc-block col-lg-6 mx-auto mb-4">
          <div editable="rich">
            <p className="lead ">
              Para realizar una solicitud dé clic en el botón
            </p>
          </div>
        </div>

        <div className="lc-block d-grid gap-2 d-sm-flex justify-content-sm-center">
          {" "}
          <a
            className="btn buttonCancel  btn-lg px-4 gap-3 text-light"
            href="/requestForm"
            role="button"
          >
            Ir al formulario
          </a>

        </div>
      </div>

      <h3 className="text-center mb-4 text-black-50">Noticias Generales</h3>
      <div className="card-slider">
        {notices.map((notice) => (
          <div key={notice.id} className="card-slider-item">
            <Card className="mb-4">
              <Card.Body className="Body">
                <Card.Text className="text-muted mb-2">
                  {new Date(notice.date).toLocaleDateString()}
                </Card.Text>
                <Card.Title className="mb-3">{notice.title}</Card.Title>
                <Card.Text>{notice.body}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Row className="mt-5">
        <div className="shadow p-4 w-100">
          <Row className="align-items-center">
            <Col sm={6}>
              <h4 className="mb-4">Información de Contacto</h4>
              <div className="Info">
                <ul className="list-unstyled">
                  <li>
                    <strong>UNA Campus Nicoya</strong>
                  </li>

                  <li>
                    <strong>Encargada:</strong> Ericka Hernández Ramírez
                  </li>
                  <li>
                    <strong>Teléfono:</strong> 2562 6201
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong>
                    ericka.hernandez.ramirez@una.cr
                  </li>
                </ul>
                <ul className="list-unstyled">
                  <li>
                    <strong>UNA Campus Liberia</strong>
                  </li>
                  <li>
                    <strong>Encargada:</strong> Kenya Campos Bogantes
                  </li>
                  <li>
                    <strong>Teléfono:</strong> 2562 6258
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong>{" "}
                    kenya.campos.bogantes@una.cr
                  </li>
                </ul>
              </div>
            </Col>

            <Col sm={6} className="text-center">
              <img
                className="img-thumbnail"
                src="https://www.chorotega.una.ac.cr/images/RESIDENCIAS/Mesa1%201.jpg"
              />
            </Col>
          </Row>
        </div>
      </Row>
    </div>
  );
}
export default Home;
