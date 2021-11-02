import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InfoModal = (props) => {
  const { header, content, showButton } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      {showButton && (
        <Modal.Footer>
          <Button variant="light" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default InfoModal;
