import { useState } from "react";

const useModalDel = () => {
  const [modalOpenDel, setModalOpenDel] = useState(false);

  const closeDel = () => setModalOpenDel(false);
  const openDel = () => setModalOpenDel(true);

  return { modalOpenDel, closeDel, openDel };
};

export default useModalDel;
