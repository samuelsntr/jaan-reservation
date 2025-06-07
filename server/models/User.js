'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff'),
      allowNull: false,
    },
  });

  // Optionally, define associations (if needed in the future)
  // Example: User.associate = function(models) {
  //   // Define associations here
  // };

  return User;
};
