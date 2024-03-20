import { useContext } from "react";
import cloudinary from "../cloudinary/cloudinary";
import { AlertContext } from "../context/alertContext";

export const postToCloudinary = async () => {
  const { showAlert, hideAlert } = useContext(AlertContext);

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
