/**
 * UI Component used to Post Faculty Feedback
 */

// Next Imports
import Image from 'next/image';
import { useRouter } from 'next/router';

// React Imports
import { useState, useEffect, useContext } from 'react';

// Third part imports
import axios from 'axios';

// Component Imports
import Header from '../Header/Header';
import SearchMenu from '../SearchMenu/SearchMenu';
import FacultyNotFound from '../FacultyNotFound/FacultyNotFound';

// Context import
import { StudentContext } from '../../context/studentContext';

// UI Component Imports
import OverallRating from '../UI/OverallRating/OverallRating';
import Rating from '../UI/Rating/Rating';
import ReviewCard from '../UI/ReviewCard/ReviewCard';
import GeneralModal from '../UI/GeneralModal/GeneralModal';
import LoadingModal from '../UI/LoadingModal/LoadingModal';

// Chakra UI Imports
import { Textarea } from '@chakra-ui/react';

// CSS Imports
import cls from './PostFeedback.module.css';

// Asset Imports
import backgroundImage from '../../public/assets/Faculty-BG.svg';

const PostFeedback = () => {
  let isOk;

  // Next Router
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

  /**
   * State to display modal-message once user has successfully
   * clicked on "SUBMIT" button after filling the review.
   * Displays SUCCESSFUL is review is posted successfully.
   * Else it diplays UNSUCCESSFUL message.
   */
  const [modalMessage, setModalMessage] = useState({
    header: '',
    body: '',
  });

  const [loadingMessage, setLoadingMessage] = useState('Posting feedback...');

  // Retrieving USER from context.
  const [user, setUser] = useContext(StudentContext);

  // Main State used to store Review Data
  const [ratingData, setRatingData] = useState({
    leniency: 0,
    teaching: 0,
    notes: 0,
    friendliness: 0,
    lab: 0,
    internalAssessments: 0,
    comment: '',
  });

  /**
   * State used to Calculate OVERALL RATING from
   * "ratingData" state.
   */
  const [overallRating, setOverallRating] = useState(0);

  // Boolean state used to OPEN/CLOSE Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Boolean State used to redirect user to DASHBOARD
   * if his review is posted successfully.
   */
  const [routeBackToDashboard, setRouteBackToDashboard] = useState(false);

  // Boolean State used OPEN/CLOSE Loading Modal
  const [isLoading, setIsLoading] = useState(false);

  // warning modal
  useEffect(() => {
    setIsModalOpen(true);
    setModalMessage((prevState) => {
      return {
        ...prevState,
        header: '⚠️⚠️ Warning ⚠️⚠️',
        body: 'Kindly refrain from using foul language in the comments, as you may get banned from the website, and you will not be able to see reviews again',
      };
    });
  }, []);

  // State Updating function of TEACHING Data
  const teachingRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        teaching: data,
      };
    });
  };

  // State Updating function of LENIENCY Data
  const leniencyRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        leniency: data,
      };
    });
  };

  // State Updating function of NOTES Data
  const notesRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        notes: data,
      };
    });
  };

  // State Updating function of FRIENDLINESS Data
  const friendlinessRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        friendliness: data,
      };
    });
  };

  // State Updating function of LAB Data
  const labRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        lab: data,
      };
    });
  };

  // State Updating function of INTERNAL ASSESSMENT Data
  const internalAssessmentsRating = (data) => {
    setRatingData(() => {
      return {
        ...ratingData,
        internalAssessments: data,
      };
    });
  };

  // State Updating function for COMMENTS
  const commentChangeHandler = (e) => {
    setRatingData(() => {
      return {
        ...ratingData,
        comment: e.target.value,
      };
    });
  };

  // General Function to ROUND float to 1 decimal places.
  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  /**
   * SideEffect function used to display OVERALL RATING
   *
   * 1) "ratingData"'s values are extracted into an
   * array called "values". Last index being COMMENT is popped.
   *
   * 2) Sum of the values is calculated from
   * "values" array and is stored in "rating" variable.
   *
   * 3) "overallRating" is set using its corresponding
   * state updating function.
   *
   * 4) This SideEffect function is called everytime
   * "ratingData" is changed.
   */
  useEffect(() => {
    const values = Object.values(ratingData);
    values.pop();
    let rating = values.reduce((acc, val) => {
      return acc + val;
    }, 0);

    setOverallRating(round(rating / values.length, 1));
  }, [ratingData]);

  // Function To POSTFEEDBACK
  const postFeedback = async (facutlyAndCourseData) => {
    // sample facutlyAndCourseData -> COURSECODE-COURSENAME-FACULTYNAME-SCHOOL

    // "ratingData" values are extracted and stored in "parameters"
    const parameters = Object.values(ratingData);

    parameters.forEach((param) => {
      if (param === 0 || param.length === 0) {
        isOk = false;
      }
    });

    if (isOk === false) {
      // show error
      setIsModalOpen(true);
      setModalMessage((prevState) => {
        return {
          ...prevState,
          header: 'Error ❌',
          body: 'Please do not leave any field empty',
        };
      });
      // router.reload();
    } else {
      // Last index being COMMENT is popped
      parameters.pop();

      // Sample Search String is SPLIT on "-" and stored in "facDetailsArray"
      const facDetailsArray = facutlyAndCourseData.split('_');

      /**
       * Values from "facDetailsArray" is stored
       * in "feedbackData" object in the form required
       * by the Backend server.
       */
      const feedbackData = {
        facultyName: facDetailsArray[2],
        school: facDetailsArray[3],
        courseCode: facDetailsArray[0],
        courseName: facDetailsArray[1],
        comment: ratingData.comment,
        parameters,
      };
      // console.log('Ye review data bejunga: ', feedbackData);
      // Token extraction from LocalStorage
      const token = JSON.parse(localStorage.getItem('token'));
      // <-- POST REQUEST TO BACKEND SERVER -->
      //Showing Loading Screen
      setIsLoading(true);

      setTimeout(() => {
        setLoadingMessage(
          'Checking your comment for Spam Detection. This may take a while...'
        );
      }, 1500);

      //Posting Data and Waiting for response
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}reviews`,
        feedbackData,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      // Checking if the user is banned or not
      if (
        res.data.success === false &&
        res.data.message ===
          'You are banned from this website because of too many spam comments'
      ) {
        // If he is clearing localStorage and context
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser({
          displayName: '',
          email: '',
          photoURL: '',
          loggedIn: false,
        });
        // Routing back to homepage.
        router.replace('/');
      }
      // console.log(res.data.success);
      // Checking if comment is foul or not
      if (
        res.data.success === false &&
        res.data.message ===
          'Review not posted because of foul language in the comment! Kindly refrain from doing so'
      ) {
        // If it is foul Opening Modal to display errors.
        setIsModalOpen(true);
        setModalMessage((prevState) => {
          return {
            ...prevState,
            header: 'Error ❌',
            body: 'Review not posted because of foul language in the comment! Kindly refrain from doing so',
          };
        });
      }
      // console.log('Ye review post karne ka result: ', res);
      // Showing modal for review posted successfully
      // if review posted -> redirect to dashboard, else if error stay here
      //Opening Modal to display SUCCESS or ERROR
      setIsModalOpen(true);
      //Closing Loading Screen
      setIsLoading(false);
      //Setting Modal Data
      if (res.data.success === true) {
        // show success modal, and on closing modal, redirect to dashboard
        setModalMessage((prevState) => {
          return {
            ...prevState,
            header: 'Successful ✅',
            body: 'Yayy! Your review has been posted successfully',
          };
        });
        // Setting Routing Boolean to true
        setRouteBackToDashboard(true);
      }
      // else {
      //   // show error modal and stay there on closing the modal
      //   setModalMessage((prevState) => {
      //     return {
      //       ...prevState,
      //       header: 'Error ❌',
      //       body: 'Oops! Your review was not posted...try again 😄',
      //     };
      //   });

      //   // Setting Routing Boolean to false
      //   setRouteBackToDashboard(false);
      // }
      // Clearing data after POST Attempt
      setRatingData({
        leniency: 0,
        teaching: 0,
        notes: 0,
        friendliness: 0,
        lab: 0,
        internalAssessments: 0,
        comment: '',
      });
    }
  };

  return (
    <>
      <div className="container">
        <main>
          <div className={cls.headerContainer}>
            <Header />
          </div>

          <SearchMenu
            // feedbackData={ratingData}
            studentName={user.displayName}
            buttonText={'Submit'}
            onSubmit={postFeedback}
          />

          {/* <FacultyData
            leftHeading={'Faculty Name'}
            leftHeadingData={getRequestData.name}
            middleHeading={'Course Code'}
            middleHeadingData={getRequestData.courseCode}
            rightHeading={'School Name'}
            rightHeadingData={getRequestData.school}
          /> */}

          <OverallRating number={overallRating} />

          <div className={cls.cardContainer}>
            <div className={cls.innerCardContainer}>
              <ReviewCard heading={'Teaching'} number={ratingData.teaching}>
                <Rating returnValue={teachingRating} />
              </ReviewCard>
            </div>

            <div className={cls.innerCardContainer}>
              <ReviewCard heading={'Leniency'} number={ratingData.leniency}>
                <Rating returnValue={leniencyRating} />
              </ReviewCard>
            </div>

            <div className={cls.innerCardContainer}>
              <ReviewCard heading={'Notes'} number={ratingData.notes}>
                <Rating returnValue={notesRating} />
              </ReviewCard>
            </div>

            <div className={cls.innerCardContainer}>
              <ReviewCard
                heading={'Friendliness'}
                number={ratingData.friendliness}
              >
                <Rating returnValue={friendlinessRating} />
              </ReviewCard>
            </div>

            <div className={cls.innerCardContainer}>
              <ReviewCard heading={'Lab'} number={ratingData.lab}>
                <Rating returnValue={labRating} />
              </ReviewCard>
            </div>

            <div className={cls.innerCardContainer}>
              <ReviewCard
                heading={'Internal Assessments'}
                number={ratingData.internalAssessments}
              >
                <Rating returnValue={internalAssessmentsRating} />
              </ReviewCard>
            </div>
          </div>

          <Textarea
            onChange={commentChangeHandler}
            placeholder="Add your Comments here (Remember not to spam)"
          />

          <FacultyNotFound />
        </main>

        <GeneralModal
          header={modalMessage.header}
          body={modalMessage.body}
          isOpen={isModalOpen}
          callback={() => {
            setIsModalOpen(false);
            // Routing to dashboard if Review is Posted Successfully
            if (routeBackToDashboard === true) {
              router.push('/feedback');
            } else if (isOk === false) {
              router.reload();
            }
          }}
        />

        <LoadingModal
          header={loadingMessage}
          isOpen={isLoading}
          callback={() => {}}
          isButtonShown={false}
        />
      </div>
    </>
  );
};

export default PostFeedback;
