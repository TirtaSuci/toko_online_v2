import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { products } from '@/types/products.type';
import { useEffect, useState } from 'react';
import { getAllImagesFromStorage } from '@/lib/firebase/service';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styles from './ImageView.module.scss';

type Propstype = {
  product: products;
  id: string | undefined;
}

const ImageView = (props: Propstype) => {
  const { id } = props;
  const [allImages, setAllImages] = useState<
    Array<{ name: string; url: string; fullPath?: string }>
  >([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);


  useEffect(() => {
    if (id) {
      getAllImagesFromStorage(id)
        .then((images) => {
          setAllImages(images);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
          setAllImages([]);
        })
    }
  }, [id]);


  return (
    <div className={styles.imageViewContainer}>
      <Swiper
        onSwiper={setThumbsSwiper}
        direction={'vertical'}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper}
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              className={styles.thumbnailImage}
              src={image.url}
              width={150}
              height={150}
              alt={image.name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        navigation={false}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper2}
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              className={styles.productImage}
              src={image.url}
              width={400}
              height={400}
              alt={image.name}
            />
          </SwiperSlide>
        ))
        }
      </Swiper>
    </div>
  );
};

export default ImageView;