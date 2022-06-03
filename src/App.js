import Router from "./routes";
import { AuthContextProvider } from "./context/authContext";
import { ToastContextProvider } from "./context/toastContext";
import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <ToastContextProvider>
        <Router />
      </ToastContextProvider>
    </AuthContextProvider>
  );
}

export default App;
