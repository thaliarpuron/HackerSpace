// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const multer = require("multer");
//Whatever value is passed here has to be "req.file" value of the image.
const uploadImage = require("../helpers/helpers.js");
let filePath;
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //This will save it if is an image
    cb(null, true);
  } else {
    //if now an image we wont allow to save
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      technology: req.body.technology,
      github: req.body.github,
      linkedin: req.body.linkedin,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  app.post("/uploads", upload.single("avatar"), async (req, res, next) => {
    try {
      const myFile = req.file;
      console.log("this is the file:",myFile);
      filePath = req.file.path;
      // const imageUrl = await uploadImage(myFile);
      // console.log("this is the image url: ", imageUrl);
      db.User.update({
        profileImage:filePath
      },
      {
        where:{
          id:req.user.id
        }
      }).then((result,error)=>{
        if(error){
          console.log(error)
          res.status(404).end();
        }else{
          res.json(result)
          location.reload()
        }
      })
      res.status(200).json({
        message: "Upload was successful",
        data: filePath,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/imageUpload',(req,res)=>{
    db.User.findAll({
      where:{
        id: req.user.id
      }
    }).then((result, err) => {
      if (err) {
        console.log("This is the error:", err);
      } else {
        const imagePath=result[0].profileImage;
        res.json(imagePath);
        console.log("this is the result:", imagePath);
      }
    });
  })

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
        city: req.user.city,
        technology: req.user.technology,
        github: req.user.github,
        linkedin: req.user.linkedin,
      });
      //We need to create a flag that will validate the user id that is being logged into the profile to match the id of the user which we are serching for , if they dont match hide certain things otherwise lets leave it alone.
    }
  });
  
  app.get("/api/hacker/:searchTerm", (req, res) => {
    const hackerSearch = req.params.searchTerm;
    console.log(hackerSearch);

    db.User.findOne({
      where: {
        name: hackerSearch,
      },
    }).then((result, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(404).end();
      } else {
        res.json(result);
      }
    });

  });

  app.get("/api/friend/codeSnippets/:searchId", (req,res)=>{
    const searchIdCode =req.params.searchId;
    console.log("This is the value passed to the url:",searchIdCode);
    
    db.Code.findAll({
      where: {
        UserId: searchIdCode,
      },
    }).then((result,err)=>{
      if(err){
      console.log(err);
      res.sendStatus(404).end();
      }else{
        res.json(result)
        res.sendStatus(200);
      }
      
    })
  });

  app.post("/api/code", (req, res) => {
    db.Code.create({
      title: req.body.title,
      code: req.body.code,
      description: req.body.description,
      UserId: req.user.id,
    }).then((result, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.json(result);
        res.sendStatus(200);
      }
    });
  });

  app.get("/api/codeSnippets", function(req, res) {
    db.Code.findAll({
      where: {
        UserId: req.user.id,
      },
    }).then(function(dbCode) {
      res.json(dbCode);
    });
  });
  

  app.delete("/api/code/:id", (req, res) => {
    db.Code.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        console.log("User Code Deleted! Id: " + req.params.id);
        res.sendStatus(200);
      })
      .catch((err) => {
        res.statusStatus(401).json(err);
      });
  });

  app.put("/api/code/:id", (req, res) => {
    db.Code.update(
      {
        title: req.body.title,
        code: req.body.code,
        description: req.body.description,
      },
      {
        where: req.params.id,
      }
    )
      .then((rowsUpdated) => {
        res.json(rowsUpdated);
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });
};
