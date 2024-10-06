const fs = require('fs');
const mime = require('mime');
const Buffer = require('buffer').Buffer;


var AWS = require('aws-sdk');

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY_ID;
const SECRET_KEY = process.env.SECRET_ACCESS_KEY;



AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
    bucket: BUCKET
});

var s3 = new AWS.S3()

function uploadImage(img, itype, adhaar) {
    let fName = itype + adhaar + "-" + Math.floor(1000 + Math.random() * 9000);
    const imageRemoteName = itype + `${new Date().getTime()}.jpeg`
 
    let extension = mime.getExtension('image/jpeg');
    let buff = Buffer.from(img, 'base64');
    let fileName = "./images/" + imageRemoteName;

    var data = {
        Key: imageRemoteName,
        Bucket: BUCKET,
        Body: buff,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };

    return new Promise((resolve, reject) => {
        s3.putObject(data, function (err, data) {
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
                reject(err);
            } else {
                // console.log('succesfully uploaded the image!', imageRemoteName);
                resolve(imageRemoteName)
            }
        });
    });
}

module.exports = {
    uploadImage: uploadImage
};