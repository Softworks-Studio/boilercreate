export const expressFileupload = `
import fileUpload from 'express-fileupload';
import path from 'path';

export function applyFileUpload(app) {
  app.use(fileUpload({
    createParentPath: true,
    limits: { 
      fileSize: 5 * 1024 * 1024 // 5 MB max file(s) size
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    useTempFiles: true,
    tempFileDir: '/tmp/',
    debug: process.env.NODE_ENV !== 'production'
  }));

  // Middleware to handle file upload
  app.use((req, res, next) => {
    if (!req.files) return next();

    const uploadPath = path.join(__dirname, '..', '..', 'uploads');

    // Handle single file upload
    if (req.files.file) {
      const file = req.files.file;
      const fileName = file.name;
      const savePath = path.join(uploadPath, fileName);

      file.mv(savePath, (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(500).send(err);
        }
        req.uploadedFile = { fileName, path: savePath };
        next();
      });
    } 
    // Handle multiple file upload
    else if (Array.isArray(req.files.files)) {
      const uploadedFiles = [];
      const movePromises = req.files.files.map(file => {
        return new Promise((resolve, reject) => {
          const fileName = file.name;
          const savePath = path.join(uploadPath, fileName);
          file.mv(savePath, (err) => {
            if (err) reject(err);
            else {
              uploadedFiles.push({ fileName, path: savePath });
              resolve();
            }
          });
        });
      });

      Promise.all(movePromises)
        .then(() => {
          req.uploadedFiles = uploadedFiles;
          next();
        })
        .catch(err => {
          console.error('File upload error:', err);
          res.status(500).send(err);
        });
    } 
    else {
      next();
    }
  });
}
`;
