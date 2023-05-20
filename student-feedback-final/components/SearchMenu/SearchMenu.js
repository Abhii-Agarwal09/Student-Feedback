// Next imports
import { useRouter } from 'next/router';

// UI Component Imports
import Btn from '../UI/Button/Btn';
import SearchBar from '../UI/SearchBar/SearchBar';

// CSS Imports
import cls from './SearchMenu.module.css';

const SearchMenu = ({
  studentName,
  feedbackData,
  buttonText,
  onSubmit,
  onlyCourse,
}) => {
  const router = useRouter();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  let name = studentName.split(' ')[0].toLowerCase();

  return (
    <>
      <h1 className={cls.heading}>Hey {capitalizeFirstLetter(name)}</h1>
      <p className={cls.description}>
        Search and Post feedback of your favourite faculties
      </p>

      <div className={cls.buttonGroup}>
        <div className={cls.buttonContainer}>
          <Btn onClick={() => router.push('/feedback')}>View Feedback</Btn>
        </div>
        <div className={cls.buttonContainer}>
          <Btn onClick={() => router.replace('/feedback/new')}>
            Post FeedBack
          </Btn>
        </div>
        <div className={cls.buttonContainer}>
          <Btn onClick={() => router.replace('/feedback/top')}>
            Top Faculties
          </Btn>
        </div>
      </div>
      <div className={cls.formControl}>
        <div className={cls.searchBarContainer}>
          <SearchBar
            feedbackData={feedbackData}
            buttonText={buttonText ? buttonText : 'Search'}
            onSubmit={onSubmit}
            onlyCourse={onlyCourse}
          />
        </div>
      </div>
    </>
  );
};

export default SearchMenu;
