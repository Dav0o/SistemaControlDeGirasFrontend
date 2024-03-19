import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getRequestByUserId } from '../../../services/RequestService'
import { useAuth } from '../../../auth/AuthProviders';
import { Button, Card, Container } from 'react-bootstrap';
import SeeRequest from '../../../components/SeeRequest';
import { Link } from 'react-router-dom';

function MyRequests() {
    const {user} = useAuth();

    const [userId, setUserId] = useState(0);

  const {
    isLoading,
    data,
    isError,
  } = useQuery(["users", userId], () => getRequestByUserId(userId));

  useEffect(() => {
    if (user) {
      for (const claim in user) {
        if (claim.endsWith("/nameidentifier")) {
         
          setUserId(user[claim]);
          
        }
      }
    }
  }, [user]);

   console.log(data);

    if(isLoading){
        <div>Loading...</div>
    }

    if(isError){
        <div>Error</div>
    }

  return (
    <Container className="mb-3">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Mis solicitudes </h2>
        <p className="mb-4">Lista de solicitudes</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>Dé clic en el icono ' i ' de detalles para obtener más información sobre sus solicitudes. </p>
          </div>
          <div className="card-body">
            {data ? data.map((request) => (
              <Card key={request.id}>
                <Card.Header>{request.consecutiveNumber}</Card.Header>
                <Card.Body>
                  <Card.Title>{request.objective}</Card.Title>
                  <Card.Text>
                    Fecha de salida {request.departureDate} con el destino de{" "}
                    {request.destinyLocation}
                  </Card.Text>

                  <SeeRequest data={request}/>

                  <Button
                    variant={
                      request.itsApprove
                        ? "success"
                        : request.itsCanceled
                          ? "danger" 
                          : "info" 
                    }
                    className="text-light rounded-circle"
                    style={{
                      float: "right",   
                      backgroundColor: request.itsApprove
                        ? "rgba(0, 255, 0, 0.5)" 
                        : request.itsCanceled
                          ? "rgba(255, 0, 0, 0.5)" 
                          : "rgba(0, 0, 255, 0.5)" 
                    }}
                  >
                    {request.itsApprove ? "Aprobada" : "Anulada"}
                  </Button>
                </Card.Body>
              </Card>
              
            )) : ''}
          </div>
        </div>
        <Button className="buttonCancel">
          <Link to="/profile">Regresar </Link>
        </Button>
      </Container>
      
  )
}

export default MyRequests
