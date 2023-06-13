import { Link, useLocation } from "react-router-dom";

export type TLink = {
  text: string;
  linkTo: string;
  icon?: JSX.Element;
  notShow?: boolean;
  handleClose: () => void;
};

export default function SidebarLink(props: TLink) {
  const location = useLocation();
  return (
    <Link
      onClick={props.handleClose}
      to={props.linkTo}
      className={`flex items-center ${
        location.pathname == props.linkTo
          ? "bg-emerald-300 text-green-800"
          : "text-gray-500"
      } hover:bg-emerald-300 transition-colors duration-150 ease-in-out hover:text-green-700 px-4 py-2 rounded-md font-semibold`}
    >
      <span className="mr-3">{props.icon}</span>
      <span>{props.text}</span>
    </Link>
  );
}
