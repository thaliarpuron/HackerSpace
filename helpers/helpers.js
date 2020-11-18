//This is redundant for now , this is for future development.
const gc = require("../config/");
const bucket = gc.bucket("hacker-space"); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
//This function takes a the name of the file image that we get from the front end
const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    //Here we are checking if the file is even going thru or not
    //Decostructing the object that comes back from a file.
    const { originalname, buffer } = file;
    //Here we are splitting the original name of the image by the dots (".")
    const imagePieces = originalname.split(".");
    //We are getting the last item from the image array
    const lastPiece = imagePieces[imagePieces.length - 1];
    //Here we are removing the last item that is in the array which would usually be ("jpg","jpeg")
    imagePieces.pop();
    //we are putthing together the items that we just messed around with.
    const noLastPiece = imagePieces.join("");
    //Here we are creating a randomized variable that contains the date from right now as a string ans it substracts a random number from it
    const extension = `_${Date.now().toString()}-${Math.floor(
      Math.random() * 1000
    )}.`;
    //This is the combined pieces of the file that was passed to the function, we organize them randomly to make it extra encrypted.
    const finalName = noLastPiece + extension + lastPiece;

    const blob = bucket.file(finalName.replace(/ /g, "_"));

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream
      //This is the url that is pushed to the database whenever we are done encrypting the file path.
      .on("finish", () => {
        //This is the url that need's to be assigned to the image.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (error) => {
        reject(error);
      })
      .end(buffer);
  });
module.exports = uploadImage;
