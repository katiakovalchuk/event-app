import EventTable from "../components/EventTable/EventTable";
import { MembersManagement } from "./index";
import { ROLES } from "../store/data";
import { useSelector } from "react-redux";

const Home = () => {
  const {
    user: { role },
  } = useSelector((state) => state.userSlice);

  return (
    <div className="home_page">
      {role === ROLES.manager ? <div>Manager event page</div> : role === ROLES.admin ? <MembersManagement /> : role === ROLES.user && <EventTable />}
    </div>
  );
};

export default Home;
