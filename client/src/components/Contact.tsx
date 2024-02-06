import React, { ChangeEvent, useEffect, useState } from 'react';
import { ListingType } from '../types/type';
import { UserType } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

type PropsType = {
  listing: ListingType;
};
export const Contact = ({ listing }: PropsType) => {
  const [landLord, setLandlord] = useState<UserType | null>(null);
  const [message, setMessage] = useState('');
  const onChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  console.log(landLord);
  return (
    <div>
      {landLord && (
        <div className={'flex flex-col gap-2'}>
          <p className={''}>
            Contact <span className={'font-semibold'}>{landLord.username}</span> for{' '}
            <span className={'font-semibold'}>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className={'w-full border p-3 rounded-lg'}
            id={'message'}
            name={'message'}
            rows={2}
            placeholder={'Enter your message here'}
            value={message}
            onChange={onChangeMessage}
          ></textarea>
          <Link
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};
