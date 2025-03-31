import multer from 'multer';

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');  // Temporary storage location
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


// Initialize upload
export const upload = multer( { storage } )

// // Initialize upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // Limit file size to 1MB
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     }
// }).single('myFile'); // 'myFile' is the name of the form field

// // Check file type
// function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// }
