import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { Hash } from "@smithy/hash-node";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const presigner = new S3RequestPresigner({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
  sha256: Hash.bind(null, "sha256"), // In Node.js
});

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

export const s3GetImages = async (images) => {
  if (Array.isArray(images)) {
    const preSignedImagesArr = [];

    for (let i = 0; i < images.length; i++) {
      let preSignedUrl;
      preSignedUrl = await presigner.presign(
        new HttpRequest(parseUrl(images[i])),
      );
      preSignedImagesArr.push(formatUrl(preSignedUrl));
    }
    //console.log("presigned images url arr:", preSignedImagesArr);
    return preSignedImagesArr;
  } else {
    let preSignedUrl = await presigner.presign(
      new HttpRequest(parseUrl(images)),
    );
    //console.log("presigned image url: ", formatUrl(preSignedUrl));
    return formatUrl(preSignedUrl);
  }
};

export const s3RemoveImages = async (images) => {
  if (Array.isArray(images)) {
    const objToBeDeleted = [];
    for (let i = 0; i < images.length; i++) {
      objToBeDeleted.push({ Key: images[i] });
    }
    console.log(objToBeDeleted);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: {
        Objects: objToBeDeleted,
        Quiet: false,
      },
    };
    const command = new DeleteObjectsCommand(params);

    try {
      const { Deleted } = await s3.send(command);
      console.log(
        `Successfully deleted ${Deleted.length} objects from bucket ${process.env.AWS_S3_BUCKET}. Deleted objects:`,
      );
      console.log(Deleted.map((d) => ` • ${d.Key}`).join("\n"));
    } catch (err) {
      console.error(err);
    }
  } else {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: images,
    };
    const command = new DeleteObjectCommand(params);

    try {
      const response = await s3.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
};

// Create a GET request from S3 url.
