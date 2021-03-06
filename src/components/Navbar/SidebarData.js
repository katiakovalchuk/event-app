import React from "react";
import { ROLES } from "../../store/data";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as VscIcons from "react-icons/vsc";

export const SidebarData = {
  [ROLES.user]: [
    {
      title: "Home",
      path: "/",
      icon: <AiIcons.AiFillHome />,
      cName: "nav-text",
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <VscIcons.VscAccount />,
      cName: "nav-text",
    },
    {
      title: "Members",
      path: "/members",
      icon: <IoIcons.IoMdPeople />,
      cName: "nav-text",
    },
    {
      title: "Events",
      path: "/events",
      icon: <RiIcons.RiCalendarEventFill size={20} />,
      cName: "nav-text",
    },
  ],
  [ROLES.manager]: [
    {
      title: "Events",
      path: "/",
      icon: <RiIcons.RiCalendarEventFill size={28} />,
      cName: "nav-text",
    },
    {
      title: "Members Management",
      path: "/members-management",
      icon: <AiIcons.AiOutlineTeam size={36} />,
      cName: "nav-text size-large",
    },
  ],
  [ROLES.admin]: [
    {
      title: "Members Management",
      path: "/",
      icon: <AiIcons.AiOutlineTeam size={36} />,
      cName: "nav-text size-large",
    },
    {
      title: "Managers Management",
      path: "/managers-management",
      icon: <RiIcons.RiUserStarLine size={36} />,
      cName: "nav-text size-large",
    },
  ],
};
