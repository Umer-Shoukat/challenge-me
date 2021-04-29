const fs = require("fs");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

const s3SingleUpload = (file, path) => {
  const s3 = new AWS.S3({
    params: { Bucket: process.env.AWS_S3_DEFAULT_BUCKET },
  });

  return new Promise((resolve, reject) => {
    fs.readFile(file.path, async (err, fileData) => {
      if (err) reject(err);

      // adding the file extension
      const ext = file.originalFilename.split(".");
      const fullPath = `${path}.${ext[ext.length - 1]}`;

      s3.putObject(
        {
          Key: fullPath,
          Body: fileData,
          ACL: "public-read",
        },
        (err, res) => {
          if (err) {
            reject(err);
          }
          let link = `https://dev-challenge-me.s3.ap-south-1.amazonaws.com/${fullPath}`;
          resolve(link);
        }
      );
    });
  });
};

module.exports = s3SingleUpload;
