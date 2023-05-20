// Next Imports
import Image from 'next/image';
import { useRouter } from 'next/router';

// React Imports
import { useState, useEffect, useContext } from 'react';

// Third Party Imports
import axios from 'axios';

// Component Imports
import Header from '../Header/Header';
import SearchMenu from '../SearchMenu/SearchMenu';

// Context import
import { StudentContext } from '../../context/studentContext';

// UI Component Imports
import SingleStarRating from '../UI/SingleStarRating/SingleStarRating';
import TopTenFacultyItem from '../UI/TopTenFacultyItem/TopTenFacultyItem';
import LoadingModal from '../UI/LoadingModal/LoadingModal';
import FacultyData from '../UI/FacultyData/FacultyData';

// CSS Imports
import cls from './TopTenFaculty.module.css';

// Asset Imports
import backgroundImage from '../../public/assets/Faculty-BG.svg';

const TopTenFaculty = () => {
  const [user] = useContext(StudentContext);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      const token = JSON.parse(localStorage.getItem('token'));
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !token) {
        router.replace('/');
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [topFacultyData, setTopFacultyData] = useState({
    courseCode: '',
    courseName: '',
    faculties: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const postTopFacultyData = async (data) => {
    const token = JSON.parse(localStorage.getItem('token'));

    setIsLoading(true);

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}reviews/top?courseName=${data.courseName}&courseCode=${data.courseCode}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    // console.log(res);

    setIsLoading(false);

    if (res.data.success === true) {
      const recievedData = res.data.data;
      setTopFacultyData(() => {
        return {
          courseCode: recievedData.courseCode,
          courseName: recievedData.courseName,
          faculties: recievedData.faculties,
        };
      });
    }
  };

  useEffect(() => {
    // console.log(topFacultyData);
  }, [topFacultyData]);

  const findTopTenFaculty = (courseDetails) => {
    // make request to server and find top 10 faculties for the given course
    const courseDetailsArray = courseDetails.split('_');
    const courseDetailsObject = {
      courseCode: courseDetailsArray[0],
      courseName: courseDetailsArray[1],
    };
    // TODO: Make request to backend to fetch top 10 faculty
    postTopFacultyData(courseDetailsObject);
  };

  return (
    <>
      <div className="container">
        <main>
          <div className={cls.headerContainer}>
            <Header />
          </div>

          <SearchMenu
            studentName={user.displayName}
            buttonText={'Search'}
            onSubmit={findTopTenFaculty}
            onlyCourse={true}
          />

          {topFacultyData.courseName.length > 0 && (
            <FacultyData
              leftHeading={'Course Name'}
              leftHeadingData={topFacultyData.courseName}
              middleHeading={'Course Code'}
              middleHeadingData={topFacultyData.courseCode}
              rightHeading={'Total Faculties'}
              rightHeadingData={topFacultyData.faculties.length}
            />
          )}
          <div className={cls.topTenFacultyListContainer}>
            {topFacultyData.faculties &&
              topFacultyData.faculties.map((faculty, index) => {
                if (index < 10) {
                  return (
                    <TopTenFacultyItem
                      key={index}
                      name={faculty.name}
                      rank={index + 1}
                      number={faculty.overallRating.toFixed(1)}
                    />
                  );
                }
              })}
          </div>
        </main>
      </div>

      <LoadingModal
        header={'Finding Top Faculties...'}
        isOpen={isLoading}
        callback={() => {}}
        isButtonShown={false}
      />
    </>
  );
};

export default TopTenFaculty;
