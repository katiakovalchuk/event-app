import { createContext, useContext, useState } from "react";

const toastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const [isToastShown, setIsToastShown] = useState(false);
  const [toastContent, setToastContent] = useState({
    heading: "Inner error",
    body: "Please contact our support team for additional information!",
  });

  const showToast = () => setIsToastShown(true);
  const hideToast = () => setIsToastShown(false);

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
    <toastContext.Provider
      value={{
        isToastShown,
        showToast,
        hideToast,
        toastContent,
        updateToastContent,
      }}
    >
      {children}
    </toastContext.Provider>
  );
};

export const useToast = () => useContext(toastContext);

/*eslint react/prop-types: 0 */
