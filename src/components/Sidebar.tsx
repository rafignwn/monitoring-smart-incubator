import {
  HomeTwo,
  ChartLine,
  Data,
  Logout,
  // Peoples,
  // PeoplePlusOne,
  // EditName,
  Control,
} from "@icon-park/react";
import { useNavigate } from "react-router-dom";
import { TLink } from "./SidebarLink";
import incubator from "../assets/incubator.png";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SidebarLink from "./SidebarLink";
import SidebarButton, { TButton } from "./SidebarButton";
import { auth } from "../firebase";

export default function Sidebar({ handleClose }: { handleClose: () => void }) {
  const navigation = useNavigate();
  const { dispatch } = useContext(AuthContext);
  // const notShow: boolean = (currentUser as TUser)?.role !== "admin";

  const links: Array<TLink> = [
    {
      text: "Dashboard",
      icon: <HomeTwo size={20} />,
      linkTo: "/",
      handleClose,
    },
    {
      text: "Activity",
      icon: <ChartLine size={20} />,
      linkTo: "/activity",
      handleClose,
    },
    {
      text: "Realtime Data",
      icon: <Data size={20} />,
      linkTo: "/realtime",
      handleClose,
    },
    {
      text: "Controler",
      icon: <Control size={20} />,
      linkTo: "/control",
      handleClose,
    },
    // {
    //   text: "Notifications",
    //   icon: <Remind size={20} />,
    //   linkTo: "/notif",
    //   handleClose,
    // },
    // {
    //   text: "Edit Profile",
    //   icon: <EditName size={20} />,
    //   linkTo: "/edit",
    //   handleClose,
    // },
    // {
    //   text: "Users",
    //   notShow,
    //   icon: <Peoples size={20} />,
    //   linkTo: "/users",
    //   handleClose,
    // },
    // {
    //   text: "Add User",
    //   notShow,
    //   icon: <PeoplePlusOne size={20} />,
    //   linkTo: "/adduser",
    //   handleClose,
    // },
  ];

  const buttons: Array<TButton> = [
    {
      text: "Logout",
      icon: <Logout size={20} />,
      linkTo: "/logout",
      action: async function () {
        await auth.signOut();
        dispatch({ type: "LOGOUT" });
        navigation("/login");
      },
      handleClose,
    },
  ];

  return (
    <div className="w-full h-full">
      <h3 className="font-bold text-2xl text-gray-50 h-16 mb-5 flex items-center py-3 px-5">
        <img
          className="w-10 h-10 mr-3 bg-green-300 rounded-full"
          src={incubator}
          alt="logo"
        />
        <span className="text-green-700 font-mono text-base">
          SMART INCUBATOR
        </span>
      </h3>
      <h5 className="pl-9 text-sm uppercase text-green-600 tracking-wide font-medium mb-3">
        Menu
      </h5>
      <ul className="px-5">
        {links.map((item, index) => {
          if (item.notShow) {
            return;
          }

          return (
            <li key={index} className="mb-1">
              <SidebarLink {...item} />
            </li>
          );
        })}
        <div className="mt-20" />
        {buttons.map((item, index) => (
          <li key={index} className="mb-1">
            <SidebarButton {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
