import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOut,
} from '../redux/user/userSlice';

interface FormData {
  profilePicture?: string;
}

export const Profile = () => {
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSaveImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      error => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          }),
        );
      },
    );
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.currentTarget.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      if (currentUser) {
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data));
          return;
        }
        dispatch(updateUserSuccess(data));
      }
      setUpdateSuccess(true);
    } catch (e) {
      dispatch(updateUserFailure(e));
    }
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      if (currentUser) {
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess(data));
      }
    } catch (e) {
      dispatch(deleteUserFailure(e));
    }
  };
  const handleSignoutAccount = async () => {
    try {
      await fetch('/api/auth/signout/');
      dispatch(signOut());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={'p-3 max-w-lg mx-auto'}>
      <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
        {currentUser && (
          <>
            <input
              type={'file'}
              ref={fileRef}
              hidden
              accept={'image/*'}
              onChange={handleSaveImage}
            />
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt="profile"
              className={
                'mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover'
              }
              onClick={() => fileRef.current?.click()}
            />
            <p className={'text-sm self-center'}>
              {imageError ? (
                <span className={'text-red-700'}>
                  {' '}
                  Error uploading image(file size must be less 2 MB)
                </span>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className={'text-slate-700'}>
                  {' '}
                  {`Uploading: ${imagePercent} %`}
                </span>
              ) : imagePercent === 100 ? (
                <span className={'text-green-700'}> Image upload successfully</span>
              ) : (
                ''
              )}
            </p>
          </>
        )}
        <input
          type="text"
          defaultValue={currentUser ? currentUser.username : ''}
          id={'username'}
          placeholder={'Username'}
          className={'bg-slate-100 rounded-lg p-3'}
          onChange={handleChange}
        />
        <input
          type="text"
          defaultValue={currentUser ? currentUser.email : ''}
          id={'email'}
          placeholder={'Email'}
          className={'bg-slate-100 rounded-lg p-3'}
          onChange={handleChange}
        />
        <input
          type="password"
          id={'password'}
          placeholder={'Password'}
          className={'bg-slate-100 rounded-lg p-3'}
          onChange={handleChange}
        />
        <button
          className={
            'bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70'
          }
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className={'flex justify-between mt-5'}>
        <span className={'text-red-700 cursor-pointer'} onClick={handleDeleteAccount}>
          Delete Account
        </span>
        <span className={'text-red-700 cursor-pointer'} onClick={handleSignoutAccount}>
          Sign out
        </span>
      </div>
      <p className={'text-red-700 mt-5'}>{error && 'Something went wrong!'}</p>
      <p className={'text-green-700 mt-5'}>
        {updateSuccess && 'User updated successfully'}
      </p>
    </div>
  );
};
