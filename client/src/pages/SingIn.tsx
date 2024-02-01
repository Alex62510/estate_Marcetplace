import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { OAuth } from '../components/OAuth';

export const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state: RootState) => state.user);

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className={'p-3 max-w-lg mx-auto'}>
      <h1 className={'text-3xl text-center font-semibold my-7'}>Sign In</h1>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={'Email'}
          id={'email'}
          className={'border bg-slate-50 p-3 rounded-lg'}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder={'Password'}
          id={'password'}
          className={'border bg-slate-50 p-3 rounded-lg'}
          onChange={handleChange}
        />
        <button
          className={'bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80'}
          disabled={loading}
        >
          {loading ? 'Loading...' : ' Sign In'}
        </button>
        <OAuth />
      </form>
      <div className={'flex gap-2 mt-5'}>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className={'text-blue-500'}>Sign up</span>
        </Link>
      </div>
      <p className={'text-red-700 mt-5'}>
        {typeof error === 'string'
          ? error
          : typeof error === 'object' && error
            ? error.message || 'Something went wrong'
            : ''}
      </p>
    </div>
  );
};
