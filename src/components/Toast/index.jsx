import {useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {FaLock} from "react-icons/fa";

import {useToast} from "../../context/toastContext";

const CustomToast = () => {
    const {isToastShown, toastContent} = useToast();
    const [show, setShow] = useState(isToastShown);

    return (
        <ToastContainer className="pt-5" position='top-center'>
            <Toast
                onClose={() => setShow(false)} show={show} delay={7000} autohide>
                <Toast.Header>
                    <FaLock className="me-1"/>
                    <strong className="me-auto">{toastContent.heading}</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>{toastContent.body}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default CustomToast;
