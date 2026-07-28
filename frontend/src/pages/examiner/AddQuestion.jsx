import { useState } from "react";
import api from "../../services/api";

function AddQuestion({ assessmentId }) {
  const [formData, setFormData] = useState({
    question: "",

    option1: "",

    option2: "",

    option3: "",

    option4: "",

    correctAnswer: 0,

    marks: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/question", {
        assessment: assessmentId,

        question: formData.question,

        options: [
          formData.option1,

          formData.option2,

          formData.option3,

          formData.option4,
        ],

        correctAnswer: Number(formData.correctAnswer),

        marks: Number(formData.marks),
      });

      alert("Question Added");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="question" placeholder="Question" onChange={handleChange} />

      <input name="option1" placeholder="Option 1" onChange={handleChange} />

      <input name="option2" placeholder="Option 2" onChange={handleChange} />

      <input name="option3" placeholder="Option 3" onChange={handleChange} />

      <input name="option4" placeholder="Option 4" onChange={handleChange} />

      <select name="correctAnswer" onChange={handleChange}>
        <option value="0">Option 1</option>

        <option value="1">Option 2</option>

        <option value="2">Option 3</option>

        <option value="3">Option 4</option>
      </select>

      <input type="number" name="marks" onChange={handleChange} />

      <button>Save Question</button>
    </form>
  );
}

export default AddQuestion;
