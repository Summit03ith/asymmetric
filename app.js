const express = require("express");
const router = express.Router()
const routes = require("./routes/route");
const crypto = require('crypto');
const fs = require('fs');
// const NodeRSA = require('node-rsa');

const app = express();
app.use(express.json())

app.use('/api', routes);
const port = 3000;


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/createKeys", (req, res) => {
  let data = createSecret()
  res.send(data);
});

app.post("/encryptKey", (req, res) => {
  let text = req.body.text;

  let data = encryptData(text)
  res.send({signature:data});
});

app.post("/decryptKeys", async (req, res) => {
  let text = req.body.text
  let signature = req.body.signature
  let data = await decryptData(text,signature)
  res.send({verify:data});
});

function createSecret(){
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
      },
      privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
      }
  });
  
  // Writing keys to files.
  fs.writeFileSync("./private.key", privateKey);
  fs.writeFileSync("./public.key", publicKey);
  return {publicKey,privateKey}
}

function encryptData(text){
  // let datas = {
  //  "new":"data"
  // }
  const data = Buffer.from(text.toString()); 
  // const publicKey = fs.readFileSync('./public.key');
  const privateKey = fs.readFileSync('./private.key');
  const signature = crypto.sign('RSA-SHA256', data, privateKey).toString("base64"); 
  console.log("Signing done", signature);
  return signature
}

function decryptData(text, signature){
  // let datas = {
    //     "new":"data"
    //         }
    const publicKey = fs.readFileSync('./public.key');
    // const privateKey = fs.readFileSync('./private.key');
  const data = Buffer.from(text.toString()); 
  const verify = crypto.verify('RSA-SHA256', data, publicKey, Buffer.from(signature, "base64"));
  console.log("verfy done", verify);
  return verify
}


function rsaKeysCreation(){
  const keys = new NodeRSA({b:512})
  const  publicKey = keys.exportKey("public")
  const  privateKey = keys.exportKey("private")
  console.log(publicKey,privateKey)
  return {publicKey,privateKey}
  
}
// let data = rsaKeysCreation()

// let dbPrivateKey;

function rsaDecryption(text,private){
  const keysPrivate = new nodeRSA(private)
  const  decrypt = keysPrivate.decrypt(text)
  console.log(decrypt)    
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

