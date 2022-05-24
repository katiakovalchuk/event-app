import { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";
import { auth, db, storage } from "../../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);

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
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  return (
    <section id="profile" className="pt-4">
      <Container>
        <Row>
          <Col md={8}>
            <p>Rank: 3</p>
            <p>Scores: 14</p>
            <Link to="/recovery">Change password</Link>
          </Col>
          <Col md={4} className="">
            <div className="card text-center align-items-center shadow rounded">
              <img src={require("../../../assets/images/profile-3.jpg")} className="card-img-top" alt="profile" />
              <img className={styles.profileImg} src={file ? URL.createObjectURL(file) : require("../../../assets/images/profile-1.png")} alt="profile" />
              <div className="card-body ">
                <h5 className="card-title">admin</h5>
                <p>user@gmail.com</p>
                <a href="mailto:someone@yoursite.com" className="btn btn-warning">
                  Send Message
                </a>
              </div>
            </div>
            <div className="card shadow rounded mt-3">
              <h5 className="card-title m-2 p-2 mb-0">Select profile photo</h5>
              <div className="d-flex flex-row m-2 p-2">
                <div className="p-1">
                  <label htmlFor="file">
                    <img className="icon" src={require("../../../assets/images/folder-upload.png")} alt="upload" height={64} />
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
