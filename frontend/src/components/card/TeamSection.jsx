import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./TeamSection.css";

const teamMembers = [
  {
    name: "Divyansh Verma",
    role: "Our Mentor",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
  },
  {
    name: "Anna Keller",
    role: "Senior Software Engineer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
  },
  {
    name: "Michael Tan",
    role: "Full-Stack Developer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
  },
  {
    name: "Daniel Ruiz",
    role: "DevOps Engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
  },
  {
    name: "Laura Jensen",
    role: "Product & Operations",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
  },
  {
    name: "John Smith",
    role: "UI/UX Designer",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500",
  },
];

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="container">
        <div className="top-content">
          <div>
            <span className="sub-title">OUR PEOPLE</span>

            <h2 className="title text-white" style={{fontSize:'30px'}}>
              A team passionate about clean code
              <br />
              and <span className="gradient-text">solid architecture</span>
            </h2>
          </div>

          <a href="/" className="career-link">
            Career at CodeWorks
          </a>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".custom-prev",
            nextEl: ".custom-next",
          }}
          spaceBetween={30}
          slidesPerView={5}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 5,
            },
          }}
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="team-card bg-white pt-3 rounded-3">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                />

                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="slider-controls">
          <button className="custom-prev">←</button>
          <button className="custom-next">→</button>
        </div>
      </div>
    </section>
  );
}