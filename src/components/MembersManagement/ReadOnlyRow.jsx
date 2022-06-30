/* eslint-disable react/prop-types */
import React from "react";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";

import { useUserAuth } from "../../context/authContext";
import { useDialog } from "../../context/dialogContext";
import {ROLES} from "../../store/data";
import { CustomButton } from "../elements";

const ReadOnlyRow = ({ data, columns, handleDeleteClick, handleEditClick }) => {
  const { user } = useUserAuth();
  const { removeRequireConfirm } = useDialog();
  const {pathname} = useLocation();
  const {
    user: { role },
  } = useSelector((state) => state.userSlice);

  return (
    <tr key={data.id}>
      {columns.map(({ accessor }) => {
        const tData = String(data[accessor]) ? data[accessor] : "——";
        if (accessor === "action") {
          return (
            <td className="text-center align-middle" key={accessor}>
              <div className="event__actions">
                <CustomButton
                  className="action"
                  onClick={(event) => {
                    handleEditClick(event, data);
                    removeRequireConfirm();
                  }}
                >
                  <RiEdit2Fill className="icon" />
                </CustomButton>
                <CustomButton
                  disabled={data.id === user.uid}
                  className="action"
                  variant="danger"
                  onClick={() => handleDeleteClick(data)}
                >
                  <GoTrashcan className="icon" />
                </CustomButton>
              </div>
            </td>
          );
        } else if (accessor === "image") {
          return (
            <td className="imageField" key={accessor}>
              <img src={tData} className="profileImage" alt="User image" />
            </td>
          );
        } else if (accessor === "birth") {
          return (
            <td className="align-middle text-center" key={accessor}>
              {data.isShowBirthday ? tData : <span>🚫</span>}
            </td>
          );
        } else if (accessor === "scores" && role === ROLES.admin && pathname.startsWith("/managers-management")) {
          return null;
        } else {
          return (
            <td className="align-middle" key={accessor}>
              {tData}
            </td>
          );
        }
      })}
    </tr>
  );
};

export default ReadOnlyRow;
