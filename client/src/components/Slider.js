import { ReactComponent as ArrowLeftIcon } from '../svg/icon-arrow-left.svg';
import { ReactComponent as ArrowRightIcon } from '../svg/icon-arrow-right.svg';
import { Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MusicCard } from '../components/Cards';
import { useRef } from 'react';

const Slider = ({ data, skeleton }) => {
  const sliderRef = useRef(null);

  const handlePrev = () => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  };

  const handleNext = () => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  };

  return (
    <div className="slider">
      <div className={`pb-4 ${skeleton ? 'd-none' : ''}`}>
        <button className="slider-btn" onClick={handlePrev}>
          <ArrowLeftIcon />
        </button>
      </div>
      <Swiper 
        ref={sliderRef}
        className="pb-4"
        slidesPerView={5.2} 
        slidesPerGroup={5}
        spaceBetween={16}
        rewind={true}
        modules={[Grid, Navigation]}
        breakpoints={{
          1920: {
            slidesPerView: 5.2,
            slidesPerGroup: 5
          },
          1280: {
            slidesPerView: 4.2,
            slidesPerGroup: 4
          },
          1024: {
            slidesPerView: 3.2,
            slidesPerGroup: 3
          },
          768: {
            slidesPerView: 2.2,
            slidesPerGroup: 2
          },
          480: {
            slidesPerView: 1.5,
            slidesPerGroup: 1
          },
          320: {
            slidesPerView: 1.2,
            slidesPerGroup: 1
          }
        }}
        style={{
          flex: '1 0 0'
        }}
      >
        {
          skeleton ?
          new Array(5).fill(
            <SwiperSlide>
              <MusicCard skeleton />
            </SwiperSlide>
          ) :
          data.map(music => (
            <SwiperSlide className="d-flex gap-3">
              <MusicCard {...music} />
            </SwiperSlide>
          ))
        }
      </Swiper>
      <div className={`pb-4 ${skeleton ? 'd-none' : ''}`}>
        <button className="slider-btn" onClick={handleNext}>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Slider;