import EventTable from "../components/EventTable/EventTable";
import {useSelector} from "react-redux";

const Home = () => {

    const user = {type: "admin"}

  return (
    <div className="home_page">
        {
            user.type === "user" && <EventTable />
        }
        {
            user.type === "manager" && <div>Manager home</div>
        }
        {
            user.type === "admin" && <div>Admin home</div>
        }
    </div>
  );
};

export default Home;
