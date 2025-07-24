// src/components/common/Modal.jsx

import React from 'react';
import { createPortal } from 'react-dom';

/**
 * A modal dialog component that overlays the page.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} props.children - Content to display inside the modal.
 * @param {string} [props.title] - Optional title for the modal header.
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body // Portals the modal to the body tag to avoid CSS stacking issues
  );
};

export default Modal;