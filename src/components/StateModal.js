import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Modal.css";

const StateModal = ({ show, onHide, content }) => {
  const [pdfError, setPdfError] = useState(false);
  
  useEffect(() => {
    // Reset error state when content changes
    setPdfError(false);
  }, [content]);

  if (!content || !content.id) {
    return null;
  }

  // Format the PDF path correctly - note the space in "app content"
  const pdfPath = `${process.env.PUBLIC_URL}/USA_States_app content/${content.name} app content.pdf`;

  const handlePdfError = () => {
    console.error(`Failed to load PDF for ${content.name}`);
    setPdfError(true);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="state-modal"
      dialogClassName="state-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {content.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pdf-modal-body">
        {!pdfError ? (
          <iframe
            src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={`${content.name} PDF`}
            className="seamless-pdf"
            onError={handlePdfError}
          />
        ) : (
          <div className="no-content-message">
            <p>Could not load content for {content.name}.</p>
            <p>Path attempted: {pdfPath}</p>
          </div>
        )}
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default StateModal; 