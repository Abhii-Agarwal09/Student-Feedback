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
import FacultyNotFound from '../FacultyNotFound/FacultyNotFound';

// Context import
import { StudentContext } from '../../context/studentContext';

// UI Component Imports
import Comments from '../UI/Comments/Comments';
import OverallRating from '../UI/OverallRating/OverallRating';
import Rating from '../UI/Rating/Rating';
import ReviewCard from '../UI/ReviewCard/ReviewCard';
import LoadingModal from '../UI/LoadingModal/LoadingModal';
import FacultyData from '../UI/FacultyData/FacultyData';

// CSS Imports
import cls from './SearchResult.module.css';

// Asset Imports
import backgroundImage from '../../public/assets/Faculty-BG.svg';
import AdComp from '../AdComp/AdComp';

const SearchResult = () => {
  const router = useRouter();

  const [user] = useContext(StudentContext);

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

  // faculty data set
  const [getRequestData, setGetRequestData] = useState({
    name: "Teacher's Name",
    school: "Teacher's School",
    courseCode: 'Course Code',
    teaching: 0,
    leniency: 0,
    notes: 0,
    friendliness: 0,
    lab: 0,
    internalAssessments: 0,
    overallRating: 0,
    comments: [
      {
        comment: 'Comments will be shown once you search for Faculties',
      },
    ],
  });

  const [calculatedOverallRating, setCalculatedOverallRating] = useState(0);

  // Boolean State used OPEN/CLOSE Loading Modal
  const [isLoading, setIsLoading] = useState(false);

  const getFeedbacks = async (facutlyAndCourseData) => {
    // make request to server and fetch feedbacks
    // sample facutlyAndCourseData -> COURSECODE-COURSENAME-FACULTYNAME-SCHOOL
    const facDetailsArray = facutlyAndCourseData.split('_');
    const facDetailsObject = {
      facultyName: facDetailsArray[2],
      courseCode: facDetailsArray[0],
    };

    // TODO: Make axios request to server to get feedbacks
    const token = JSON.parse(localStorage.getItem('token'));

    //Showing Loading Screen
    setIsLoading(true);

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}reviews?facultyName=${facDetailsObject.facultyName}&courseCode=${facDetailsObject.courseCode}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const recievedData = res.data.data;

    setGetRequestData({
      name: recievedData.name,
      school: recievedData.school,
      courseCode: recievedData.courseCode,
      teaching: recievedData.teaching,
      leniency: recievedData.leniency,
      notes: recievedData.notes,
      friendliness: recievedData.friendliness,
      lab: recievedData.lab,
      internalAssessments: recievedData.internalAssessments,
      overallRating: recievedData.overallRating,
      comments: recievedData.comments,
    });

    if (
      recievedData.leniency === 0 &&
      recievedData.lab === 0 &&
      recievedData.internalAssessments === 0
    ) {
      let num =
        (recievedData.teaching +
          recievedData.notes +
          recievedData.friendliness) /
        3;
      setCalculatedOverallRating(num);
    } else {
      let num =
        (recievedData.teaching +
          recievedData.notes +
          recievedData.friendliness +
          recievedData.leniency +
          recievedData.lab +
          recievedData.internalAssessments) /
        6;
      setCalculatedOverallRating(num);
    }
    setIsLoading(false);
  };

  const reviewCardData = [
    { id: 1, heading: 'Teaching', number: getRequestData.teaching },
    { id: 2, heading: 'Leniency', number: getRequestData.leniency },
    { id: 3, heading: 'Notes', number: getRequestData.notes },
    { id: 4, heading: 'Friendliness', number: getRequestData.friendliness },
    { id: 5, heading: 'Lab', number: getRequestData.lab },
    {
      id: 6,
      heading: 'Internal Assessments',
      number: getRequestData.internalAssessments,
    },
  ];

  // General Function to ROUND float to 1 decimal places.
  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  return (
    <>
      <div className="container">
        <main>
          <div className={cls.headerContainer}>
            <Header />
          </div>

          <SearchMenu studentName={user.displayName} onSubmit={getFeedbacks} />

          {/* <div>
            <div>Faculty Name: {getRequestData.name}</div>
            <div>Course Name: </div>
            <div>School Name: {getRequestData.school}</div>
          </div> */}

          <div>
            <FacultyData
              leftHeading={'Faculty Name'}
              leftHeadingData={getRequestData.name}
              middleHeading={'Course Code'}
              middleHeadingData={getRequestData.courseCode}
              rightHeading={'School Name'}
              rightHeadingData={getRequestData.school}
            />
          </div>

          <OverallRating number={round(calculatedOverallRating, 1)} />

          <div className={cls.cardContainer}>
            {reviewCardData.map((item) => {
              return (
                <div className={cls.innerCardContainer} key={item.id}>
                  <ReviewCard
                    heading={item.heading}
                    number={round(item.number, 1)}
                  >
                    <Rating
                      isDisabled={true}
                      sentValue={round(item.number, 1)}
                    />
                  </ReviewCard>
                </div>
              );
            })}
          </div>

          <div className={cls.commentSection}>
            <h1 className={cls.commentHeading}>COMMENTS</h1>
            {getRequestData.comments.map((item) => {
              return (
                <>
                  <Comments>{item.comment}</Comments>
                </>
              );
            })}
          </div>

          <FacultyNotFound />

          {/* Ads Component */}
          <div>
            {/* <AdComp /> */}
          </div>
        </main>

        <LoadingModal
          header={'Finding Feedbacks...'}
          isOpen={isLoading}
          callback={() => {}}
          isButtonShown={false}
        />
      </div>
    </>
  );
};

export default SearchResult;
