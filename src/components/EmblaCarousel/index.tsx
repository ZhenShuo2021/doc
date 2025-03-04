// index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './EmblaCarousel.module.css';
import { EmblaCarouselProps } from './types';

export default function EmblaCarousel({ 
  images, 
  options = { 
    slidesToScroll: 1,
    align: 'center',
    containScroll: 'trimSnaps'
  } 
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className={styles.embla}>
      <div 
        className={styles.emblaViewport} 
        ref={emblaRef}
      >
        <div className={styles.emblaContainer}>
          {images.map((src, index) => (
            <div 
              key={index} 
              className={styles.emblaSlide}
            >
              <img 
                src={src} 
                alt={`Slide ${index + 1}`} 
                className={styles.emblaSlideImg}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.emblaDots}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`${styles.emblaDot} ${
              index === selectedIndex ? styles.emblaDotSelected : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}