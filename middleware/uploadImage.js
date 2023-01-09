const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dn9mifnsi",
  api_key: "266232138793352",
  api_secret: "4apR0zzXvHGuFCTE-00FpLih7XA",
});

let streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

module.exports = streamUpload;
