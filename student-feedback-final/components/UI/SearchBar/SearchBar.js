// React Imports
import { useState, useEffect } from 'react';

// Data Import
import facultyData from '../../../data/facultyData';
import onlyCourseData from '../../../data/only-course-data';

// Chakra UI Imports
import { Button } from '@chakra-ui/react';

// UI Component Imports
import Btn from '../Button/Btn';
import GeneralModal from '../GeneralModal/GeneralModal';

// Custom Hook Imports
import useWindowSize from '../../../hooks/useWindowSize';

// CSS Imports
import cls from './SearchBar.module.css';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

const SearchBar = ({ onSubmit, buttonText, feedbackData, onlyCourse }) => {
  const size = useWindowSize();

  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    size.width <= 768 ? setFontSize('0.8rem') : setFontSize('1rem');
  }, [size.width]);

  const data = onlyCourse === true ? onlyCourseData : facultyData;

  const [placeholder, setPlaceholder] = useState();

  useEffect(() => {
    onlyCourse === true
      ? setPlaceholder('Enter Course Code')
      : setPlaceholder('Enter Faculty Name');
  }, [onlyCourse]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.label.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // if wordEntered not in any of the array
    let isOk;
    if (onlyCourse === true) {
      const found = onlyCourseData.find((data) => data.label === wordEntered);
      // console.log(found);
      if (found === undefined) {
        // show error modal. detail not valid
        // console.log('inside if');
        setIsModalOpen(true);
        setFilteredData([]);
        setWordEntered('');
      } else {
        isOk = true;
      }
    } else {
      const found = facultyData.find((data) => data.label === wordEntered);
      // console.log(found);
      if (found === undefined) {
        // show error modal. detail not valid
        // console.log('inside if');
        setIsModalOpen(true);
        setFilteredData([]);
        setWordEntered('');
      } else {
        isOk = true;
      }
    }
    // console.log(true);
    if (isOk === true) {
      // console.log('inside sending req');
      onSubmit(wordEntered);
      setFilteredData([]);
      setWordEntered('');
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={cls.formGroup}>
        <div className={cls.groupingContainer}>
          <input
            type="search"
            className={cls.search}
            placeholder={placeholder}
            onChange={handleFilter}
            value={wordEntered}
          />
          {filteredData.length !== 0 && (
            <div className={cls.dataResultContainer}>
              {filteredData.slice(0, 15).map((value, key) => {
                return (
                  <p
                    key={key}
                    className={cls.dataResult}
                    onClick={() => {
                      setWordEntered(value.label);
                      setFilteredData([]);
                    }}
                  >
                    {value.label}{' '}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <div className={cls.buttonContainer}>
          <Button
            type={'submit'}
            backgroundColor={colors.bgPrimary}
            _hover={{ backgroundColor: colors.bgPrimaryHover }}
            color={colors.white}
            width={'100%'}
            fontSize={fontSize}
          >
            {buttonText}
          </Button>
        </div>
      </form>
      <GeneralModal
        header={'Error'}
        body={'Please enter valid course details.'}
        isOpen={isModalOpen}
        callback={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default SearchBar;
