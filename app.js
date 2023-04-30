//required modules
require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
//get firebase app;
//----------NEW LINES -------------
const { initializeApp } =  require("firebase/app");
const { getStorage, ref,uploadBytes,getDownloadURL  } =  require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId ,
  storageBucket: process.env.storageBucket ,
  messagingSenderId: process.env.messagingSenderId ,
  appId: process.env.appId ,
  measurementId: process.env.measurementId 
};
//---------------------------------------OLD LINES--------------------------------------------------------
// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase/digitallibrary-ad854-firebase-adminsdk-hd9cn-b59f1f5e91.json');
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage({
//   projectId: 'digitallibrary-ad854',
//   keyFilename: './firebase/digitallibrary-ad854-firebase-adminsdk-hd9cn-b59f1f5e91.json'
// });
//--------------------------------------------------------------------------------------------------------
// const path = require('path');
// const fs = require("fs");
// const mongoose = require("mongoose");
const imageModel = require('./models/imageModel');
const miniUserModel = require('./models/miniUsersModel');
//connect to mongoDB
const connect = require("./db");

//---------------------OLD LINES --------------------------------
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://digitallibrary-ad854.appspot.com/'
// });
// const bucket = admin.storage().bucket();
//-------------------OLD Lines ---------------------------------
const fireBaseApp = initializeApp(firebaseConfig); // initialise firebase app
const storage = getStorage(fireBaseApp); 
// Points to the root reference
const storageRef = ref(storage);
// Points to 'images'
const imagesRef = ref(storageRef, 'images/');// points to images folder inside bucket
const documentsRef = ref(storageRef, 'documents/');// points to documents folder inside bucket



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
  console.log(file.buffer);
  console.log(fileName);

  if (!req.file) {
    return res.status(400).send('No image/pdf files found.');
  }
  
  //------------------------ OLD CODE ---------------------------
  // something is stoping below
  //const bucket = storage.bucket('gs://digitallibrary-ad854.appspot.com/');
  // const folderPath = `images/`;
  // const fileUpload = bucket.file(`${folderPath}`);
  // const stream = fileUpload.createWriteStream({
  //   metadata: {
  //     contentType: file.mimetype,
  //   }
  // })
 //-----------------------OLD CODE ----------------------------
 let uploadTask;
 const  metadata = {contentType: file.mimetype};
 const now = new Date();
 const dateStamp = now.toISOString();
 if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
  const imagesFolderRef = ref(imagesRef, `${dateStamp}${file.originalname}`);
   uploadTask = uploadBytes(imagesFolderRef, file.buffer, metadata);
 }
 else if(file.mimetype === 'application/pdf'){
   const documentsFolderRef = ref(documentsRef, `${dateStamp}${file.originalname}`);// points to documents folder inside bucket
   uploadTask = uploadBytes(documentsFolderRef, file.buffer, metadata);
 }
 

 //Handle errors during upload
// uploadTask.on('error', (error) => {
//   // Handle error
//   console.log(error);
//   res.send("There is some error iploading files");
// });

 // Get download URL after upload completes successfully
uploadTask.then((snapshot) => {
  getDownloadURL(snapshot.ref).then((downloadURL) => {
    console.log('File available at', downloadURL);
  });
});
res.send("File reached successfully to server");

  ///----------------------OLD CODE ---------------------
  // stream.on('error', (error) => {
  //   console.error(error);
  //   res.status(500).send('Unable to upload image.');
  // });
  // stream.on('finish', async () => {
  //   const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
  //   // Save the file URL to your database
  //   // ...
  //   console.log("Image url is : " + url);
  //   res.send('File uploaded successfully!');
  // });
  
})

app.post('/miniuser', (req, res) => {

})





// setup server
const port = 5000;
app.listen(port, () => {
  console.log("App is lisetening at 5000");
})