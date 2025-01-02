import multer from 'multer';
import path from 'path';

// Set the storage engine to DiskStorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder to store uploaded files
        cb(null, '../uploads/');
    },
    filename: (req, file, cb) => {
        // Define the filename for uploaded files
        const fileExt = path.extname(file.originalname); // Get the file extension
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExt;
        cb(null, filename);  // Save file with a unique name
    }
});

// Configure the file upload options
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (optional, here 10MB)
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];  // Allow specific file types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);  // Accept file
        } else {
            cb(new Error('File type not supported'), false);  // Reject file
        }
    }
});

export default upload;
