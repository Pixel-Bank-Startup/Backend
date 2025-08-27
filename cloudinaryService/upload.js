const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinaryConnection/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        const isPdf = file.mimetype === "application/pdf";
        //for file type image or video or pdf , everythings is acceptable
        const fileExt = file.originalname.split(".").pop();
        const baseName = file.originalname
            .replace(/\.[^/.]+$/, "") 
            .replace(/\s+/g, "_")     
            .replace(/\W+/g, "");     

        const publicId = `${Date.now()}_${baseName}.${fileExt}`;

        const params = {
            folder: "uploads",
            public_id: publicId,
            resource_type: isPdf ? "raw" : (isVideo ? "video" : "image"),
        };
        if (!isPdf) {
            params.format = fileExt;
        }

        return params;
    },
});

const upload = multer({ storage });

module.exports = upload;