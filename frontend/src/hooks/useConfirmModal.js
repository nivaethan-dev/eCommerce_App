import { useState } from 'react';

/**
 * Custom hook to manage confirm modal state
 * @returns {Object} Modal state, controls, and selected item
 */
const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const openModal = (item) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    itemToDelete
  };
};

export default useConfirmModal;

