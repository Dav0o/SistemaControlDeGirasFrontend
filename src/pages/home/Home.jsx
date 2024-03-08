import React from "react";
import "../../stylesheets/home.css";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import { useAuth } from "../../auth/AuthProviders";
import { useNavigate } from "react-router-dom";

function Home() {

  useEffect(() => {
    $(".carousel .carousel-item").each(function () {
      var minPerSlide = 4;
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(":first");
      }
      next.children(":first-child").clone().appendTo($(this));

      for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(":first");
        }
        next.children(":first-child").clone().appendTo($(this));
      }
    });
  }, []);

  return (
    <>
      <div className="container">
        <div
          id="myCarousel"
          className="carousel slide container mb-5"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner w-100">
            <div className="carousel-item active">
              <div className="col-md-3">
                <div className="card card-body">
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/640x360?text=1"
                  />
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="col-md-3">
                <div className="card card-body">
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/640x360?text=2"
                  />
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="col-md-3">
                <div className="card card-body">
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/640x360?text=3"
                  />
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="col-md-3">
                <div className="card card-body">
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/640x360?text=4"
                  />
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="col-md-3">
                <div className="card card-body">
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/640x360?text=5"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        
        <Row>
          <div className="shadow p-4">
            <Row>
              <Col>
                <h2 className="mb-4">Información de Contacto</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam suscipit laudantium temporibus omnis deserunt quia reprehenderit harum maxime adipisci vitae, blanditiis nulla! Neque minus a nostrum repudiandae, praesentium officiis deserunt.</p>
              </Col>

              <Col >
              <Image className="img-home-plate" src="https://www.unacomunica.una.ac.cr/images/Jhonny/IMG_8991.jpg#joomlaImage://local-images/Jhonny/IMG_8991.jpg?width=1920&height=1280" thumbnail  />
                
              
              </Col>
            </Row>
          </div>
        </Row>
      </div>
    </>
  );
}

export default Home;
