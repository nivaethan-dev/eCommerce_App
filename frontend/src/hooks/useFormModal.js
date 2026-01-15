import { useState } from 'react';

/**
 * Custom hook to manage form modal state
 * @returns {Object} Modal state and controls
 */
const useFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal
  };
};

export default useFormModal;

