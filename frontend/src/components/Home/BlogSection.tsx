import React from 'react';
import './BlogSection.css';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
  featured?: boolean;
  additional_text?: string;
  additional_image?: {
    src: string;
    alt: string;
  } | null;
}

interface BlogSectionProps {
  sectionTitle?: string;
  ctaText?: string;
  ctaLink?: string;
  posts?: BlogPost[];
}

const publicUrl = import.meta.env.BASE_URL;

const BlogSection: React.FC<BlogSectionProps> = ({
  sectionTitle = "Design and building tips from our blog",
  ctaText = "View all blog posts",
  ctaLink = "#",
  posts = [
    {
      id: 1,
      title: "Transform Your Outdoor Space: Complete Landscaping Guide",
      date: "14 Oct, 2025",
      category: "Design Tips",
      excerpt: "Discover how to create the perfect outdoor living space with our comprehensive landscaping guide. From garden design to sustainable practices, learn everything you need to transform your backyard into a beautiful oasis.",
      imageSrc: `${publicUrl}images/5.jpg`,
      imageAlt: "Beautiful landscaped garden",
      link: "#",
      featured: true
    },
    {
      id: 2,
      title: "Sustainable Garden Design: Eco-Friendly Solutions",
      date: "12 Oct, 2025",
      category: "Sustainability",
      excerpt: "Learn how to create an environmentally friendly garden that looks beautiful and helps the planet.",
      imageSrc: `${publicUrl}images/6.jpg`,
      imageAlt: "Sustainable garden design",
      link: "#"
    },
    {
      id: 3,
      title: "Modern Patio Ideas for Year-Round Enjoyment",
      date: "10 Oct, 2025",
      category: "Outdoor Living",
      excerpt: "Explore contemporary patio designs that extend your living space and create the perfect entertainment area.",
      imageSrc: `${publicUrl}images/7.jpg`,
      imageAlt: "Modern patio design",
      link: "#"
    }
  ]
}) => {
  const featuredPost = posts.find(post => post.featured) || posts[0];
  const sidebarPosts = posts.filter(post => !post.featured).slice(0, 2);

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <div className="blog-title-container">
            <div className="blog-title-line"></div>
            <h2 className="blog-scroll-title" style={{ textAlign: 'center' }}>
              {sectionTitle}
            </h2>
            <div className="blog-title-line"></div>
          </div>
        </div>

        <div className="blog-layout">
          {/* Left Half - Featured Blog */}
          <div className="blog-left">
            <article className="blog-card blog-card-large">
              <a href={featuredPost.link} className="blog-link">
                <div className="blog-image-container">
                  <img 
                    src={featuredPost.imageSrc} 
                    alt={featuredPost.imageAlt} 
                    className="blog-image"
                    loading="lazy"
                  />
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    <span className="blog-date">{featuredPost.date}</span>
                  </div>
                  <h3 className="blog-title">{featuredPost.title}</h3>
                  <p className="blog-description">{featuredPost.excerpt}</p>
                  
                  {/* Additional content for featured blog */}
                  {(featuredPost.additional_text || featuredPost.additional_image) && (
                    <div className="blog-additional-content">
                      {featuredPost.additional_text && (
                        <p className="blog-extra-text">
                          {featuredPost.additional_text}
                        </p>
                      )}
                      {featuredPost.additional_image && (
                        <div className="blog-extra-image">
                          <img 
                            src={featuredPost.additional_image.src} 
                            alt={featuredPost.additional_image.alt || 'Additional content'} 
                            className="blog-small-image"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <span className="blog-read-more">Read More</span>
                </div>
              </a>
            </article>
          </div>

          {/* Right Half - Two Blogs */}
          <div className="blog-right">
            {sidebarPosts.map((post) => (
              <article key={post.id} className="blog-card blog-card-small">
                <a href={post.link} className="blog-link">
                  <div className="blog-image-container">
                    <img 
                      src={post.imageSrc} 
                      alt={post.imageAlt} 
                      className="blog-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-info">
                    <div className="blog-meta">
                      <span className="blog-date">{post.date}</span>
                    </div>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-description">{post.excerpt}</p>
                    <span className="blog-read-more">Read More</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        {ctaText && (
          <div className="blog-footer">
            <a href={ctaLink} className="blog-cta">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
