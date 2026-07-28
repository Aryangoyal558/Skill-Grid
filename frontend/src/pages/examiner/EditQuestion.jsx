import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../../services/api";

const EditQuestion = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get(`/question/single/${id}`);

    setQuestion(res.data.question);
  };

  const update = async (e) => {
    e.preventDefault();

    await api.put(
      `/question/${id}`,

      question,
    );

    alert("Updated");

    navigate(-1);
  };

  return (
    <div>
      <h1>Edit Question</h1>

      <form onSubmit={update}>
        <textarea
          value={question.question}
          onChange={(e) =>
            setQuestion({
              ...question,
              question: e.target.value,
            })
          }
        />

        {question.options.map((opt, index) => (
          <input
            key={index}
            value={opt}
            onChange={(e) => {
              let arr = [...question.options];

              arr[index] = e.target.value;

              setQuestion({
                ...question,

                options: arr,
              });
            }}
          />
        ))}

        <input
          type="number"
          value={question.marks}
          onChange={(e) =>
            setQuestion({
              ...question,

              marks: e.target.value,
            })
          }
        />

        <button>Update</button>
      </form>
    </div>
  );
};

export default EditQuestion;
