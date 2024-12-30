import BackupIcon from "@mui/icons-material/Backup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function BackupCustomersButton() {
  const backupCustomers = async () => {
    try {
      await window.api.backupCustomers();
      toast.success("Backup realizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar o backup.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex mb-10">
      <button
        className="flex items-center gap-2 px-6 py-3 text-white font-medium text-lg bg-gradient-to-r from-cyan-700 via-cyan-800 to-cyan-950 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400"
        onClick={backupCustomers}
      >
        <BackupIcon className="transition-transform duration-300 ease-in-out group-hover:rotate-12" />
        Fazer Backup
      </button>
      <ToastContainer />
    </div>
  );
}
