// server/models/dbAdapter.js
// Standard Mongoose model provider ensuring direct MongoDB persistence
const mongoose = require('mongoose');

function createDualModel(modelName, schema) {
  return mongoose.models[modelName] || mongoose.model(modelName, schema);
}

module.exports = { createDualModel };
