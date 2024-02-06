import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormDataType } from './CreateListing';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState<null | FormDataType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | boolean>(false);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [params.listingId]);
  console.log(listing);

  return (
    <main>
      {loading && <p className={'text-center mt-7 text-2xl'}>Loading...</p>}
      {error && (
        <p className={'text-red-700 text-center text-2xl my-7'}>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map(url => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};
