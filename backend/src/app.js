//
const multer = require('multer');
const path = require('path'); 
const fs = require('fs'); 

const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const serviceMessage = require('./services/serviceMessage');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173', 'https://fuse-phi.vercel.app', 'http://localhost:5174'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

// Automatically create the 'uploads' folder if it does not exist.
const uploadDir = path.join(__dirname, '..', 'uploads'); 

if (!fs.existsSync(uploadDir)) {
    // ⚡ Adding recursive option ensures the directory is forcibly created physically even if parent paths have issues.
    fs.mkdirSync(uploadDir, { recursive: true }); 
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Always at the top
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use('/uploads', express.static(uploadDir));

// Router endpoint called by frontend's UploadMedia function.
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    
    // Return the final image URL stored on local disk to the frontend.
    const fileUrl = `http://localhost:1000/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});



app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

serviceMessage.SocketConnection(io);

(async () => {
    try {
        server.listen(PORT, () => { console.log("Server started at port " + PORT); });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
})();