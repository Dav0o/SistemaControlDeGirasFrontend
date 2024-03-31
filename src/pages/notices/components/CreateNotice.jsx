import React, { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { create } from "../../../services/NoticeService.js";



function CreateNotice({ onSuccess }) {

  const mutation = useMutation("notices", create);
 
  const noticeTitle = useRef(null);
  const noticeBody = useRef(null);

  const [validationErrorT, setValidationErrorT] = useState(false);
  const [validationErrorB, setValidationErrorB] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const costaRicaTimezoneOffset = -6 * 60;
    const costaRicaTime = new Date(currentDate.getTime() + costaRicaTimezoneOffset * 60 * 1000);
    const formattedDate = costaRicaTime.toISOString().split('T')[0];

    if (noticeTitle.current.value.trim()) {
      if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s\-\/,._:&"]+$/.test(noticeTitle.current.value.trim())) {
        setValidationErrorT(true);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El título presenta algún caracter inválido'
        });
        return;
      } else {
        setValidationErrorT(false);
      }
    }

    if (!noticeBody.current.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El contenido es requerido'
      });
      return;

    } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s\d\-\/.,_:&()"']+$/.test(noticeBody.current.value.trim())) {
      setValidationErrorB(true);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El contenido presenta algún caracter inválido'
      });
      return;
    } else {
      setValidationErrorB(false);
    }
  

    const newNotice = {
      title: noticeTitle.current.value,
      body: noticeBody.current.value,
      status: true,
      date: formattedDate,
    };

    try {
      await mutation.mutateAsync(newNotice);
      Swal.fire({
        icon: 'success',
        title: 'Noticia creada',
        text: 'La noticia se ha creado exitosamente',
      });
      onSuccess();
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la noticia',
      });
    }
  };

  return (
    <Form onSubmit={handleSave}>
      <Container>
        <Row>
          <Col md={6}>
            <div className="mb-3 mt-3">
              <Form.Label htmlFor="inputtitle">Título</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Ingrese el título"
                name="title"
                ref={noticeTitle}
              />
                {validationErrorT && (
              <Form.Text className="text-muted">
                solo acepta letras y , . - _ : / & "
              </Form.Text>
               )}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3 mt-3">
              <Form.Label htmlFor="inputbody">Contenido</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                placeholder="Ingrese la noticia"
                name="body"
                ref={noticeBody}
              />
                   {validationErrorB && (
              <Form.Text className="text-muted">
              Solo se permiten letras, números y  - . , _ : \ / & ()"
              </Form.Text>
               )}
            </div>
          </Col>
        </Row>
        <Button variant="success" className="buttonSave" type="submit">
          Guardar
        </Button>
      </Container>
    </Form>
  );
}

export default CreateNotice;
