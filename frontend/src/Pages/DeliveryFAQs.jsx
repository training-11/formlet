import React, { useState } from 'react';
import '../Components/Home/FaqSection.css';

const DeliveryFAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is the delivery schedule page?",
            answer: "The delivery schedule page is your personal calendar showing all your upcoming deliveries. It lists the items you've ordered, their quantities, and expected delivery dates based on your frequency settings (e.g., Weekly, One-off)."
        },
        {
            question: "Can I change what’s arriving in my delivery?",
            answer: "Yes, you can manage your upcoming deliveries. For items set to repeat (like 'Every week'), you can update their quantity or remove them from future orders. Just keep in mind that changes must be made before the cut-off time for your delivery slot."
        },
        {
            question: "How do I pause my deliveries?",
            answer: "You can pause your deliveries by clicking the 'Pause deliveries' button at the top right of the schedule. This lets you select specific dates to skip—perfect for when you're going on holiday."
        },
        {
            question: "How do I add to or edit future deliveries?",
            answer: "To add more items, simply go to the Shop and add products to your cart. Select your desired delivery date or frequency at checkout. These new items will then appear in your schedule automatically."
        },
        {
            question: "How do I cancel my next delivery but not my regular order?",
            answer: "If you want to skip just one delivery without cancelling your subscription, use the 'Pause deliveries' feature. Select the specific date you want to skip, and your regular schedule will resume afterwards."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section" style={{ backgroundColor: '#fff' }}>
            <div className="faq-container">
                <div className="section-header">
                    <h2 className="section-title">FAQs</h2>
                    <p className="section-subtitle" style={{ fontSize: '20px' }}>Questions about your delivery schedule</p>
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

export default DeliveryFAQs;
