const ImageKit = require('imagekit');

let imagekitInstance = null;

const getImageKit = () => {
  if (!imagekitInstance) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      return null;
    }

    imagekitInstance = new ImageKit({
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    });
  }

  return imagekitInstance;
};

const isImageKitConfigured = () => {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  );
};

module.exports = {
  getImageKit,
  isImageKitConfigured,
};
