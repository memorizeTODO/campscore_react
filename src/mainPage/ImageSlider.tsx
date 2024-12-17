import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';  // Swiper CSS
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import mainImage4 from './images/main1.jpg';
import mainImage5 from './images/main2.jpg';
import mainImage6 from './images/main3.jpg';
import mainImage1 from './images/제주/camp3.jpg';
import mainImage2 from './images/경북/camp4.jpg';
import mainImage3 from './images/경기/camp2.jpg';


const ImageSlider: React.FC = () => {

 

  return (
      /* 이미지 슬라이드 / 검색 */
      <div className="w-full h-4/5">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={mainImage1} className="w-full" alt="슬라이드 이미지 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mainImage2} className="w-full" alt="슬라이드 이미지 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mainImage3} className="w-full" alt="슬라이드 이미지 3" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mainImage4} className="w-full" alt="슬라이드 이미지 4" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mainImage5} className="w-full" alt="슬라이드 이미지 5" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mainImage6} className="w-full" alt="슬라이드 이미지 6" />
          </SwiperSlide>
        </Swiper>
      </div>
  );
};

export default ImageSlider;