import React, { useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Row, Col, Accordion, Form, Button, Container, Table, Modal, FormLabel } from "react-bootstrap";
import { create, getNotices, deleteNotice, changeStatus } from "../../services/NoticeService.js";
import Swal from "sweetalert2";
import DataTable from 'datatables.net';
import "../../stylesheets/vies.css"
import "../../stylesheets/button.css"
import "../../stylesheets/generalDesign.css"

function Notices() {
  const mutation = useMutation("notices", create);

  const { isLoading, data, isError } = useQuery("notices", getNotices, {
    enabled: true,
  });

  const [notices, setNotices] = useState([]);
  const [dataTable, setDataTable] = useState(null);



  useEffect(() => {
    if (data) {
      setNotices(data);

      if (!dataTable) {
        const newDataTable = new DataTable("#tableNotices", {
          language: {
            processing: "Procesando...",
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ elementos",
            info: "Mostrando elementos _START_ al _END_ de un total de _TOTAL_ elementos",
            infoEmpty: "Mostrando 0 elementos",
            infoFiltered: "(filtrado de _MAX_ elementos en total)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron elementos",
            emptyTable: "No hay datos disponibles en la tabla",
            paginate: {
              first: "Primero",
              previous: "Anterior",
              next: "Siguiente",
              last: "Último"
            },
            aria: {
              sortAscending: ": activar para ordenar la columna de manera ascendente",
              sortDescending: ": activar para ordenar la columna de manera descendente"
            }
          },
          retrieve: true,
          bLengthChange: false,
          responsive: true,
        });
        setDataTable(newDataTable);
      }
    }
  }, [data, dataTable]);

  const noticeTitle = useRef(null);
  const noticeBody = useRef(null);
  const status = useRef(true);
  const date = useRef(null);


  const mutationStatus = useMutation("notices", changeStatus);

  const handleStatusChange = (noticeId, newStatus) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cambiar el estado?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        mutationStatus.mutateAsync(noticeId)
          .then(() => {
            // Recargar la página después de realizar el cambio
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error al actualizar el estado de la noticia:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el estado de la noticia',
            });
          });
      }
    });
  };
  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  const handleSave = () => {
   

    const dateValue = date.current.value;

    const newNotice = {
      title: noticeTitle.current.value,
      body: noticeBody.current.value,
      status: true,
      date: dateValue,
    };
    try {
      mutation.mutateAsync(newNotice);
      Swal.fire({
        icon: 'success',
        title: 'Noticia creada',
        text: 'La noticia se ha creado exitosamente',
      }).then(() => {
     
        window.location.reload();
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la noticia',
      });
    }
  };

  //////////edit/////////////////////////////
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };


  const [editingNotice, setEditingNotice] = useState(null);

  const handleEditClick = (NoticeId) => {
    const noticeToEdit = data.find((notice) => notice.id === NoticeId);
    setEditingNotice(noticeToEdit);
    setShowEditModal(true);
  };

  const handleUpdate = () => {

    let updatedNotice = {
      id: editingNotice.id,
      title: noticeTitle.current.value,
      body: noticeBody.current.value,
      date: date.current.value,
      status: editingNotice.status,
    };

    try {
       mutation.mutateAsync(updatedNotice);
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Noticia actualizada',
        text: 'La noticia se ha actualizado exitosamente',
      })
    } catch (error) {
      console.error('Error al actualizar la noticia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar la noticia',
      });
    }
  
    setShowEditModal(false);
  };


  /////////////////////////////////////////

  const handleDelete = async (noticeId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await deleteNotice(noticeId);
        Swal.fire(
          'Eliminado!',
          'Tu noticia ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar la noticia.',
        'error'
      );
    }
  };


  return (
    <>
      <Container className="container-fluid">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Noticias</h2>
        <p className="mb-4">Lista de noticias</p>

        <div className="card shadow mb-4">
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Clic en el botón para crear una noticia</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleSave}>
                    <Container>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3 mt-3">
                            <Form.Label htmlFor="inputtitle">
                              Título
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="form-control"
                              placeholder="Ingrese el título"
                              name="title"
                              ref={noticeTitle}
                              required
                            />
                          </div>
                        </Col>

                        <Col md={6}>
                          <div className="mb-3 mt-3">
                            <Form.Label htmlFor="inputbody">
                              Contenido
                            </Form.Label>
                            <Form.Control
                              type="area"
                              className="form-control"
                              placeholder="Ingrese la noticia"
                              name="body"
                              ref={noticeBody}
                              required
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3 mt-3">
                            <Form.Label htmlFor="inputimage">
                              Fecha creación
                            </Form.Label>
                            <Form.Control
                              type="date"
                              className="form-control"
                              name="date"
                              ref={date}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Button variant="success" className="buttonSave" type="submit">
                        Guardar
                      </Button>
                    </Container>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="card-body text-center">
            <Table responsive className="display nowrap" id="tableNotices">
              <thead >
                <tr>
                  <th className="text-center">Título</th>
                  <th className="text-center">Contenido</th>
                  <th className="text-center">Acciones </th>
                </tr>
              </thead>
              <tbody>
                {data && data.map((notice) => (
                  <tr key={notice.id}>
                    <td>{notice.title} </td>
                    <td>{notice.body}</td>

                    <td className="text-center">
                      <Button
                        variant={notice.status ? "success" : "secondary"}
                        onClick={() => handleStatusChange(notice.id, !notice.status)}
                        style={{marginRight: '5px'}}
                        className={`toggle-button ${notice.status ? "active" : "inactive"}`}
                      >
                        
                        <i class="bi bi-toggle-on"></i>
                      </Button>

                      <Button
                        variant="warning"
                        className="bg-gradient-warning mr-1 text-light"
                        onClick={() => handleEditClick(notice.id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>

                      <Button
                        variant="danger"
                        className="bg-gradient-danger mr-1 text-light"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Noticia </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={editingNotice ? editingNotice.title : ""}
                  ref={noticeTitle}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={editingNotice ? editingNotice.body : ""}
                  ref={noticeBody}
                />
              </Col>
            </Row>
            <Row>
              <Col >
                <Form.Label>Fecha de creación</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={editingNotice ? formatDate(editingNotice.date) : ""}
                  ref={date}
                  style={{ marginBottom: '10px' }}
                />
              </Col>
              <Row>

                <Col>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={editingNotice ? editingNotice.status.toString() : "" }
                    onChange={(e) => handleStatus(editingNotice.id, e.target.value)}
                 disabled
                 >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Form.Select>
                </Col>


              </Row>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="success" className="buttonSave" onClick={handleUpdate}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
export default Notices;
