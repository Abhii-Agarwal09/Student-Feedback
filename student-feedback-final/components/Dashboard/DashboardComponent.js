// Next Imports
import Image from 'next/image';
import { useRouter } from 'next/router';

// React Imports
import { useState, useEffect, useContext } from 'react';

// Component Imports
import Header from '../Header/Header';
import SearchMenu from '../SearchMenu/SearchMenu';
import FacultyNotFound from '../FacultyNotFound/FacultyNotFound';

// Context import
import { StudentContext } from '../../context/studentContext';

// UI Component Imports
import Comments from '../UI/Comments/Comments';
import OverallRating from '../UI/OverallRating/OverallRating';
import Rating from '../UI/Rating/Rating';
import ReviewCard from '../UI/ReviewCard/ReviewCard';

// CSS Imports
import cls from './DashboardComponent.module.css';

// Asset Imports
import backgroundImage from '../../public/assets/Faculty-BG.svg';

const DashboardComponent = () => {
  const router = useRouter();

  const [user, setUser] = useContext(StudentContext);
  useEffect(() => {
    if (!user.loggedIn) {
      // console.log('dashboard se / bej raha hu');
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // faculty data set

  return (
    <>
      <div className="container">
        <main>
          <div className={cls.headerContainer}>
            <Header />
          </div>

          <SearchMenu studentName={user.displayName} />

          <h1>TODO: Show Posted Reviews</h1>
        </main>
      </div>
    </>
  );
};

export default DashboardComponent;
