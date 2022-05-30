import React from "react";
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome/>,
        cName: "nav-text",
    },
    {
        title: "Profile",
        path: "/profile",
        icon: <CgIcons.CgProfile/>,
        cName: "nav-text",
    },
    {
        title: "Members",
        path: "/members",
        icon: <IoIcons.IoMdPeople/>,
        cName: "nav-text",
    },
    {
        title: "Events",
        path: "/events",
        icon: <RiIcons.RiCalendarEventFill/>,
        cName: "nav-text",
    },
];
