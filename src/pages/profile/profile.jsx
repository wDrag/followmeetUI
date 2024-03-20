import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./profile.scss";
import Posts from "../../components/posts/posts";
import { useNavigate, useParams, useLocation } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { UpdateInfoContext } from "../../context/updateInfoContext";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertContext } from "../../context/alertContext";
import cloudinary from "../../cloudinary/cloudinary";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);

  const { username } = useParams();
  const location = useLocation();

  const [profileOwner, setProfileOwner] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const { showPopout, hidePopout } = useContext(UpdateInfoContext);
  const [userPosts, setUserPosts] = useState([]);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const PFPInputRef = useRef();
  const [PFP, setPFP] = useState(null); //PFP = [File]
  const coverInputRef = useRef();
  const [cover, setCover] = useState(null); //cover = [File]
  const [isActionDone, setIsActionDone] = useState(true);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchData = async () => {
      const id = await fetchIdOfProfileOwner(username);
      try {
        const res = await axios.get(
          `${API_ENDPOINT}/api/user/getUserInfos?userId=${id}`
        );
        setProfileOwner(res.data);
      } catch (err) {
        console.log(err);
        setFetchError(true);
      }
    };

    fetchData();
  }, []);

  const fetchIdOfProfileOwner = async (username) => {
    let id = new URLSearchParams(location.search).get("id");
    if (id) return id;
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/user/getUserIdByUsername?username=${username}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchIsFollowed = async () => {
    const id = await fetchIdOfProfileOwner(username);
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/follow/isFollowed?userId=${currentUser.id}&followingId=${id}`
      );
      setIsFollowed(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIsFollowed();
  }, [profileOwner]);

  const fetchUserPosts = async () => {
    const id = await fetchIdOfProfileOwner(username);
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/post/getPostsOfUser?userId=${id}`
      );
      setUserPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [profileOwner]);

  const navigate = useNavigate();

  if (fetchError) {
    navigate("/404");
  }

  const handleFollow = async () => {
    const id = await fetchIdOfProfileOwner(username);
    if (isFollowed) {
      try {
        await axios.post(`${API_ENDPOINT}/api/follow/unfollowUser`, {
          userId: currentUser.id,
          followingId: id,
        });
      } catch (err) {
        window.location.reload();
        console.log(err);
      }
    } else {
      try {
        await axios.post(`${API_ENDPOINT}/api/follow/followUser`, {
          userId: currentUser.id,
          followingId: id,
        });
      } catch (err) {
        window.location.reload();
        console.log(err);
      }
    }
    fetchIsFollowed();
  };

  const handleUpdateInfo = () => {
    showPopout(currentUser);
  };

  const resetCover = () => {
    document.getElementById("saveImg").style.display = "none";
    setCover(null);
    coverInputRef.current.value = "";
  };

  const resetPFP = () => {
    document.getElementById("saveImg").style.display = "none";
    setPFP(null);
    PFPInputRef.current.value = "";
  };

  const showSaveImg = () => {
    document.getElementById("saveImg").style.display = "block";
  };

  const postToCloudinary = async (file) => {
    return new Promise(
      (resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinary.upload_preset);
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`
        );
        xhr.onload = () => {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);
        };
        xhr.onerror = (err) => {
          reject(err);
        };
        xhr.send(formData);
      },
      (err) => {
        const info = {
          name: "Negative",
          message: err,
          showButton: false,
        };
        showAlert(info);
        setTimeout(() => {
          hideAlert();
        }, 750);
      }
    );
  };

  const handleSaveImg = async () => {
    if (!isActionDone) return;
    setIsActionDone(false);

    if (cover === null && PFP === null) return;

    const loadingInfo = {
      name: "Loading...",
      message: "Please wait",
      showButton: false,
      noCancel: true,
    };
    showAlert(loadingInfo);

    if (cover && PFP) {
      const coverUrl = await postToCloudinary(cover);
      const PFPUrl = await postToCloudinary(PFP);
      try {
        await axios.post(`${API_ENDPOINT}/api/user/updateCover`, {
          userId: currentUser.id,
          coverPicture: coverUrl,
        });
        await axios.post(`${API_ENDPOINT}/api/user/updatePFP`, {
          userId: currentUser.id,
          PFP: PFPUrl,
        });
        hideAlert();
        const info = {
          name: "Positive",
          message: "Updated successfully",
          showButton: false,
        };
        showAlert(info);
        setTimeout(() => {
          hideAlert();
        }, 750);
        currentUser.profilePicture = PFPUrl;
        currentUser.coverPicture = coverUrl;
        setIsActionDone(true);
        window.location.reload();
      } catch (err) {
        hideAlert();
        setIsActionDone(true);
        console.log(err);
      }
      resetCover();
      resetPFP();
    }
    if (cover) {
      const coverUrl = await postToCloudinary(cover);
      try {
        await axios.post(`${API_ENDPOINT}/api/user/updateCover`, {
          userId: currentUser.id,
          coverPicture: coverUrl,
        });
        setIsActionDone(true);
        currentUser.profilePicture = PFPUrl;
        currentUser.coverPicture = coverUrl;
        hideAlert();
        window.location.reload();
      } catch (err) {
        hideAlert();
        const info = {
          name: "Positive",
          message: "Updated successfully",
          showButton: false,
        };
        showAlert(info);
        setTimeout(() => {
          hideAlert();
        }, 750);
        setIsActionDone(true);
        console.log(err);
      }
      resetCover();
    }
    if (PFP) {
      const PFPUrl = await postToCloudinary(PFP);
      try {
        await axios.post(`${API_ENDPOINT}/api/user/updatePFP`, {
          userId: currentUser.id,
          PFP: PFPUrl,
        });
        setIsActionDone(true);
        currentUser.profilePicture = PFPUrl;
        currentUser.coverPicture = coverUrl;
        hideAlert();
        const info = {
          name: "Positive",
          message: "Updated successfully",
          showButton: false,
        };
        showAlert(info);
        setTimeout(() => {
          hideAlert();
        }, 750);
        window.location.reload();
      } catch (err) {
        hideAlert();
        setIsActionDone(true);
        console.log(err);
      }
      resetPFP();
    }
  };

  return (
    <>
      {profileOwner && (
        <div className="profile">
          <>
            <div className="images">
              <img
                src={
                  cover ? URL.createObjectURL(cover) : profileOwner.coverPicture
                }
                alt=""
                className="cover"
              />
              <input
                type="file"
                id="coverInput"
                ref={coverInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  e.preventDefault();
                  setCover(e.target.files[0]);
                }}
              />
              <label htmlFor="coverInput">
                <FontAwesomeIcon className="updateCoverBtn" icon={faCamera} />
              </label>

              <img
                src={
                  PFP ? URL.createObjectURL(PFP) : profileOwner.profilePicture
                }
                alt=""
                className="profilePic"
              />

              <input
                type="file"
                id="pfpInput"
                ref={PFPInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  e.preventDefault();
                  setPFP(e.target.files[0]);
                }}
              />
              <label htmlFor="pfpInput">
                <FontAwesomeIcon icon={faCamera} className="updatePFPBtn" />
              </label>

              {cover !== null || PFP !== null ? (showSaveImg(), null) : null}
            </div>
            <div className="profileContainer">
              <div className="uInfo">
                <div className="left">
                  <span>{profileOwner.fullName}</span>
                </div>
                <div className="center">
                  <p>{profileOwner.bio}</p>
                </div>
                <div className="right">
                  {profileOwner.id === currentUser.id ? (
                    <button className="updateInfo" onClick={handleUpdateInfo}>
                      Update Info
                    </button>
                  ) : (
                    <button
                      className={isFollowed ? "unfollow__btn" : "follow__btn"}
                      onClick={handleFollow}
                    >
                      {isFollowed ? "Unfollow" : "Follow"}
                    </button>
                  )}
                  {/* <EmailOutlinedIcon /> */}
                  {/* <MoreVertIcon /> */}
                </div>
                <div className="saveImg" id="saveImg" onClick={handleSaveImg}>
                  Save
                </div>
              </div>
              <Posts posts={userPosts} infiniteScroll={false} />
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Profile;
