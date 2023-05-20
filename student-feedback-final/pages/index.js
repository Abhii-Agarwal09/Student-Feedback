// Next import
import { useRouter } from 'next/router';

// React import
import { useEffect, useContext } from 'react';

// Student context
import StudentContext from '../context/studentContext';

// Component Imports
import LandingHeroSection from '../components/LandingHeroSection/LandingHeroSection';
import AdComp from '../components/AdComp/AdComp';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      // const token = JSON.parse(localStorage.getItem('token')) || '';
      // const user = JSON.parse(localStorage.getItem('user')) || '';

      let token = localStorage.getItem('token');
      let user = localStorage.getItem('user');

      if (!user || !token) {
        router.replace('/');
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <LandingHeroSection />
      {/* <AdComp /> */}
    </>
  );
}
