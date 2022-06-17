import { useState } from "react";

const useModalAdd = () => {
  const [modalOpenAdd, setModalOpen] = useState(false);

  const closeAdd = () => setModalOpen(false);
  const openAdd = () => setModalOpen(true);

  return { modalOpenAdd, closeAdd, openAdd };
};

export default useModalAdd;
