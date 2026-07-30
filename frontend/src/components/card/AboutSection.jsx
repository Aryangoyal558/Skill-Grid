import "./AboutSection.css";

function AboutSection() {
  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Image Section */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">

            <div className="dots"></div>

            <div className="main-image">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0"
                alt="student"
                className="img-fluid"
              />
            </div>

            <div className="experience-card">
              <h2>25+</h2>
              <div>
                <h5>YEARS EXPERIENCE</h5>
                <p>JUST ACHIEVED</p>
              </div>
            </div>

            <div className="small-image-card">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                alt="teacher"
              />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="col-lg-6 text-white">

            <span className="about-badge">
              About Us
            </span>

            <h1 className="hero-title">
              Welcome to the <span>Online</span>
              <br />
              Learning Center
            </h1>

            <div className="quote-box">
              25+ Contrary to popular belief, Lorem Ipsum is not simply random
              text roots in a piece of classical Latin literature from 45 BC
            </div>

            <ul className="feature-list">
              <li>✔ Lorem Ipsum is simply dummy</li>
              <li>✔ Explore a variety of fresh educational teach</li>
              <li>✔ Lorem Ipsum is simply dummy text of</li>
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;