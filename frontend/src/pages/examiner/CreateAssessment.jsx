import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CreateAssessment = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
  });

  const change = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/examiner/assessment", form);

      alert("Assessment Created");

      navigate("/examiner/assessments");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Create Assessment</h1>

      <form onSubmit={submit}>
        <input name="title" placeholder="Title" onChange={change} />

        <textarea
          name="description"
          placeholder="Description"
          onChange={change}
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration Minutes"
          onChange={change}
        />

        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          onChange={change}
        />

        <input
          type="number"
          name="passingMarks"
          placeholder="Passing Marks"
          onChange={change}
        />

        <button>Create</button>
      </form>
    </div>
  );
};

export default CreateAssessment;
