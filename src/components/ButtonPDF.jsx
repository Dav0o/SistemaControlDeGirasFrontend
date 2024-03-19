import React, { useState } from "react";
import PdfPreview from "./PdfPreview";
import { Button, Modal } from "react-bootstrap";


function ButtonPDF({ formData }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      < Button 
      onClick={handleShow}

      style={{marginLeft: '15px'}}
      variant="danger">PDF</Button>

      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PdfPreview formData={formData}/>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ButtonPDF;
