import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const uploadS3ActivityImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (request, file, cb) => {
      let fullPath = `activityPictures/${uuidv4()}-${Date.now().toString()}-${
        file.originalname
      }`;
      cb(null, fullPath);
    },
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .jpg .jpeg .png. svg images are supported!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("images", 5);

export const uploadS3ProfileImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (request, file, cb) => {
      let fullPath = `profilePicture${uuidv4()}-${Date.now().toString()}-${
        file.originalname
      }`;
      cb(null, fullPath);
    },
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .jpg .jpeg .png. svg images are supported!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).single("file");
