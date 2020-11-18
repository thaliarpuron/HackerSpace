// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    // The password cannot be null
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The city cannot be null
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The technology slack cannot be null
    technology: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The github username cannot be null
    github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The linkedin username cannot be null
    linkedin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  User.associate = function(models) {
    // Associating User with Codes
    // When an User is deleted, also delete any associated Codes
    User.hasMany(models.Code, {
      onDelete: "cascade",
    });
  };
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", (user) => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return User;
};
