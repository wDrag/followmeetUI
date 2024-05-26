import { useContext } from "react";
import "./post.scss";
import { AuthContext } from "../../context/authContext";
import ax from "../../../axios";
import { AlertContext } from "../../context/alertContext";

export const TrashPost = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const { showAlert, hideAlert } = useContext(AlertContext);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const handleRecover = async () => {
    try {
      await ax.post(`${API_ENDPOINT}/api/post/restoreDeletedPost`, {
        postId: post.id
      });
      const info = {
        name: "Positive",
        message: "Recovered successfully",
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
        message: "Cannot recover post",
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
      message: "Are you sure you want to recover this post?",
      showButton: true,
      confirmText: "Recover",
      declineText: "Cancel",
      handleConfirm: async () => {
        await handleRecover();
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
          <button onClick={handleMore} className="recoverButton">Recover</button>
        </div>
        <div className="content">
          <p>{post.contentText}</p>
          {post.contentImg && <img src={post.contentImg} alt="" />}
        </div>
      </div>
    </div>
  );
};
