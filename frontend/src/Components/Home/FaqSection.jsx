import React, { useState } from 'react';
import './FaqSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How much does delivery cost?",
      answer: "Delivery costs vary depending on your location and order size. Please check our delivery page for specific pricing in your area."
    },
    {
      question: "Do I need to be in when you deliver?",
      answer: "No, you don't need to be in. We can leave your box in a safe place that you specify during checkout."
    },
    {
      question: "Do I have to order every week?",
      answer: "No, you have full flexibility. You can pause, skip, or cancel your deliveries at any time through your account."
    },
    {
      question: "Can I swap what's in my box?",
      answer: "Yes! You can customize your box and swap items based on your preferences before each delivery."
    },
    {
      question: "Can I build my own box?",
      answer: "Absolutely! We offer the option to build your own box and choose exactly what you want."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="section-header">
          <h2 className="section-title">MOST POPULAR QUESTIONS</h2>
          <p className="section-subtitle">Some of our most-asked questions...</p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`accordion-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="accordion-button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="accordion-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`chevron ${openIndex === index ? 'rotate' : ''}`}
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              
              {openIndex === index && (
                <div className="accordion-content">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <a href="/faqs" className="view-all-link">
            See all FAQs
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;