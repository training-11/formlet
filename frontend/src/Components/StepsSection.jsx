import React from "react";
import "./StepsSection.css";

export default function StepsSection() {
  return (
    <section className="steps-section">
      <div className="Header">
        <h1>How Farmlet Works</h1>
      </div>
      <div className="steps-container">
        <div className="step-box">
          <img className="step-img" src="/icons/step1.png" alt="Step 1" />

          <h2 className="step-title">
            Choose a weekly <br /> box of goodness
          </h2>

          <p className="step-description">
            We offer a variety of set boxes to suit your needs, harvested from
            our own fields and grower friends. Each box is carefully picked and
            packed by us every week.
          </p>
        </div>

        <div className="step-box">
          <img className="step-img" src="/icons/step2.png" alt="Step 2" />

          <h2 className="step-title">
            Add farm-fresh <br /> essentials
          </h2>

          <p className="step-description">
            You can also add other farm-fresh produce to your order. From fridge
            fillers to store cupboard essentials, we have everything you need to
            keep stocked up.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="step-box">
          <img className="step-img" src="/icons/step3.png" alt="Step 3" />

          <h2 className="step-title">
            Free delivery to <br /> your door
          </h2>

          <p className="step-description">
            Get weekly deliveries on a set day for your area. Manage orders
            easily with our app, receive push notifications and live delivery
            updates.
          </p>
        </div>
      </div>
    </section>
  );
}
