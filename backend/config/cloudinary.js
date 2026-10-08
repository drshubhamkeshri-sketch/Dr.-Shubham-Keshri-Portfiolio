const cloudinary = require('cloudinary').v2;

const isConfigured = Boolean(
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
  process.env.CLOUDINARY_URL
);

if (isConfigured) {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
  console.log(`✅ Cloudinary SDK configured (Cloud: ${process.env.CLOUDINARY_CLOUD_NAME || 'via CLOUDINARY_URL'})`);
} else {
  console.warn('⚠️ Cloudinary credentials missing in environment variables.');
}

/**
 * Upload a file buffer or filepath to Cloudinary
 * @param {Buffer|string} fileSource - Memory buffer or absolute local path
 * @param {Object} options - Upload options
 */
const uploadToCloudinary = (fileSource, options = {}) => {
  const defaultOptions = {
    folder: 'shubham_keshri_portfolio',
    resource_type: 'auto',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...options
  };

  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(fileSource)) {
      const uploadStream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      uploadStream.end(fileSource);
    } else {
      cloudinary.uploader.upload(fileSource, defaultOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    }
  });
};

const getCloudinaryStatus = () => ({
  configured: isConfigured,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || (isConfigured ? 'configured_via_url' : 'not_configured')
});

module.exports = { cloudinary, uploadToCloudinary, getCloudinaryStatus };
