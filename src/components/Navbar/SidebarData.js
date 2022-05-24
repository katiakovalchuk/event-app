import React from "react";
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Login",
    path: "/login",
    icon: <AiIcons.AiOutlineLogin />,
    cName: "nav-text",
  },
  {
    title: "Recovery",
    path: "/recovery",
    icon: <IoIcons.IoIosSettings />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <CgIcons.CgProfile />,
    cName: "nav-text",
  },
  {
    title: "Members",
    path: "/members",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
];
