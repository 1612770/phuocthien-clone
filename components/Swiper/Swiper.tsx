import {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import React from 'react';
import { Swiper as SwiperReactComponent, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Controller } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import css from './Swiper.module.scss';
import SwiperReactComponentType from 'swiper';

interface SwiperProps {
  autoplay?: boolean;
  fade?: boolean;
  autoplaySpeed?: number;
  className?: string;
  slidesPerView?: number;
  slidesPerGroup?: number;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      slidesPerGroup?: number;
    };
  };
  onSlideChange?: (swiper: SwiperReactComponentType) => void;
}

const Swiper = forwardRef(function SwiperImpl(
  {
    autoplay,
    autoplaySpeed,

    slidesPerView,
    slidesPerGroup,

    breakpoints,

    onSlideChange,

    className,
    children,
  }: PropsWithChildren<SwiperProps>,
  ref: React.Ref<{ swiper: SwiperReactComponentType | undefined }>
) {
  const [controlledSwiper, setControlledSwiper] = useState<
    SwiperReactComponentType | undefined
  >(undefined);

  useImperativeHandle(ref, () => ({
    swiper: controlledSwiper,
  }));

  const modules = useMemo(() => {
    const modules = [Controller, Navigation];

    if (autoplay) {
      modules.push(Autoplay);
    }

    return modules;
  }, [autoplay]);

  const _autoplay = useMemo(
    () =>
      autoplay
        ? {
            delay: autoplaySpeed || 3500,
            disableOnInteraction: false,
          }
        : {},
    [autoplay, autoplaySpeed]
  );

  return (
    <SwiperReactComponent
      className={`${css.swiper} ${className}`}
      modules={modules}
      spaceBetween={0}
      slidesPerView={slidesPerView || 1}
      slidesPerGroup={slidesPerGroup || 1}
      navigation
      loop
      loopAddBlankSlides={false}
      autoplay={_autoplay}
      breakpoints={breakpoints}
      onSlideChange={onSlideChange}
      onSwiper={setControlledSwiper}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </SwiperReactComponent>
  );
});

export default Swiper;
