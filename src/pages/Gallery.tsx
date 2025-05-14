import React from 'react';
import GallerySlider from '../components/GallerySlider';
import ThreeLoader from '../components/ThreeLoader';

const Gallery: React.FC = () => {
  return (
    <div className="gallery-page">
      <ThreeLoader>
        <GallerySlider />
      </ThreeLoader>
    </div>
  );
};

export default Gallery; 