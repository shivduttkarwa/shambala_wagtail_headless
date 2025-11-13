import React from "react";
import "./ProjectListing.css";

interface Project {
  id: string;
  image: string;
  category: string;
  title: string;
  link: string;
  date: string;
}

interface ProjectListingProps {
  projects?: Project[];
}

const ProjectListing: React.FC<ProjectListingProps> = ({
  projects = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "OFFICE BUILDINGS",
      title: "Browns Shoes Distribution Center - IMPs Allow for Seamless Design Transition on Distribution Center Expansion for Leading Independent Footwear Chain",
      link: "#",
      date: "NOVEMBER 3, 2024"
    },
    {
      id: "2", 
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "OFFICE BUILDINGS",
      title: "Life in Technicolour",
      link: "#",
      date: "NOVEMBER 3, 2024"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "DISTRIBUTION & WAREHOUSING", 
      title: "CPE Fleur de papier opens its doors to new facility",
      link: "#",
      date: "OCTOBER 29, 2024"
    }
  ]
}) => {
  return (
    <section className="project-listing">
      <div className="project-container">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
            </div>
            <div className="project-content">
              <div className="project-meta">
                <span className="project-category">{project.category}</span>
                <span className="project-date">{project.date}</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <a href={project.link} className="project-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectListing;