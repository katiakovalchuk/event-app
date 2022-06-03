import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {addNewUser, deleteUser, getUsers, updateUser} from "../../store/slices/usersSlice";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase-config";


const List = () => {
    const dispatch = useDispatch();
    const {data: users, status, error} = useSelector(state => state.usersSlice);
    console.log(users);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch])

    // const {data, status, error} = useSelector(state => state.usersSlice);
    // const [users, setUsers] = useState(data);
    // console.log(data);
    // console.log(users);
    //
    // useEffect(() => {
    //     dispatch(getUsers());
    //     setUsers(data);
    // }, [dispatch]);
    //
    // useEffect(() => {
    //     onSnapshot(collection(db, "users"), snapshot => {
    //         const snapshotUsers = [];
    //         snapshot.docs.forEach(doc => {
    //             snapshotUsers.push({...doc.data(), id: doc.id});
    //         })
    //         setUsers(snapshotUsers);
    //         })
    // }, [onSnapshot]);


    return (
        <>
            <ul>
                <button onClick={e => {
                    e.preventDefault();
                    dispatch(addNewUser({name: 'Oleg'}))
                }}>Add user
                </button>
                <button onClick={e => {
                    e.preventDefault();
                    dispatch(updateUser({id: "t9RFtLfo2ZD4kSBZ72Zw", name: "Igor", email: "email", phone: "phone"}));
                }}>
                    Update user
                </button>
                <button onClick={e => {
                    e.preventDefault();
                    dispatch(deleteUser("jPSIJMesT6Z65bYrkDHC"));
                }}>
                    Delete user
                </button>
                {error && <h2>{error}</h2>}
                {status}
                {
                    users && users.map((user, idx) => (
                        <li key={user.id}>{idx + 1}. {user.name}</li>
                    ))
                }
            </ul>
        </>
    )
}

export default List;
