import React from 'react';
import HeroSection from './FlexibleSections/Hero';
import CallToActionSection from './FlexibleSections/CallToAction';

const FlexibleContent = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  const renderBlock = (block, index) => {
    switch (block.acf_fc_layout) {
      case 'hero_section':
        return <HeroSection key={index} data={block} />;
      case 'cta_section':
        return <CallToActionSection key={index} data={block} />;
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
