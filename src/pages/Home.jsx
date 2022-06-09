import EventTable from "../components/EventTable/EventTable";
import {AdminMembersManagement} from "./index";
import {ROLES} from "../store/roles";

const Home = () => {
    const userRole = JSON.parse(localStorage.getItem("role"));

    return (
        <div className="home_page">
            {
                userRole === ROLES.manager ? <div>Manager event page</div> :
                    userRole === ROLES.admin ? <AdminMembersManagement/> :
                        userRole === ROLES.user && <EventTable/>

            }
        </div>
    );
};

export default Home;
