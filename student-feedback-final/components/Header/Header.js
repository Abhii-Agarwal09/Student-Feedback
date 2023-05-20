// Next Imports
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

// React Imports
import { useState, useEffect, useContext } from 'react';

// Third party Imports
import axios from 'axios';

// Firebase Imports
import '../../firebase/firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

// Student Context
import { StudentContext } from '../../context/studentContext';

// UI Component Imports
import GeneralModal from '../UI/GeneralModal/GeneralModal';
import GeneralPopOver from '../UI/GeneralPopOver/GeneralPopOver';
import LoadingModal from '../UI/LoadingModal/LoadingModal';

// Chakra UI Imports
import { Button } from '@chakra-ui/react';

// CSS Imports
import cls from './Header.module.css';

// CSS as JSON Imports
import colors from '../../styles/variables.json';

// Asset Imports
import Logo from '../../public/assets/Logo.svg';

const provider = new GoogleAuthProvider();
const auth = getAuth();

const Header = () => {
  // Router
  const router = useRouter();

  // States
  const [user, setUser] = useContext(StudentContext);

  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    photo: '',
  });

  // const [loggedIn, setLoggedIn] = useState(false);

  const [postUserData, setPostUserData] = useState({
    displayName: '',
    email: '',
  });

  const [invalidEmail, setInvaildEmail] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [loginConditionalRendering, setLoginConditionalRendering] =
    useState(null);

  const [isBanned, setIsBanned] = useState(false);

  // Functions

  // post user data to backend to create student and login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const postData = async (payload) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}login`,
        payload,
        {
          headers: {
            authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (
        res.data.success === false &&
        res.data.message ===
          'You are banned from this website because of too many spam comments'
      ) {
        setIsBanned(true);
        logout();
        router.replace('/');
      } else if (res.data.success === true) {
        setUser(() => {
          return {
            displayName: userData.displayName,
            email: userData.email,
            photoURL: userData.photo,
            loggedIn: true,
          };
        });
        localStorage.setItem('token', JSON.stringify(res.data.token));
        // setLoggedIn(true);
        setIsLoading(false);
        // console.log('push karunga');
        router.push('/feedback');
      }
    };
    if (postUserData.displayName.length > 0 && postUserData.email.length > 0) {
      postData(postUserData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUserData]);

  // email regex

  const emailRegex = (input) => {
    let regex = /([a-zA-Z]+(\.[0-9a-zA-Z]+)+)+@vitstudent\.ac\.in/gm;
    return regex.test(input);
  };

  const login = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;

        // const isEmailVaild = emailRegex(email);
        setUserData(() => {
          return {
            displayName: displayName,
            email: email,
            photo: photoURL,
          };
        });

        setPostUserData((prevState) => {
          return {
            ...prevState,
            displayName,
            email,
          };
        });
      })
      .catch((err) => console.log(err));
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUserData((prevState) => {
          return {
            ...prevState,
            displayName: '',
            email: '',
            photo: '',
          };
        });
        // setLoggedIn(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser({
          displayName: '',
          email: '',
          photoURL: '',
          loggedIn: false,
        });
        router.push('/');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    !user.loggedIn
      ? setLoginConditionalRendering(
          <Button
            onClick={login}
            colorScheme="teal"
            variant="outline"
            color={colors.bgPrimary}
          >
            Login
          </Button>
        )
      : setLoginConditionalRendering(
          <>
            <GeneralPopOver
              header="Logout?"
              body="Are you sure you want to log out?"
              callback={logout}
            >
              <div className={cls.groupingContainer}>
                <div className={cls.userImageContainer}>
                  <Image
                    src={user.photoURL}
                    alt={user.displayName}
                    width={32}
                    height={32}
                    className={cls.userImage}
                  />
                </div>
                {user.displayName.split(' ')[0]}
              </div>
            </GeneralPopOver>
          </>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.loggedIn]);

  return (
    <>
      <div className="container">
        <header className={cls.header}>
          <div className={cls.headerItem}>
            <Image
              src={Logo}
              alt="logo"
              draggable={false}
              className={cls.logo}
            />
          </div>
          <div className={cls.headerItem}>{loginConditionalRendering}</div>
          <GeneralModal
            header="Error!"
            body="Please login with your University Email ID."
            isOpen={invalidEmail}
            callback={() => setInvaildEmail(false)}
          />
          <LoadingModal
            header={'Logging In'}
            isOpen={false}
            isButtonShown={false}
            callback={() => {
              setIsLoading(false);
              // login();
            }}
          />
          <GeneralModal
            header="Banned"
            body="You are banned from this website because of too many spam comments."
            isOpen={isBanned}
            callback={() => {
              setIsBanned(false);
              setIsLoading(false);
            }}
          />
        </header>
      </div>
    </>
  );
};

export default Header;
