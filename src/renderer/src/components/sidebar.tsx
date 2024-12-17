import { Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TaskIcon from "@mui/icons-material/Task";
import GroupsIcon from "@mui/icons-material/Groups";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

export function Sidebar() {
  return (
    <div className="bg-[#000] min-h-screen w-72 p-4 flex flex-col fixed">
      <h1 className="text-3xl text-[#fff] font-bold mb-6">Storage</h1>

      <nav className="flex flex-col gap-6 mt-5 text-xl h-full w-full">
        <Link
          to="/"
          className="text-[#fff] relative group transition-all duration-300 ease-in-out flex items-center justify-between"
        >
          <p> Ver NFS-e feitas </p> <TaskIcon />
          <span className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#fff] group-hover:scale-105 transition-all duration-300 ease-in-out"></span>
        </Link>

        <Link
          to="/new-tax-invoice"
          className="text-[#fff] relative group transition-all duration-300 ease-in-out flex items-center justify-between"
        >
          <p>Nova NFS-e</p> <NoteAddIcon />
          <span className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#fff] group-hover:scale-105 transition-all duration-300 ease-in-out"></span>
        </Link>

        <Link
          to="/tax-invoices-to-do"
          className="text-[#fff] relative group transition-all duration-300 ease-in-out flex items-center justify-between"
        >
          <p>NFS-e não feitas</p> <AssignmentLateIcon />
          <span className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#fff] group-hover:scale-105 transition-all duration-300 ease-in-out"></span>
        </Link>

        <Link
          to="/all-customers"
          className="text-[#fff] relative group transition-all duration-300 ease-in-out flex items-center justify-between"
        >
          <p>Ver todos os clientes</p> <GroupsIcon />
          <span className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#fff] group-hover:scale-105 transition-all duration-300 ease-in-out"></span>
        </Link>

        <Link
          to="/new-customer"
          className="text-[#fff] relative group flex items-center justify-between gap-2 transition-all duration-300 ease-in-out"
        >
          <p>Novo cliente</p> <PersonAddIcon />
          <span className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#fff] group-hover:scale-105 transition-all duration-300 ease-in-out"></span>
        </Link>
      </nav>
    </div>
  );
}
