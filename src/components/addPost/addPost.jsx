import "./addPost.scss";
import Image from "../../img/img.png";
import Map from "../../img/map.png";
import Friend from "../../img/friend.png";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import cloudinary from "../../cloudinary/cloudinary";
import { AlertContext } from "../../context/alertContext";

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const imgInputRef = useRef();
  const textInputRef = useRef();
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const [isActionDone, setIsActionDone] = useState(true);

  const handleCancelImage = () => {
    setFile(null);
    imgInputRef.current.value = "";
  };

  const resetAddPost = () => {
    setFile(null);
    imgInputRef.current.value = "";
    setText("");
    textInputRef.current.value = "";
    setIsActionDone(true);
  };

  const postToCloudinary = async () => {
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

  const handleAddPost = async () => {
    if (!isActionDone) return;
    setIsActionDone(false);
    try {
      const newPost = {
        userId: currentUser.id,
        contentText: text,
        contentImg: "",
      };
      const loadingInfo = {
        name: "Loading...",
        message: "Please wait",
        showButton: false,
        noCancel: true,
      };
      showAlert(loadingInfo);
      if (file) {
        const imageUrl = await postToCloudinary();
        newPost.contentImg = imageUrl;
      }
      if (newPost.contentText === "" && newPost.contentImg === "") {
        throw new Error("Post cannot be empty");
      }
      await axios.post(API_ENDPOINT + "/api/post/addPost", newPost);
      hideAlert();
      const info = {
        name: "Positive",
        message: "Posted successfully",
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
      }, 750);
      resetAddPost();
    } catch (err) {
      hideAlert();
      setIsActionDone(true);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleAddPost();
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img className="pfpImg" src={currentUser.profilePicture} alt="" />
            <input
              type="text"
              ref={textInputRef}
              onChange={(e) => {
                e.preventDefault();
                setText(e.target.value);
              }}
              placeholder={`What's on your mind, ${currentUser.fullName}?`}
              onKeyDown={handleEnter}
            />
          </div>
          <div className="right">
            {file && (
              <>
                <img className="file" src={URL.createObjectURL(file)} />
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ cursor: "pointer" }}
                  onClick={handleCancelImage}
                />
              </>
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              ref={imgInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                e.preventDefault();
                setFile(e.target.files[0]);
              }}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleAddPost}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
