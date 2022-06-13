import { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export const DialogContextProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastContent, setToastContent] = useState({
    heading: "Inner error",
    body: "Please contact our support team for additional information!",
  });
  const defaultItemEdit = { item: {}, edit: false };
  const [itemEdit, setItemEdit] = useState(defaultItemEdit);

  const handleShowToast = () => setShowToast(true);
  const handleCloseToast = () => setShowToast(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const updateToastContent = (
    toastHeading = toastContent.heading,
    toastBody = toastContent.body
  ) => {
    setToastContent((prev) => ({
      ...prev,
      heading: toastHeading,
      body: toastBody,
    }));
  };

  //edit
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
        showToast,
        showModal,
        toastContent,
        itemEdit,
        handleShowToast,
        handleCloseToast,
        handleShowModal,
        handleCloseModal,
        updateToastContent,
        startEdit,
        hideEdit,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
/*eslint react/prop-types: 0 */

export const useDialog = () => useContext(DialogContext);
