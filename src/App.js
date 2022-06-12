import Router from "./routes";
import { AuthContextProvider } from "./context/authContext";
import { DialogContextProvider } from "./context/dialogContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <DialogContextProvider>
        <Router />
      </DialogContextProvider>
    </AuthContextProvider>
  );
}

export default App;
