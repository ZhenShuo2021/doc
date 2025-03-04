export interface EmblaCarouselProps {
  images: string[];
  options?: {
    slidesToScroll?: number;
    align?: string;
    containScroll?: string;
    loop?: boolean;
  };
}