import express from "express";
import mongoose from "mongoose";
import User from "./models/users.js";
import cors from "cors";
import bcrypt from  "bcrypt";
import File from "./models/files.js";

import {Storage} from '@google-cloud/storage';
import multer from 'multer';

const app = express();


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

  // UPLOAD TO MONGODB.
  const uploadFiles = app.post("/uploadFiles", async (req, resp) => {
    const { name, type, size, username,publicUrl,signed } = req.body;
    try{
      
      const existingFile = await File.findOne({ filename: name, owner: username });
      if (existingFile && existingFile.signed === signed) {
      // File with the same filename and owner already exists, return an error response
        return resp.status(400).json({ error: "File already exists for this user." });
      }

      const file = new File({
        filename: name,
        contentType: type,
        size: size,
        owner: username,
        path: publicUrl,
        signed: signed
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
      resp.status(500).send("Something went wrong during upload");
    }
  })

  // UPLOAD TO GSS.
  const bucketName = 'e-sign-bucket'
  const storage = new Storage();
  const uploadf = multer();

  const upload = app.post('/upload', uploadf.single('file'), async (req, res) => {

    const uploadedFile = req.file;
    const username = req.body.username;
    console.log(uploadedFile);

    try {
      await storage.bucket(bucketName).file(`${username}_${uploadedFile.originalname}`).save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
        gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      console.log(`${uploadedFile.originalname} uploaded to ${bucketName}`);

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${username}_${uploadedFile.originalname}`;
      console.log(publicUrl);
      res.status(200).send(publicUrl);
    }catch (error) {
      console.error('Error uploading file to GCS:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

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

  // DELETE FILES.
  const deleteFiles = app.post('/delete', async (req, resp) => {
    const {fileid, filename} = req.body;
    try {
      // Retrieve all files for the user
      const files = await File.deleteOne({ _id: fileid }).exec();
   
      await deleteFileFromGCS(filename);
      resp.json(files);
    } catch (error) {
      console.error(error);
      resp.status(500).json({ message: 'Server error' });
    }
  });


const deleteFileFromGCS = async (filename) => {
  try {
    await storage.bucket(bucketName).file(filename).delete();
    console.log(`File ${filename} deleted from GCS.`);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
  }
};

//FETCH FILE FROM GCS.

const fetchGcs = app.post('/fetchGcs', async (req, resp) => {
  const { filename} = req.body;
  try {

    // Retrieve all files for the user
   const response = await fetchFileFromGCS(filename);
    resp.send(response);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Server error' });
  }
});


const fetchFileFromGCS = async (filename) => {
  try {

    const file = storage.bucket(bucketName).file(filename);

    const [fileContent] = await file.download();

    // 'fileContent' is a Buffer containing the content of the file
    return fileContent;
  } catch (error) {
    console.error('Error fetching file from GCS:', error);
    throw error;
  }
};

import axios from "axios";

const getData = app.post('/getData', async (req, resp) => {
  const {username,filename} = req.body;

  const file = `${username}_${filename}`
  const respo = await fetchFileFromGCS(file);
  const b64 = respo.toString('base64');
  console.log(b64);
  
  const payload = {
    parameters: {
      signingCertificate: {
        encodedCertificate:
          "MIIC6jCCAdKgAwIBAgIGLtYU17tXMA0GCSqGSIb3DQEBCwUAMDAxGzAZBgNVBAMMElJvb3RTZWxmU2lnbmVkRmFrZTERMA8GA1UECgwIRFNTLXRlc3QwHhcNMTcwNjA4MTEyNjAxWhcNNDcwNzA0MDc1NzI0WjAoMRMwEQYDVQQDDApTaWduZXJGYWtlMREwDwYDVQQKDAhEU1MtdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMI3kZhtnipn+iiZHZ9ax8FlfE5Ow/cFwBTfAEb3R1ZQUp6/BQnBt7Oo0JWBtc9qkv7JUDdcBJXPV5QWS5AyMPHpqQ75Hitjsq/Fzu8eHtkKpFizcxGa9BZdkQjh4rSrtO1Kjs0Rd5DQtWSgkeVCCN09kN0ZsZ0ENY+Ip8QxSmyztsStkYXdULqpwz4JEXW9vz64eTbde4vQJ6pjHGarJf1gQNEc2XzhmI/prXLysWNqC7lZg7PUZUTrdegABTUzYCRJ1kWBRPm4qo0LN405c94QQd45a5kTgowHzEgLnAQI28x0M3A59TKC+ieNc6VF1PsTLpUw7PNI2VstX5jAuasCAwEAAaMSMBAwDgYDVR0PAQH/BAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IBAQCK6LGA01TR+rmU8p6yhAi4OkDN2b1dbIL8l8iCMYopLCxx8xqq3ubZCOxqh1X2j6pgWzarb0b/MUix00IoUvNbFOxAW7PBZIKDLnm6LsckRxs1U32sC9d1LOHe3WKBNB6GZALT1ewjh7hSbWjftlmcovq+6eVGA5cvf2u/2+TkKkyHV/NR394nXrdsdpvygwypEtXjetzD7UT93Nuw3xcV8VIftIvHf9LjU7h+UjGmKXG9c15eYr3SzUmv6kyOI0Bvw14PWtsWGl0QdOSRvIBBrP4adCnGTgjgjk9LTcO8B8FKrr+8lHGuc0bp4lIUToiUkGILXsiEeEg9WAqm+XqO",
      },
      certificateChain: [],
      detachedContents: null,
      asicContainerType: null,
      signatureLevel: "XAdES_BASELINE_B",
      signaturePackaging: "ENVELOPING",
      embedXML: false,
      manifestSignature: false,
      jwsSerializationType: null,
      sigDMechanism: null,
      signatureAlgorithm: "RSA_SHA256",
      digestAlgorithm: "SHA256",
      encryptionAlgorithm: "RSA",
      referenceDigestAlgorithm: null,
      maskGenerationFunction: null,
      contentTimestamps: null,
      contentTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      signatureTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      archiveTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      signWithExpiredCertificate: false,
      generateTBSWithoutCertificate: false,
      imageParameters: null,
      signatureIdToCounterSign: null,
      blevelParams: {
        trustAnchorBPPolicy: true,
        signingDate: 1675669784752,
        claimedSignerRoles: null,
        policyId: null,
        policyQualifier: null,
        policyDescription: null,
        policyDigestAlgorithm: null,
        policyDigestValue: null,
        policySpuri: null,
        commitmentTypeIndications: null,
        signerLocationPostalAddress: [],
        signerLocationPostalCode: null,
        signerLocationLocality: null,
        signerLocationStateOrProvince: null,
        signerLocationCountry: null,
        signerLocationStreet: null,
      },
    },
    toSignDocument: {
      bytes: b64,
      digestAlgorithm: null,
      name: filename,
    },
  };

      const url =
			"http://localhost:8081/services/rest/signature/one-document/getDataToSign";


  try {
    const response = await axios.post(url, payload, {
      headers: {
        Accept: "application/json, application/javascript, text/javascript, text/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
      
    });

    console.log(response.data); // Handle the response data here
    resp.send(response.data);
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ message: 'Server error' });
  }
});

const signData = app.post('/signData', async (req, resp) => {
  const {base64Signature,username,filename} = req.body;

  const file = `${username}_${filename}`
  const respo = await fetchFileFromGCS(file);
  const b64 = respo.toString('base64');

  const payloadToSign = {
    parameters: {
      signingCertificate: {
        encodedCertificate:
          "MIIC6jCCAdKgAwIBAgIGLtYU17tXMA0GCSqGSIb3DQEBCwUAMDAxGzAZBgNVBAMMElJvb3RTZWxmU2lnbmVkRmFrZTERMA8GA1UECgwIRFNTLXRlc3QwHhcNMTcwNjA4MTEyNjAxWhcNNDcwNzA0MDc1NzI0WjAoMRMwEQYDVQQDDApTaWduZXJGYWtlMREwDwYDVQQKDAhEU1MtdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMI3kZhtnipn+iiZHZ9ax8FlfE5Ow/cFwBTfAEb3R1ZQUp6/BQnBt7Oo0JWBtc9qkv7JUDdcBJXPV5QWS5AyMPHpqQ75Hitjsq/Fzu8eHtkKpFizcxGa9BZdkQjh4rSrtO1Kjs0Rd5DQtWSgkeVCCN09kN0ZsZ0ENY+Ip8QxSmyztsStkYXdULqpwz4JEXW9vz64eTbde4vQJ6pjHGarJf1gQNEc2XzhmI/prXLysWNqC7lZg7PUZUTrdegABTUzYCRJ1kWBRPm4qo0LN405c94QQd45a5kTgowHzEgLnAQI28x0M3A59TKC+ieNc6VF1PsTLpUw7PNI2VstX5jAuasCAwEAAaMSMBAwDgYDVR0PAQH/BAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IBAQCK6LGA01TR+rmU8p6yhAi4OkDN2b1dbIL8l8iCMYopLCxx8xqq3ubZCOxqh1X2j6pgWzarb0b/MUix00IoUvNbFOxAW7PBZIKDLnm6LsckRxs1U32sC9d1LOHe3WKBNB6GZALT1ewjh7hSbWjftlmcovq+6eVGA5cvf2u/2+TkKkyHV/NR394nXrdsdpvygwypEtXjetzD7UT93Nuw3xcV8VIftIvHf9LjU7h+UjGmKXG9c15eYr3SzUmv6kyOI0Bvw14PWtsWGl0QdOSRvIBBrP4adCnGTgjgjk9LTcO8B8FKrr+8lHGuc0bp4lIUToiUkGILXsiEeEg9WAqm+XqO",
      },
      certificateChain: [],
      detachedContents: null,
      asicContainerType: null,
      signatureLevel: "XAdES_BASELINE_B",
      signaturePackaging: "ENVELOPING",
      embedXML: false,
      manifestSignature: false,
      jwsSerializationType: null,
      sigDMechanism: null,
      signatureAlgorithm: "RSA_SHA256",
      digestAlgorithm: "SHA256",
      encryptionAlgorithm: "RSA",
      referenceDigestAlgorithm: null,
      maskGenerationFunction: null,
      contentTimestamps: null,
      contentTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      signatureTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      archiveTimestampParameters: {
        digestAlgorithm: "SHA256",
        canonicalizationMethod:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        timestampContainerForm: null,
      },
      signWithExpiredCertificate: false,
      generateTBSWithoutCertificate: false,
      imageParameters: null,
      signatureIdToCounterSign: null,
      blevelParams: {
        trustAnchorBPPolicy: true,
        signingDate: 1675669784752,
        claimedSignerRoles: null,
        policyId: null,
        policyQualifier: null,
        policyDescription: null,
        policyDigestAlgorithm: null,
        policyDigestValue: null,
        policySpuri: null,
        commitmentTypeIndications: null,
        signerLocationPostalAddress: [],
        signerLocationPostalCode: null,
        signerLocationLocality: null,
        signerLocationStateOrProvince: null,
        signerLocationCountry: null,
        signerLocationStreet: null,
      },
    },
    signatureValue: {
      algorithm: "RSA_SHA256",
      value: base64Signature,
    },
    toSignDocument: {
      bytes: b64,
      digestAlgorithm: null,
      name: filename,
    },
  };
 
      const url =
			"http://localhost:8081/services/rest/signature/one-document/signDocument";

  try {
    const response = await axios.post(url, payloadToSign, {
      headers: {
        Accept: "application/json, application/javascript, text/javascript, text/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    console.log(response.data); // Handle the response data here
    resp.send(response.data);
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ message: 'Server error' });
  }
});


const validateData = app.post('/validateData', async (req, resp) => {
  const {payload} = req.body;
 
      const url =
			"http://localhost:8081/services/rest/validation/validateSignature";

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Accept: "application/json, application/javascript, text/javascript, text/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    console.log(response.data); // Handle the response data here
    resp.send(response.data);
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ message: 'Server error' });
  }
});


