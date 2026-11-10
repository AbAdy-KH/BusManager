import { useState } from 'react';

/**
 * Reusable hook managing standard modal and CRUD actions across admin tabs.
 */
export function useCrudTab({
  fetchItems,
  deleteItem,
  setItems,
  confirmDeleteMessage = 'Are you sure you want to delete this item?',
  onError,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);

  const handleOpenAdd = () => {
    setSelectedItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemToEdit(null);
  };

  const handleDelete = async (...deleteArgs) => {
    if (window.confirm(confirmDeleteMessage)) {
      try {
        await deleteItem(...deleteArgs);
        const updated = await fetchItems();
        setItems(updated);
      } catch (err) {
        onError?.(err.message);
      }
    }
  };

  const handleSaved = async () => {
    try {
      const updated = await fetchItems();
      setItems(updated);
      setIsModalOpen(false);
      setSelectedItemToEdit(null);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedItemToEdit,
    setSelectedItemToEdit,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleDelete,
    handleSaved,
  };
}
