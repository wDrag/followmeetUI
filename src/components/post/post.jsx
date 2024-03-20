import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import Comments from "../comments/comments";
import { useContext, useEffect, useState } from "react";
import "./post.scss";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { getTime } from "../../utils/getTime";
import { AlertContext } from "../../context/alertContext";

export const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const [commentOpen, setCommentOpen] = useState(false);
  const [numComments, setNumComments] = useState(0);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const [reacted, setReacted] = useState(false);
  const [reacts, setReacts] = useState(0);

  const fetchNumComments = async () => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/comment/getNumComments?postId=${post.id}`
      );
      setNumComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onAddComment = async (numComments) => {
    setNumComments(numComments);
  };

  const fetchReacted = async () => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/react/isReacted?userId=${currentUser.id}&postId=${post.id}`
      );
      setReacted(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReacts = async () => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/react/getReacts?postId=${post.id}`
      );
      setReacts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReact = async () => {
    try {
      if (reacted) {
        await axios.post(`${API_ENDPOINT}/api/react/unreactPost`, {
          postId: post.id,
          userId: currentUser.id,
        });
      } else {
        await axios.post(`${API_ENDPOINT}/api/react/reactPost`, {
          postId: post.id,
          userId: currentUser.id,
        });
      }
      fetchReacted();
      fetchReacts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReacted();
    fetchReacts();
    fetchNumComments();
  }, []);

  const navigate = useNavigate();

  const [postOwner, setPostOwner] = useState({
    fullName: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchPostOwner = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINT}/api/user/getUserInfos?userId=${post.ownerId}`
        );
        setPostOwner(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPostOwner();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchReacts();
      await fetchNumComments();
    };

    fetchDetails();

    // Then fetch comments every 5 seconds
    const intervalId = setInterval(fetchDetails, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async () => {
    try {
      await axios.post(`${API_ENDPOINT}/api/post/deletePost`, {
        postId: post.id,
        userId: currentUser.id,
      });
      const info = {
        name: "Positive",
        message: "Post deleted successfully",
        showButton: false,
        noCancel: true,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
        window.location.reload();
      }, 1500);
    } catch (err) {
      const info = {
        name: "Negative",
        message: "You are not allowed to delete this post",
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
      }, 1500);
      console.log(err);
    }
  };

  const handleMore = () => {
    const info = {
      name: "Warning",
      message: "Are you sure you want to delete this post?",
      showButton: true,
      confirmText: "Delete",
      declineText: "Cancel",
      handleConfirm: async () => {
        await handleDelete();
        // window.location.reload();
      },
      handleDecline: () => {
        hideAlert();
      },
    };
    showAlert(info);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={postOwner.profilePicture}
              alt=""
              onClick={() => {
                navigate(`/profile/${postOwner.username}`);
                window.scrollTo(0, 0);
              }}
              style={{ cursor: "pointer" }}
            />
            <div className="details">
              <div
                onClick={() => {
                  navigate(`/profile/${postOwner.username}`);
                  window.scrollTo(0, 0);
                }}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <span className="name">{postOwner.fullName}</span>
              </div>
              <span className="date">
                {getTime(post.createdAt) === "Just now"
                  ? "Just now"
                  : getTime(post.createdAt) + " ago"}
              </span>
            </div>
          </div>
          <MoreHorizIcon onClick={handleMore} style={{ cursor: "pointer" }} />
        </div>
        <div className="content">
          <p>{post.contentText}</p>
          {post.contentImg && <img src={post.contentImg} alt="" />}
        </div>
        <div className="info">
          <div className="item heart" onClick={handleReact}>
            {reacted ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            <span>
              {reacts >= 1000 ? Math.floor(reacts / 1000) + "K" : reacts} Likes
            </span>
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            <span>{numComments}</span>
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && (
          <Comments postId={post.id} onAddComment={onAddComment} />
        )}
      </div>
    </div>
  );
};
