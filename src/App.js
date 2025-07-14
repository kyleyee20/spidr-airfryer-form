import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    guess: "",
    pin: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return digits;
    return !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
  };

  const formatPIN = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1-").slice(0, 19);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === "pin") {
      setForm((prev) => ({ ...prev, pin: formatPIN(value) }));
    } else if (name === "guess") {
      let cleaned = value.replace(/[^0-9.]/g, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) return;

      let [intPart, decimalPart] = parts;
      intPart = intPart.replace(/^0+(?=\d)/, "");

      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      let result = formattedInt;
      if (decimalPart !== undefined) {
        result += "." + decimalPart.slice(0, 2);
      }

      setForm((prev) => ({ ...prev, guess: result }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    const pinDigits = form.pin.replace(/\D/g, "");
    if (pinDigits.length !== 16) {
      newErrors.pin = "Spidr PIN must be exactly 16 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitted Form Data:", form);

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        guess: "",
        pin: "",
      });

      setErrors({});
      setSubmitted(true);

      // Hide message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setSubmitted(false);
      console.warn("Validation failed:", errors);
    }
  };

  return (
    <div className="form-container">
      <h2>Reserve Your Air Fryer!</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="dollar-input-wrapper">
          <span className="dollar-prefix">$</span>
          <input
            name="guess"
            placeholder="0.00"
            value={form.guess}
            onChange={handleChange}
          />
        </div>

        <input
          name="pin"
          placeholder="Spidr PIN ####-####-####-####"
          value={form.pin}
          onChange={handleChange}
        />
        {errors.pin && <p className="error">{errors.pin}</p>}

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <p className="success-message">Form submitted successfully!</p>
      )}
    </div>
  );
};

export default App;
