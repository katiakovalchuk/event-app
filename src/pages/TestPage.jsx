import { useUserAuth } from "../context/authContext";

const TestPage = () => {
  const { logout, user } = useUserAuth();

  return (
    <div>
      <button className="login-form-btn btn w-100 mt-1 rounded-3" onClick={() => console.log(user)}>
        Check user
      </button>
      <button className="login-form-btn btn w-100 mt-1 rounded-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default TestPage;
