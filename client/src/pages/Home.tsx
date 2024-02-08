import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ListingType } from '../types/type';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { ListingItems } from '../components/ListingItems';

export const Home = () => {
  SwiperCore.use([Navigation]);
  const [offer, setOffer] = useState<ListingType[]>([]);
  const [saleListing, setSaleListing] = useState<ListingType[]>([]);
  const [rentListing, setRentListing] = useState<ListingType[]>([]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOffer(data);
        await fetchRentListing();
      } catch (e) {
        console.log(e);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        await fetchSaleListing();
      } catch (e) {
        console.log(e);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListing(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchOfferListing();
  }, []);

  return (
    <div className={''}>
      <div className={'flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'}>
        <h1 className={'text-slate-700 font-bold text-3xl lg:text-6xl'}>
          Find your next <span className={'text-slate-500'}>perfect</span>
          <br />
          place with ease
        </h1>
        <div className={'text-gray-400 text-xs sm:text-sm'}>
          AlexEstate app will help you to find new home fast, easy and comfortable.
          <br />
          Try it and share with your friends!
        </div>
        <Link
          to={'/search'}
          className={'text-xs sm:text-sm text-blue-600 hover:underline font-bold'}
        >
          Let's get started...
        </Link>
      </div>
      <Swiper navigation>
        {offer &&
          offer.length > 0 &&
          offer.map(listing => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className={'h-[500px]'}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className={'flex flex-col gap-8 my-10 max-w-fit mx-auto'}>
        {offer && offer.length > 0 && (
          <div className={''}>
            <div className={'my-3'}>
              <h2 className={'text-3xl font-semibold text-slate-600'}>Recent offers</h2>
              <Link
                className={'text-sm text-blue-600 hover:underline'}
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>
            <div className={'flex flex-wrap gap-4 '}>
              {offer.map(listing => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className={''}>
            <div className={'my-3'}>
              <h2 className={'text-3xl font-semibold text-slate-600'}>
                Recent places for rent
              </h2>
              <Link
                className={'text-sm text-blue-600 hover:underline'}
                to={'/search?type=rent'}
              >
                Show more places for rent
              </Link>
            </div>
            <div className={'flex flex-wrap gap-4'}>
              {rentListing.map(listing => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className={''}>
            <div className={'my-3'}>
              <h2 className={'text-3xl font-semibold text-slate-600'}>
                Recent places for sale
              </h2>
              <Link
                className={'text-sm text-blue-600 hover:underline'}
                to={'/search?type=sale'}
              >
                Show more places for sale
              </Link>
            </div>
            <div className={'flex flex-wrap gap-4'}>
              {saleListing.map(listing => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/*results*/}
    </div>
  );
};
