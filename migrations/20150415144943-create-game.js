"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Games", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      challengerId: {
        type: DataTypes.INTEGER
      },
      challengedId: {
        type: DataTypes.INTEGER
      },
      winnerId: {
        type: DataTypes.INTEGER
      },
      amount: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Games").done(done);
  }
};