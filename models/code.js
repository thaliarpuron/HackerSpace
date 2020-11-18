module.exports = function(sequelize, DataTypes) {
  var Code = sequelize.define("Code", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1],
    },
  });

  Code.associate = function(models) {
    // We're saying that a Code should belong to an User
    // A Code can't be created without an User due to the foreign key constraint
    Code.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Code;
};
