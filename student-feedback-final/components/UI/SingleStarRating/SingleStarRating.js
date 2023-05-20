// React Imports
import { useState, useEffect } from 'react';

// CSS Imports
import cls from './SingleStarRating.module.css';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

// Icon Imports
import StarIcon from '../../../icons/StarIcon';

const SingleStarRating = ({ number }) => {
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    if (number === 0) {
      setBgColor(colors.ratingNull);
    } else if (number > 0 && number <= 2) {
      setBgColor(colors.ratingRed);
    } else if (number > 2 && number < 4) {
      setBgColor(colors.ratingYellow);
    } else if (number >= 4 && number <= 5) {
      setBgColor(colors.ratingGreen);
    }
  }, [number]);

  return (
    <>
      <div
        style={{ backgroundColor: bgColor, transition: 'all 0.3s' }}
        className={cls.singleStar}
      >
        <div className={cls.number}>{number}</div>
        <StarIcon
          color={colors.white}
          isEnlarged={{ large: false, largeId: null }}
        />
      </div>
    </>
  );
};

export default SingleStarRating;
