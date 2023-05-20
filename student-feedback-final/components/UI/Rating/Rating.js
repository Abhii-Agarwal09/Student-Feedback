// Documentation

/**
 *
 * Brief: Rating Component used for Rating using stars.
 * Uses: It is either used
 *  (1) To take value from user OR
 *  (2) To display a fixed & unalterable rating to the user
 *
 * Case (1) : To take value from user =>
 *  Brief : 5 stars are displayed and user has to select a star to rate.
 *
 *  How to use? : To save/use the recieved value "returnValue" attribute
 *  must be used in the Parent component and it must POINT to a FUNCTION
 *  that will be used to save that value.
 *
 *  Snippet :
 *  const [value, setValue] = useState(0);
 *  const recieveRating = (data) => {
 *    setValue(data);
 *  };
 *  return (
 *    <>
 *      <Rating returnValue={recieveRating} />
 *    </>
 *  );
 *
 *  Case (2) : To display a fixed & unalterable
 *  rating to the user =>
 *
 *  Brief: To show a disabled Rating Component with some value.
 *
 *  How to use? : To display a disabled Component "isDisabled" attribute
 *  must be set to "true" AND desired value to be shown should be passed
 *  in "sentValue" attribute. For example, following snippet will display
 *  4 stars.
 *
 *  Snippet :
 *  return (
 *    <>
 *      <Rating isDisabled={true} sentValue={4} />
 *    </>
 *  );
 *
 *
 */

// React Imports
import { useState, useEffect } from 'react';

// CSS Imports
import cls from './Rating.module.css';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

// Icon Imports
import StarIcon from '../../../icons/StarIcon';

const Rating = ({ returnValue, isDisabled, sentValue }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [largeBool, setLargeBool] = useState({ large: false, largeId: null });

  const values = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (isDisabled && sentValue) {
      setRating(sentValue);
    }
    if (sentValue === 0) {
      setRating(0);
      setHover(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentValue]);

  const handleMouseEnter = (e) => {
    if (!isDisabled) {
      setHover(e.target.id);
      setLargeBool(() => {
        return { large: true, largeId: e.target.id };
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isDisabled) {
      setHover(null);
      setLargeBool(() => {
        return { large: false, largeId: null };
      });
    }
  };

  return (
    <>
      <section className={cls.ratingComponent}>
        {values.map((item) => {
          return (
            <label key={item}>
              <input
                type="radio"
                disabled={isDisabled ? true : false}
                className={cls.radio}
                name="rating"
                value={item}
                onClick={() => {
                  if (!isDisabled) {
                    setRating(item);
                    returnValue(item);
                  }
                }}
              />
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cls.star}
              >
                <StarIcon
                  id={item}
                  isEnlarged={largeBool}
                  color={
                    item <= (hover || rating)
                      ? colors.starActive
                      : colors.starInactive
                  }
                />
              </div>
            </label>
          );
        })}
      </section>
    </>
  );
};

export default Rating;
