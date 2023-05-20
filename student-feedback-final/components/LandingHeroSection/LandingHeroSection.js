// Next Imports
import Image from 'next/image';
import { useRouter } from 'next/router';

// React Imports
import { useEffect, useContext } from 'react';

// Student Context
import { StudentContext } from '../../context/studentContext';

// Component Imports
import Header from '../Header/Header';

// UI Component Imports
import SearchBar from '../UI/SearchBar/SearchBar';

// CSS Imports
import cls from './LandingHeroSection.module.css';

// Assest Imports
import backgroundImage from '../../public/assets/Landing-BG.svg';
import { Component } from 'react';

const LandingHeroSection = () => {
  // Router
  const router = useRouter();

  // States
  const [user, setUser] = useContext(StudentContext);

  useEffect(() => {
    // console.log('Landing useEffect run: ');
    // console.log(user);
    if (user.loggedIn) {
      // console.log('logged in h and dubara dashboard bhej raha');
      router.push('/feedback');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="container">
        {/* Background Image */}
        <Image
          src={backgroundImage}
          alt="background image"
          layout="raw"
          draggable="false"
          className={cls.backgroundImage}
        />
        <main className={cls.heroSection}>
          <div className={cls.headerContainer}>
            <Header />
          </div>
          <div className={cls.groupingContainer}>
            <h1 className={cls.heading}>Welcome to Student Feedback</h1>
            <p className={cls.description}>
              Confused about which faculty to pick? It definitely has to be
              <strong> someone who sets easy paper</strong>. Don&apos;t worry,
              we&apos;ve got you covered. You will get all the nitty gritties of
              faculty here.
            </p>
          </div>
          {/* <div className={cls.searchBarContainer}>
            <SearchBar />
          </div> */}
        </main>
      </div>
    </>
  );
};

export default LandingHeroSection;
