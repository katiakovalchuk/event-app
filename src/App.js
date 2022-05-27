import Router from "./routes";
import {AuthContextProvider} from "./context/authContext";
import "./App.css";

function App() {

    return (
        <AuthContextProvider>
            <Router/>
        </AuthContextProvider>
    )
}

export default App;
