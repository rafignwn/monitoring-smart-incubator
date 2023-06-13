import { TLink } from "./SidebarLink";

export type TButton = TLink & {
  action: () => void;
};

export default function SidebarButton({ text, icon, action }: TButton) {
  return (
    <button
      onClick={action}
      className={`flex items-center w-full text-gray-500 hover:bg-red-300 transition-colors duration-150 ease-in-out hover:text-red-800 px-4 py-2 rounded-md font-semibold`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </button>
  );
}
