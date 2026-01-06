module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true, // One event per date
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: "events",
    freezeTableName: true,
  });
  
  return Event;
};

