import React from "react";

function TestPage() {
  const [formData, setFormData] = React.useState({
    employment: "part-time",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
    // or
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // submitToApi(formData)
    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Current employment status</legend>
        <input type="radio" id="unemployed" name="employment" value="unemployed" checked={formData.employment === "unemployed"} onChange={handleChange} />
        <label htmlFor="unemployed">Unemployed</label>
        <br />

        <input type="radio" id="part-time" name="employment" value="part-time" checked={formData.employment === "part-time"} onChange={handleChange} />
        <label htmlFor="part-time">Part-time</label>
        <br />

        <input type="radio" id="full-time" name="employment" value="full-time" checked={formData.employment === "full-time"} onChange={handleChange} />
        <label htmlFor="full-time">Full-time</label>
        <br />
      </fieldset>
      <br />

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
}

export default TestPage;
