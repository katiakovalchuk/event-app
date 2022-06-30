import {useSelector} from "react-redux";

import EventTable from "../components/EventTable/EventTable";
import {Events, MembersManagement} from "./index";
import {ROLES} from "../store/data";

const Home = () => {
    const {user} = useSelector((state) => state.userSlice);
    const role = user?.role;

    return <>
        {
            role === ROLES.manager ? <Events /> :
                role === ROLES.admin ? <MembersManagement/> :
                    role === ROLES.user && <EventTable/>
        }
    </>;
};

export default Home;
