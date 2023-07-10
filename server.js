import express from "express";
import mongoose from "mongoose";
import User from "./models/users.js";
import cors from "cors";
import bcrypt from  "bcrypt";
import File from "./models/files.js";

import {Storage} from '@google-cloud/storage';

const app = express();

// const storage = new Storage();

// connect to mongodb.
const dbURI =
	"mongodb+srv://testuser:test123@esign.eprlzdc.mongodb.net/esign?retryWrites=true&w=majority";


const port = 5173;

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log("connected to db");
		app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	})
	.catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
    console.log("GET request received at /");
    // console.log(req.body);
    resp.send("App is Working");
    
});


const register = app.post("/register", async (req, resp) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("User already registered");
      resp.status(409).send("User already registered");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      console.log(req.body)
      const user = new User({
        username,
        password: hashedPassword,
      });
      let result = await user.save();
      result = result.toObject();
      if (result) {
          delete result.password;
          resp.send(req.body);
          console.log(result);
      } else {
          console.log("User already registered");
          // resp.status(409).send("User already registered");
      }

  } catch (e) {
      resp.send("Something Went Wrong");
      resp.status(500).send("Something went wrong during register");
  }
});


const login = app.post("/login", async (req, resp) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        console.log("Username not found");
        resp.status(404).send("Username not found");
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // Compare the provided password with the stored password
      if (!passwordMatch) {
        console.log("Incorrect password");
        resp.status(401).send("Incorrect password");
        return;
      }
  
      // Login successful
      console.log("Login successful");
      // You can send a response or perform additional actions here
      resp.send("Login successful");
  
    } catch (e) {
      console.error("Something went wrong during login:", e);
      resp.status(500).send("Something went wrong during login");
    }
  });

  const uploadFiles = app.post("/uploadFiles", async (req, resp) => {
    const { name, type, size, username } = req.body;
    try{
      
      const existingFile = await File.findOne({ filename: name, owner: username });
      if (existingFile) {
      // File with the same filename and owner already exists, return an error response
        return resp.status(400).json({ error: "File already exists for this user." });
      }

      const file = new File({
        filename: name,
        contentType: type,
        size: size,
        owner: username,
        path:"pathToCloud"
      });
      let result = await file.save();
      result = result.toObject();
      if (result) {
        resp.send(req.body);
        console.log(result);
    } else {
        console.log("error");
    }
    }
    catch (e){
      console.log(e)
      // resp.send("Something Went Wrong");
      resp.status(500).send("Something went wrong during upload");
    }
  })

  const getFiles = app.post('/files', async (req, resp) => {
    const {username} = req.body;
    try {
      // Retrieve all files for the user
      const files = await File.find({ owner: username }).exec();
  
      resp.json(files);
    } catch (error) {
      console.error(error);
      resp.status(500).json({ message: 'Server error' });
    }
  });






 // The path to your file to upload
// const filePath = 'C:/Users/George/Documents/γενικα/rwservlet.pdf';

  // The new ID for your GCS file
// const destFileName = 'rwservlet.pdf';
const bucketName = 'e-sign-bucket'

const storage = new Storage();
// const uploadFileToGCS = async (file, destination) => {
//   // console.log(file)
//   const options = {
//     destination,
//   };
//   try{
//     await storage.bucket(bucketName).upload(file.name, options);
//     console.log(`${filePath} uploaded to ${bucketName}`);
//   }catch (error) {
//     console.error('Error uploading file to GCS:', error);
//   }

  
// }

// uploadFileToGCS().catch(console.error);


const upload = app.post('/upload', async (req, res) => {
  // Assuming the file upload form has a field named "file"
  // const uploadedFile = req.files.file;
  const file = req.body;
  const {name} =  req.body;

  console.log(file)

  try{
    // await storage.bucket(bucketName).upload("image00001.jpeg", name);
    await storage.bucket(bucketName).upload("./image00001.jpeg", {
      destination: "/image00001.jpeg",
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: 'public, max-age=31536000',
      },
    });
    console.log(`${filePath} uploaded to ${bucketName}`);
  }catch (error) {
    console.error('Error uploading file to GCS:', error);
  }
  // Set the destination file name
  // const destFileName = 'file1.txt';

  // Call the uploadFileToGCS function with the uploaded file and destination file name
  // uploadFileToGCS(file, name)
  //   .then(() => {
  //     // File uploaded successfully
  //     res.status(200).send('File uploaded to GCS');
  //   })
  //   .catch((error) => {
  //     // Handle any errors that occurred during file upload
  //     console.error('Error uploading file to GCS:', error);
  //     res.status(500).send('Error uploading file to GCS');
  //   });
});

  