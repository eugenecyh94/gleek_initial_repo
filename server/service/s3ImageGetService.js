import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { Hash } from "@smithy/hash-node";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { S3Client } from "@aws-sdk/client-s3";

const presigner = new S3RequestPresigner({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
  sha256: Hash.bind(null, "sha256"), // In Node.js
});

export const s3ImageGetService = async (images) => {
  if (Array.isArray(images)) {
    const preSignedImagesArr = [];

    for (let i = 0; i < images.length; i++) {
      let preSignedUrl;
      preSignedUrl = await presigner.presign(
        new HttpRequest(parseUrl(images[i])),
      );
      preSignedImagesArr.push(formatUrl(preSignedUrl));
    }
    console.log("presigned images url arr:", preSignedImagesArr);
    return preSignedImagesArr;
  } else {
    let preSignedUrl = await presigner.presign(
      new HttpRequest(parseUrl(images)),
    );
    console.log("presigned image url: ", formatUrl(preSignedUrl));
    return formatUrl(preSignedUrl);
  }
};

// Create a GET request from S3 url.
