const crypto = require('crypto');
const fs = require('fs');
const NodeRAS = require("node-rsa")


const key = new NodeRAS({b:2048});
// console.log(fs)

const createPrivate = async (req, res) => {
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
    fs.writeFileSync(__dirname + "/private.key", privateKey);
    fs.writeFileSync(__dirname + "/public.key", publicKey);
    

    return res.send({publicKey,privateKey})
}

const encryptData = async (req, res) => {
    let text = req.body.text;
    
    const data = Buffer.from(text); 
    const privateKey = fs.readFileSync(__dirname + "/private.key");

    const signature = crypto.sign('RSA-SHA256', data, privateKey).toString("base64"); 
    console.log("Signing done", signature);
    return res.send({signature})


}

const decryptData = async (req, res) => {
    let text = req.body.text;
    let signature = req.body.signature;
    //   let data = await decryptData(text.toString(),signature)
    const data = Buffer.from(text); 
    const publicKey = fs.readFileSync(__dirname + '/public.key');
    const verify = crypto.verify('RSA-SHA256', data, publicKey, Buffer.from(signature, "base64"));
    console.log("verfy done", verify);
    return res.send({verify})
 
}

const createRSAPrivate = async (req, res) => {
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    
    // Writing keys to files.
    fs.writeFileSync(__dirname + "/private.key", privateKey);
    fs.writeFileSync(__dirname + "/public.key", publicKey);

    return  res.send({privateKey,publicKey})
}

const encryptRSAData = async (req, res) => {
    let text = req.body.text;
    
    const data = Buffer.from(text); 
    const publicKey = fs.readFileSync(__dirname + "/public.key");  

      let key_public = new NodeRAS(publicKey);
      const encryptString = key_public.encrypt(data, 'base64');
    console.log("encryptString", encryptString);
    return res.send({encryptString})


}


const decryptRSAData = async (req, res) => {
    let encryptString = req.body.encryptString;
  
    const privateKey = fs.readFileSync(__dirname + '/private.key');
      
    let key_private = new NodeRAS(privateKey);


    const decryptString = key_private.decrypt(encryptString, 'utf8');
    // let decryptdata = JSON.stringify(decryptString);    
    
    console.log(decryptString);  


    return res.send({decryptString})
 
}

module.exports = {
    createPrivate,
    encryptData,
    decryptData,
    createRSAPrivate,
    encryptRSAData,
    decryptRSAData,
}








