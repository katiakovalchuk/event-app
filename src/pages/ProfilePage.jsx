import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../lib/init-firebase.js";
import { Container, Row, Col } from "react-bootstrap";
import { getDocs, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/authContext";
import styles from "../styles/Profile.module.scss";

const ProfilePage = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const { user } = useUserAuth();

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("submit", user.uid);

    let docRef = doc(db, "users", user.uid);
    updateDoc(docRef, {
      title: "updated title name for test",
    }).then(() => {});
  };

  return (
    <section id="profile" className="pt-4">
      <Container>
        <Row>
          <Col md={8}>
            <form onSubmit={handleAdd}>
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <div className="mb-4 input-group w-75">
                <span className="input-group-text ms-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input type="text" id="name" className="form-control" placeholder="e.g. Max" />
              </div>

              <label htmlFor="email" className="form-label">
                Email address:
              </label>
              <div className="input-group mb-4 w-75">
                <span className="input-group-text ms-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                  </svg>
                </span>
                <input type="text" id="email" className="form-control" placeholder="e.g. user@example.com" />
              </div>

              <label htmlFor="number" className="form-label">
                Phone number:
              </label>
              <div className="input-group mb-4 w-75">
                <span className="input-group-text ms-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                </span>
                <input type="text" id="number" className="form-control" placeholder="e.g. 099 123 44 55" />
              </div>

              <label htmlFor="firm" className="form-label">
                Company:
              </label>
              <div className="input-group mb-4 w-75">
                <span className="input-group-text ms-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
                    />
                    <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                  </svg>
                </span>
                <input type="text" id="firm" className="form-control" placeholder="e.g. Apple" />
              </div>

              <label htmlFor="birth" className="form-label">
                Date of birth:
              </label>
              <div className="input-group mb-4 w-75">
                <span className="input-group-text ms-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                  </svg>
                </span>
                <input type="date" id="birth" className="form-control" placeholder="e.g. Apple" />
              </div>

              <div className="mb-4 text-center">
                <button disabled={per !== null && per < 100} type="submit" className="btn btn-secondary">
                  Save
                </button>
              </div>
            </form>
          </Col>
          <Col md={4} className="">
            <div className="card text-center align-items-center shadow rounded">
              <img src={require("../assets/images/profile/profile-3.jpg")} className="card-img-top" alt="profile" />
              <img className={styles.profileImg} src={file ? URL.createObjectURL(file) : require("../assets/images/profile/profile-1.png")} alt="profile" />
              <div className="card-body ">
                <h5 className="card-title">admin</h5>
                <p>Rank: 3</p>
                <p>Scores: 14</p>
                <Link to="/recovery" className="btn btn-warning">
                  Change password
                </Link>
              </div>
            </div>
            <div className="card shadow rounded mt-3">
              <h5 className="card-title m-2 p-2 mb-0">Select profile photo</h5>
              <div className="d-flex flex-row m-2 p-2">
                <div className="p-1">
                  <label htmlFor="file">
                    <img className="icon" src={require("../assets/images/profile/folder-upload.png")} alt="upload" height={64} />
                  </label>
                  <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
                </div>
                <div className="p-1 pt-0">
                  <p className="mb-1 ps-2">Choose Image</p>
                  <p className="text-muted mb-1 ms-2">JPG, GIF or PNG. MAX size of 800K</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProfilePage;
