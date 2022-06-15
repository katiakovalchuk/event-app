import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {EmailAuthProvider} from "firebase/auth";
import PropTypes from "prop-types";

import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {updateUserByInitialEmail} from "../../store/slices/usersSlice";

export const ConfirmSignIn = ({newEmail, updatedUser}) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {user, changeEmail, reauthenticate} = useUserAuth();
    const {handleCloseModal, handleShowToast} = useDialog();
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            handleShowToast();
        }
    }, [error]);

    const handleSubmit = async e => {
        e.preventDefault();
        const cred = EmailAuthProvider.credential(
            user.email,
            password
        );
        try {
            await reauthenticate(user, cred);
            await changeEmail(user, newEmail);
            await dispatch(updateUserByInitialEmail(updatedUser));
            window.location.reload();
        } catch (err) {
            handleCloseModal();
            setError(err);
            handleShowToast();
        }
    };

    const handlePasswordChange = e =>
        setPassword(e.target.value);

    return (
        <form
            className="d-flex flex-column align-items-center w-100 my-4"
            onSubmit={handleSubmit}
        >
            <div className="w-100 d-flex justify-content-center position-relative">
                <input
                    className="form-control mb-4 rounded-3 w-75"
                    type="password"
                    placeholder="Password"
                    required
                    onChange={handlePasswordChange}
                />
            </div>
            <button
                className="btn btn-secondary w-25 mt-1 rounded-3"
                type="submit"
            >
                Confirm
            </button>
        </form>
    );
};

export default ConfirmSignIn;

ConfirmSignIn.propTypes = {
    newEmail: PropTypes.string,
    updatedUser: PropTypes.object
};
