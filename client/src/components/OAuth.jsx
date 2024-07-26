import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { Login } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../utils";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

    const res  = await apiRequest({
      url: "/auth/google",
      method: "POST",
      data: result
     });
     const data = {token: res?.token, ...res?.newUser};
    //  console.log(res?.newUser)
      dispatch(Login(data));
      navigate('/');
    } catch (error) {   
      console.log('could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}