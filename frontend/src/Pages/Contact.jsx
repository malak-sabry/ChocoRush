import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Layout from "../Components/Layout";

const Contact = () => {
  // State to store form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // State to show confirmation message
  const [submitted, setSubmitted] = useState(false);

  // Update form values on typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" }); // Clear fields
    setSubmitted(true); // Show confirmation text
  };

  return (
    <Layout>
      <section className="md:h-[90vh] h-[112vh] max-w-5xl mx-auto px-4 py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-[#6c4c42] mb-8">
          Contact Us
        </h1>

        <div className="flex flex-col  md:flex-row gap-12">
          {/* Contact Info */}
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-2xl font-semibold text-[#6c4c42]">
              Get in Touch
            </h2>
            <p className="text-gray-700">
              We'd love to hear from you! Reach out with any questions or
              inquiries.
            </p>

            <div className="flex items-center gap-4 text-gray-700">
              <FaPhoneAlt className="text-[#6c4c42]" />
              <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <FaEnvelope className="text-[#6c4c42]" />
              <span>ChocoRush.com</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <FaMapMarkerAlt className="text-[#6c4c42]" />
              <span>123 Main Street, Alexandria, Egypt</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:w-1/2  bg-white/10 p-6 rounded-lg ring-2 ring-[#4B322B] ">
            <form onSubmit={handleSubmit} className=" space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full ring-1 ring-black/20 p-3 
                rounded focus:outline-none focus:ring-2 focus:ring-[#4B322B]"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full ring-1 ring-black/20 p-3 
                rounded focus:outline-none focus:ring-2 focus:ring-[#4B322B]"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full ring-1 ring-black/20 p-3 rounded
                 focus:outline-none focus:ring-2 focus:ring-[#4B322B]"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full  bg-[#593f38] text-white py-3 rounded 
                hover:bg-[#4B322B] transition"
              >
                Send Message
              </button>
            </form>

            {/* Confirmation message */}
            {submitted && (
              <p className="mt-4 text-green-600 text-center">
                Thank you for contacting us!
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
