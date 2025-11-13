import React from "react";
import {
  BodyBlock,
  MultiImageContentBlock,
  QualityHomesBlock,
  DreamHomeJourneyBlock,
  BlogSectionBlock,
} from "../services/api";
import { DreamHomeJourney, BlogSection } from "./Home";
import StudioSection from "./Home/StudioSection";
import OurVisionSection from "./Home/OurVisionSection";

interface BodyRendererProps {
  blocks: BodyBlock[];
}

const BodyRenderer: React.FC<BodyRendererProps> = ({ blocks }) => {
  // Handle empty blocks array
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const renderBlock = (block: BodyBlock) => {
    console.log('Rendering block type:', block.type, block);
    switch (block.type) {
      case "multi_image_content":
        return renderMultiImageContentBlock(block);
      case "quality_homes":
        return renderQualityHomesBlock(block);
      case "dream_home_journey":
        return renderDreamHomeJourneyBlock(block);
      case "blog_section":
        return renderBlogSectionBlock(block);
      default:
        console.log('Unknown block type:', block.type);
        return null;
    }
  };

  const renderMultiImageContentBlock = (block: MultiImageContentBlock) => {
    const { value } = block;

    // Transform CTA data for StudioSection
    let ctaHref = "#contact";
    if (value.cta) {
      if (value.cta.is_external_link && value.cta.external_url) {
        ctaHref = value.cta.external_url;
      } else if (!value.cta.is_external_link && value.cta.page_link?.url) {
        ctaHref = value.cta.page_link.url;
      }
    }

    // Update StudioSection to accept cta props by passing the button text and href
    const updatedImages =
      value.images.length >= 2
        ? value.images
        : [
            ...value.images,
            // Add default image if only one image provided
            {
              src: `${import.meta.env.BASE_URL || "/"}images/placeholder.jpg`,
              alt: "Placeholder",
            },
          ];


    return (
      <StudioSection
        key={block.id}
        title={value.title}
        subtitle={value.subtitle}
        description={value.description}
        images={updatedImages}
        ctaText={value.cta?.button_text}
        ctaHref={ctaHref}
      />
    );
  };

  const renderQualityHomesBlock = (block: QualityHomesBlock) => {
    const { value } = block;
    const API_BASE =
      import.meta.env.VITE_API_URL?.replace("/api/v2", "") ||
      "http://127.0.0.1:8000";

    // Use the first feature image if available, otherwise use a default
    let centerImage = {
      src: `${import.meta.env.BASE_URL || "/"}images/l2.jpg`,
      alt: "Our approach image",
      overlayText: "Our approach",
    };

    if (value.features && value.features.length > 0 && value.features[0].image?.src) {
      centerImage.src = value.features[0].image.src.startsWith("http")
        ? value.features[0].image.src
        : `${API_BASE}${value.features[0].image.src}`;
      centerImage.alt = value.features[0].image.alt || "Our approach image";
    }

    return (
      <OurVisionSection
        key={block.id}
        leftText="Our"
        rightText="Vision"
        centerImage={centerImage}
      />
    );
  };

  const renderDreamHomeJourneyBlock = (block: DreamHomeJourneyBlock) => {
    const { value } = block;
    const API_BASE =
      import.meta.env.VITE_API_URL?.replace("/api/v2", "") ||
      "http://127.0.0.1:8000";

    // Transform primary CTA data
    let primaryCta = {
      text: "Explore designs",
      link: "#",
    };

    if (value.primary_cta) {
      primaryCta.text = value.primary_cta.button_text;
      if (
        value.primary_cta.is_external_link &&
        value.primary_cta.external_url
      ) {
        primaryCta.link = value.primary_cta.external_url;
      } else if (
        !value.primary_cta.is_external_link &&
        value.primary_cta.page_link?.url
      ) {
        primaryCta.link = value.primary_cta.page_link.url;
      }
    }

    // Transform secondary CTA data
    let secondaryCta = {
      text: "Explore house & land packages",
      link: "#",
    };

    if (value.secondary_cta) {
      secondaryCta.text = value.secondary_cta.button_text;
      if (
        value.secondary_cta.is_external_link &&
        value.secondary_cta.external_url
      ) {
        secondaryCta.link = value.secondary_cta.external_url;
      } else if (
        !value.secondary_cta.is_external_link &&
        value.secondary_cta.page_link?.url
      ) {
        secondaryCta.link = value.secondary_cta.page_link.url;
      }
    }

    // Transform background image URL
    let backgroundImage = `${
      import.meta.env.BASE_URL || "/"
    }images/wooden-bg.jpg`;
    if (value.background_image?.src) {
      backgroundImage = value.background_image.src.startsWith("http")
        ? value.background_image.src
        : `${API_BASE}${value.background_image.src}`;
    }

    return (
      <DreamHomeJourney
        key={block.id}
        title={value.title}
        description={value.description}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        backgroundImage={backgroundImage}
      />
    );
  };

  const renderBlogSectionBlock = (block: BlogSectionBlock) => {
    const { value } = block;
    const API_BASE =
      import.meta.env.VITE_API_URL?.replace("/api/v2", "") ||
      "http://127.0.0.1:8000";

    // Transform blog posts data - ensure image URLs are absolute
    const transformedPosts = value.posts.map((post) => ({
      ...post,
      imageSrc: post.imageSrc?.startsWith("http")
        ? post.imageSrc
        : `${API_BASE}${post.imageSrc}`,
      // Handle additional image for featured posts
      ...(post.additional_image && {
        additional_image: {
          src: post.additional_image.src?.startsWith("http")
            ? post.additional_image.src
            : `${API_BASE}${post.additional_image.src}`,
          alt: post.additional_image.alt,
        },
      }),
    }));

    // Transform CTA data
    let ctaText = undefined;
    let ctaLink = "#";

    if (value.cta) {
      ctaText = value.cta.text;
      ctaLink = value.cta.link;
    }

    return (
      <BlogSection
        key={block.id}
        sectionTitle={value.section_title}
        posts={transformedPosts}
        ctaText={ctaText}
        ctaLink={ctaLink}
      />
    );
  };

  return (
    <div className="body-content" style={{ margin: 0, padding: 0 }}>
      {blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}
    </div>
  );
};

export default BodyRenderer;
