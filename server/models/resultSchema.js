const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  programName: { type: String, required: true },
  teamName: { type: String, required: true },
  category: { type: String ,required:true},
  stage: { type: String, required: true },
  prize: { type: String },
  grade: { type: String },
  points: { type: Number, required: true },
});

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;
