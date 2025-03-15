import React from "react";
import Modal from "react-bootstrap/Modal";
import "./Modal.css";

const CustomModal = (props) => {
  const formattedAbout =
    props.content.about &&
    props.content.about.split("\n").map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  return (
    <div>
      <Modal
        {...props}
        size="lg"
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.content.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <p>{formattedAbout}</p>
            <p>
              <span style={{ fontWeight: 700 }}>Courses Offered:</span>{" "}
              {props.content.courses}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Fee/yr:</span>{" "}
              {props.content.fee}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Application Fee:</span>{" "}
              {props.content.applicationfee}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <div>
          <p><a href={props.content.link}>link</a></p>
          </div>
          {/* <Button onClick={props.onHide}>Close</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomModal;
