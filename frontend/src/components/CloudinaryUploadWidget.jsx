import React, { useEffect, useRef } from "react";
import { Button } from "@mui/material";

const CloudinaryUploadWidget = ({ upload_preset, cloud_name, handleUpload }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();



    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
                cloudName: cloud_name,
                uploadPreset: upload_preset
            },
            function (error, result) {
                if (!error && result.event === "success") { // ✅ Corrected check
                    console.log("Uploaded Successfully: ", result.info);
                    handleUpload(result)
                } else if (error) {
                    console.error("Upload Error: ", error); // ✅ More detailed error logging
                }
            }
        );
    }, []); // ✅ Dependency array added to prevent re-initialization

    return (
        <Button className="mt-4"  color="primary" onClick={() => widgetRef.current.open()} variant="outlined">
            Upload File
        </Button>
    );
};

export default CloudinaryUploadWidget;
