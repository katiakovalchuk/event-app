import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const DialogContext = createContext();

export const DialogContextProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [requireConfirm, setRequireConfirm] = useState(false);
  const [order, setOrder] = useState("asc");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const addRequireConfirm = () => setRequireConfirm(true);
  const removeRequireConfirm = () => setRequireConfirm(false);

  const [userMode, setUserMode] = useState(null);
  const setUserModalMode = (mode) => setUserMode(mode);

  const [data, setData] = useState({});
  const requestData = () => data;
  const addData = (data) => setData(data);

  const notifySuccess = (content) => {
    toast.success(content);
  };
  const notifyError = (content) => {
    toast.error(content);
  };

  const handleOrder = () =>
    setOrder((prev) => (prev === "asc" ? "dsc" : "asc"));

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

  const [deleteMode, setDeleteMode] = useState(false);

  const setDelete = () => setDeleteMode(true);
  const removeDelete = () => setDeleteMode(false);

  return (
    <DialogContext.Provider
      value={{
        showModal,
        requireConfirm,
        addRequireConfirm,
        removeRequireConfirm,
        notifySuccess,
        notifyError,
        itemEdit,
        handleShowModal,
        handleCloseModal,
        startEdit,
        hideEdit,
        deleteMode,
        setDelete,
        removeDelete,
        order,
        handleOrder,
        userMode,
        setUserModalMode,
        addData,
        requestData,
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
