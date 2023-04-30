//required modules
const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
//get firebase app;
const admin = require('firebase-admin');
const serviceAccount = require('./firebase/digitallibrary-ad854-firebase-adminsdk-hd9cn-b59f1f5e91.json');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'digitallibrary-ad854',
  keyFilename: './firebase/digitallibrary-ad854-firebase-adminsdk-hd9cn-b59f1f5e91.json'
});
const path = require('path');
const fs = require("fs");
const mongoose = require("mongoose");
const imageModel = require('./models/imageModel');
const miniUserModel = require('./models/miniUsersModel');
//connect to mongoDB
const connect = require("./db");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://digitallibrary-ad854.appspot.com/'
});
const bucket = admin.storage().bucket();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 *10 // 10 MB file size limit
  },
  fileFilter: function (req, file, cb) {
    // here i can get pdf or images
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/pdf') ) {
      cb(null, true);
    } else {
      cb(new Error('Only images or pdfs are allowed.'));
    }
  },
  storage: multer.memoryStorage() // store file in memory as buffer
});



app.get("/upload", (req, res) => {
  res.render('upload');
});
app.get("/miniuser", (req, res) => {
  res.render('miniUser');
})

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;
  console.log(file);
  console.log(fileName);

  if (!req.file) {
    return res.status(400).send('No image file found.');
  }

  // something is stoping below
  //const bucket = storage.bucket('gs://digitallibrary-ad854.appspot.com/');
  const folderPath = `images/`;
  const fileUpload = bucket.file(`${folderPath}`);
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    }
  })


  /// something is stoping here above
  stream.on('error', (error) => {
    console.error(error);
    res.status(500).send('Unable to upload image.');
  });
  stream.on('finish', async () => {
    const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    // Save the file URL to your database
    // ...
    console.log("Image url is : " + url);
    res.send('File uploaded successfully!');
  });
  
})

app.post('/miniuser', (req, res) => {

})





// setup server
const port = 5000;
app.listen(port, () => {
  console.log("App is lisetening at 5000");
})