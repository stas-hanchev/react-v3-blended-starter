// import React from 'react';
// import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import type { Photo } from '../types/photo';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  }
};

Modal.setAppElement('#root');

interface ImageModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  selectedPhoto: Photo | null;
}

const ImageModal = ({ modalIsOpen, closeModal, selectedPhoto}: ImageModalProps) => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            backgroundColor: selectedPhoto?.avg_color,
            borderColor: selectedPhoto?.avg_color,
          }}>
          <img src={selectedPhoto?.src.large} alt={selectedPhoto?.alt} />
        </div>
      </Modal>
    )
}

export default ImageModal;