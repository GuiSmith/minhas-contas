// ToastConfirm.jsx
import { toast } from "react-toastify";

const ToastConfirm = ({ question }) => {
  return new Promise((resolve) => {
    const id = toast(
      <div className="d-flex flex-column gap-2">
        <span className="fw-semibold">{question}</span>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => {
              toast.dismiss(id);
              resolve(true);
            }}
          >
            Sim
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              toast.dismiss(id);
              resolve(false);
            }}
          >
            Não
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  });
}

export default ToastConfirm;