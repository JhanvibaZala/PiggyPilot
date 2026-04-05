import { API_PATH } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                // sets header for file upload
                "Content-Type" : "multipart/form-data",
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error uploading the file', error);
        throw error;
    }
}

export default uploadImage;