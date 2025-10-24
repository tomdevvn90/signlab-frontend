import React from 'react';
import HeroSection from './FlexibleSections/Hero';
import NavigationSection from './FlexibleSections/NavigationSection';
import CallToActionSection from './FlexibleSections/CallToAction';
import ContentWithImage from './FlexibleSections/ContentWithImage';
import Parallax from './FlexibleSections/Parallax';
import PartnerLogos from './FlexibleSections/PartnerLogos';
import ImagesSlider from './FlexibleSections/ImagesSlider';
import Form from './FlexibleSections/Form';
import Gallery from './FlexibleSections/Gallery';
import ImageBoxes from './FlexibleSections/ImageBoxes';
import SingleColumnContent from './FlexibleSections/SingleColumnContent';

const FlexibleContent = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  const renderBlock = (block, index) => {
    switch (block.acf_fc_layout) {
      case 'hero_section':
        return <HeroSection key={index} data={block} />;
      case 'navigation_section':
        return <NavigationSection key={index} data={block} />;
      case 'cta_section':
        return <CallToActionSection key={index} data={block} />;
      case 'content_img_section':
        return <ContentWithImage key={index} data={block} />;
      case 'parallax_section':
        return <Parallax key={index} data={block} />;
      case 'partner_logos_section':
        return <PartnerLogos key={index} data={block} />;
      case 'images_slider':
        return <ImagesSlider key={index} data={block} />;
      case 'form_section':
        return <Form key={index} data={block} />;
      case 'gallery_section':
        return <Gallery key={index} data={block} />;
      case 'image_boxes':
        return <ImageBoxes key={index} data={block} />;
      case 'single_column_content':
        return <SingleColumnContent key={index} data={block} />;
      default:
        console.warn(`Unknown ACF layout: ${block.acf_fc_layout}`);
        return null;
    }
  };

  return (
    <div className="flexible-content">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default FlexibleContent;
