import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserByEmail } from "../store/slices/userSlice";

const UserEvents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(getUserByEmail());
  }, []);
  console.log(user);
  return <div></div>;
};

export default UserEvents;
