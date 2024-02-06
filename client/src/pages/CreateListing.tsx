import React, { ChangeEvent, FormEvent, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

export type FormDataType = {
  imageUrls: string[];
  name: string;
  description: string;
  address: string;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  regularPrice: number;
  discountPrice: number;
  offer: boolean;
  parking: boolean;
  furnished: boolean;
};
export const CreateListing = () => {
  const { currentUser } = useSelector((state: RootState) => state.user) || {};
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUpError, setImageUpError] = useState<string | boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUpError(false);
      try {
        const urls = await Promise.all<string>(files.map(file => storeImage(file)));
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUpError(false);
        setUploading(false);
      } catch (error) {
        console.error('Error uploading images:', error);
        setImageUpError('Image upload faild (2MB max per image)');
        setUploading(false);
      }
    } else {
      setImageUpError('You can upload less then 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        error => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'offer' ||
      e.target.id === 'furnished'
    ) {
      setFormData({ ...formData, [e.target.id]: (e.target as HTMLInputElement).checked });
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  console.log(formData);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower  than regular price');
      setLoading(true);
      setError(false);
      const userRef = currentUser ? currentUser._id : null;
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userRef }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success == false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setLoading(false);
    }
  };

  return (
    <main className={'p-3 max-w-4xl mx-auto'}>
      <h1 className={'text-3xl font-semibold text-center my-7'}>Create a listing</h1>
      <form className={'flex flex-col sm:flex-row gap-4'} onSubmit={handleSubmit}>
        <div className={'flex flex-col gap-4 flex-1'}>
          <input
            type="text"
            placeholder={'Name'}
            className={'border p-3 rounded-lg '}
            id={'name'}
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder={'Description'}
            className={'border p-3 rounded-lg '}
            id={'description'}
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder={'Address'}
            className={'border p-3 rounded-lg '}
            id={'address'}
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className={'flex gap-6 flex-wrap'}>
            <div className={'flex gap-2'}>
              <input
                type="checkbox"
                id={'sale'}
                className={'w-5'}
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className={'flex gap-2'}>
              <input
                type="checkbox"
                id={'rent'}
                className={'w-5'}
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className={'flex gap-2'}>
              <input
                type="checkbox"
                id={'parking'}
                className={'w-5'}
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className={'flex gap-2'}>
              <input
                type="checkbox"
                id={'furnished'}
                className={'w-5'}
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className={'flex gap-2'}>
              <input
                type="checkbox"
                id={'offer'}
                className={'w-5'}
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className={'flex justify-start flex-wrap gap-6'}>
            <div className={'flex items-center gap-2'}>
              <input
                type="number"
                id={'bedrooms'}
                minLength={1}
                maxLength={10}
                required
                className={'p-3 border border-gray-300 rounded-lg w-16'}
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className={'flex items-center gap-2'}>
              <input
                type="number"
                id={'bathrooms'}
                minLength={1}
                maxLength={10}
                required
                className={'p-3 border border-gray-300 rounded-lg w-16'}
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className={'flex items-center gap-2'}>
              <input
                type="number"
                id={'regularPrice'}
                minLength={50}
                maxLength={1000000}
                required
                className={'p-3 border border-gray-300 rounded-lg w-1/3'}
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className={'flex flex-col items-center'}>
                <p>Regular price</p>
                <span className={'text-xs'}>($ /month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className={'flex items-center gap-2'}>
                <input
                  type="number"
                  id={'discountPrice'}
                  minLength={0}
                  maxLength={1000000}
                  required
                  className={'p-3 border border-gray-300 rounded-lg w-1/3'}
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className={'flex flex-col items-center'}>
                  <p>Discounted price</p>
                  <span className={'text-xs'}>($ /month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={'flex flex-col flex-1 gap-4'}>
          <p className={'font-semibold'}>
            Images:
            <span className={'font-normal text-gray-600 ml-2'}>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className={'flex gap-4'}>
            <input
              onChange={handleSaveFiles}
              className={'p-3 border border-gray-300 rounded w-full'}
              type="file"
              id={'images'}
              accept={'image/*'}
              multiple
            />
            <button
              disabled={uploading}
              type={'button'}
              onClick={handleImageSubmit}
              className={
                'p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              }
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className={'text-red-700 text-sm'}>{imageUpError && imageUpError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className={'flex justify-between p-3 border items-center'}>
                <img
                  src={url}
                  alt={'listing image'}
                  className={'w-20 h-20 object-contain rounded-lg'}
                />
                <button
                  className={'p-3 text-red-700 rounded-lg uppercase hover:opacity-70'}
                  type={'button'}
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className={
              'p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-70'
            }
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className={'text-red-700 text-sm'}>{error}</p>}
        </div>
      </form>
    </main>
  );
};
