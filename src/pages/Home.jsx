import {useSelector} from "react-redux";

import EventTable from "../components/EventTable/EventTable";
import {MembersManagement} from "./index";
import {ROLES} from "../store/data";

const Home = () => {
    const {user: {role}} = useSelector((state) => state.userSlice);

    return <>
        {
            role === ROLES.manager ? <div>Manager event page</div> :
                role === ROLES.admin ? <MembersManagement/> :
                    role === ROLES.user && <EventTable/>
        }
    </>;
};

export default Home;
