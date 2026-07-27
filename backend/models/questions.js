const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
    },
    questionType: {
      type: String,
      enum: ["MCQ", "Descriptive"],
      required: true,
    },
    options: [
      {
        optionText: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    skillCategory: {
      type: String,
      required: [true, "Skill category is required"],
      index: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// Custom validation to ensure MCQ has at least 1 correct answer (Acceptance Criteria 22)
questionSchema.pre("save", function (next) {
  if (this.questionType === "MCQ") {
    const hasCorrect = this.options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      return next(new Error("Please mark one option as correct"));
    }
  }
  next();
});

module.exports = mongoose.model("Question", questionSchema);