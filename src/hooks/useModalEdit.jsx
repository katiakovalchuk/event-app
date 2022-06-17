import { useState } from "react";

const useModalAdd = () => {
  const [modalOpenEdit, setModalOpenEdit] = useState(false);

  const closeEdit = () => setModalOpenEdit(false);
  const openEdit = () => setModalOpenEdit(true);

  return { modalOpenEdit, closeEdit, openEdit };
};

export default useModalAdd;
