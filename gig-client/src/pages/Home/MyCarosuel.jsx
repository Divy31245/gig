import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const MyCarousel = () => {
  return (
    <Carousel>
      <div>
        <img alt="carousel-1" src="/carousel-1.jpg" />
      </div>
      <div>
        <img alt="carousel-2" src="/carousel-2.jpg" />
      </div>
      <div>
        <img alt="carousel-3" src="/carousel-3.jpg" />
      </div>
    </Carousel>
  );
};

export default MyCarousel;