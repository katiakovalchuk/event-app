import {useUserAuth} from "../context/authContext";
import {AppStack} from "./AppStack";
import {AuthStack} from "./AuthStack";

const Router = () => {
    const {user} = useUserAuth();

    if (user && !Object.keys(user).length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {
                !user ? <AuthStack/> : <AppStack/>
            }
        </>
    )
}

export default Router;
