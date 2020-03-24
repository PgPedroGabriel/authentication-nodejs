require('dotenv/config');

const relational = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: !process.env.RUNNINGTEST,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};

module.exports = relational;
