import {Toast, ToastContainer} from "react-bootstrap";
import {FaLock} from "react-icons/fa";

import {useDialog} from "../../context/dialogContext";
import "./style.scss";

const CustomToast = () => {
    const {show, handleClose, toastContent} = useDialog();

    return (
         show && <ToastContainer className="Toast mt-5" position="top-center">
             <Toast className="Toast-inner" onClose={handleClose} show={show} delay={7000} autohide>
                 <Toast.Header className="Toast-header" closeVariant="white">
                     <FaLock className="me-1"/>
                     <strong className="me-auto">{toastContent.heading}</strong>
                     <small>just now</small>
                 </Toast.Header>
                 <Toast.Body className="Toast-body rounded-3">{toastContent.body}</Toast.Body>
             </Toast>
         </ToastContainer>
    );
};

export default CustomToast;
