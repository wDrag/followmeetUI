import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./comments.scss";
import { useNavigate } from "react-router";
import axios from "axios";
import { getTime } from "../../utils/getTime";
import { AlertContext } from "../../context/alertContext";

const Comments = ({ postId, onAddComment }) => {
  const { currentUser } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const userId = currentUser.id;

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/comment/getComments?postId=${postId}`
      );
      const commentsWithOwnerInfo = await Promise.all(
        res.data.map(async (comment) => {
          const commentOwnerInfos = await fetchCommentOwnerInfos(
            comment.ownerId
          );
          return { ...comment, commentOwnerInfos };
        })
      );
      setComments(commentsWithOwnerInfo);
      onAddComment(commentsWithOwnerInfo.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommentOwnerInfos = async (userId) => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/user/getUserInfos?userId=${userId}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchComments, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSendComment = async () => {
    try {
      const contentText = document.querySelector(".write input").value;
      if (contentText == "") return;
      await axios.post(`${API_ENDPOINT}/api/comment/addComment`, {
        userId,
        postId,
        contentText,
      });
      document.querySelector(".write input").value = "";
      await fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSendComment();
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.post(`${API_ENDPOINT}/api/comment/deleteComment`, {
        commentId: commentId,
        userId: currentUser.id,
      });
      const info = {
        name: "Positive",
        message: "Comment deleted successfully",
        showButton: false,
        noCancel: true,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
      }, 2000);
      await fetchComments();
    } catch (err) {
      const info = {
        name: "Negative",
        message: "You are not allowed to delete this comment",
        showButton: false,
      };
      showAlert(info);
      setTimeout(() => {
        hideAlert();
      }, 1500);
      console.log(err);
    }
  };

  const handleMore = (commentId) => {
    const info = {
      name: "Warning",
      message: "Are you sure you want to delete this comment?",
      showButton: true,
      confirmText: "Delete",
      declineText: "Cancel",
      handleConfirm: async () => {
        await handleDelete(commentId);
      },
      handleDecline: () => {
        hideAlert();
      },
    };
    showAlert(info);
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          onKeyDown={handleEnter}
        />
        <button onClick={handleSendComment}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img
            src={comment.commentOwnerInfos.profilePicture}
            alt=""
            onClick={() => {
              navigate(`/profile/${comment.commentOwnerInfos.username}`);
              window.scrollTo(0, 0);
            }}
            style={{ cursor: "pointer" }}
          />
          <div className="comment__info">
            <span
              onClick={() => {
                navigate(`/profile/${comment.commentOwnerInfos.username}`);
                window.scrollTo(0, 0);
              }}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {" "}
              {comment.commentOwnerInfos.fullName}
            </span>
            <p>{comment.contentText}</p>
          </div>
          <span className="comment__date">
            {getTime(comment.createdAt) === "Just now"
              ? "Just now"
              : getTime(comment.createdAt) + " ago"}
          </span>
          <MoreHorizIcon
            onClick={() => handleMore(comment.id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ))}
    </div>
  );
};

export default Comments;
