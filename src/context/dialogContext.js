import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const DialogContext = createContext();

export const DialogContextProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [requireConfirm, setRequireConfirm] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const addRequireConfirm = () => setRequireConfirm(true);
  const removeRequireConfirm = () => setRequireConfirm(false);

  const notifySuccess = (content) => {
    toast.success(content);
  };
  const notifyError = (content) => {
    toast.error(content);
  };

  const defaultItemEdit = { item: {}, edit: false };
  const [itemEdit, setItemEdit] = useState(defaultItemEdit);

  const startEdit = (item) => {
    setItemEdit({
      item,
      edit: true,
    });
    setShowModal(true);
  };

  const hideEdit = () => {
    if (itemEdit.edit) {
      setItemEdit(defaultItemEdit);
    }
    handleCloseModal();
  };

  return (
    <DialogContext.Provider
      value={{
        showModal,
        requireConfirm,
        notifySuccess,
        notifyError,
        itemEdit,
        handleShowModal,
        handleCloseModal,
        addRequireConfirm,
        removeRequireConfirm,
        startEdit,
        hideEdit,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);

DialogContextProvider.propTypes = {
  children: PropTypes.element,
};
