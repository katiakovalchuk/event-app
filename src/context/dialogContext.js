import { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export const DialogContextProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [toastContent, setToastContent] = useState({
    heading: "Inner error",
    body: "Please contact our support team for additional information!",
  });

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

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

  return (
    <DialogContext.Provider
      value={{
        show,
        toastContent,
        handleShow,
        handleClose,
        updateToastContent,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
/*eslint react/prop-types: 0 */

export const useDialog = () => useContext(DialogContext);