import {useUserAuth} from "../context/authContext";
import {AppStack} from "./AppStack";
import {AuthStack} from "./AuthStack";
import {Circles} from "react-loader-spinner";

const Router = () => {
    const {user} = useUserAuth();

    if (user && !Object.keys(user).length) {
        return (
            <div className="loader">
                <Circles color="#060b26" height={200} width={200}/>
            </div>
        );
    }

    return <>{!user ? <AuthStack/> : <AppStack/>}</>;
};

export default Router;
