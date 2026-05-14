"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Clicks", {
      clickId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      linkId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Links",
          key: "linkId"
        }
      },
      clickedAt: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      userAgent: {
        type: Sequelize.STRING
      },
      referrer: {
        type: Sequelize.STRING
      },
      visitor: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Clicks")
  }
}
