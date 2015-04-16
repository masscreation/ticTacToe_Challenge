"use strict";
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    winnerId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.User, { as: "challenger"} );
        this.belongsTo(models.User, { as: "challenged"} );
      }
    }
  });
  return Game;
};