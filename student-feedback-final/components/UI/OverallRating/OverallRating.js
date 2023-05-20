// UI Component Imports
import Rating from '../Rating/Rating';
import SingleStarRating from '../SingleStarRating/SingleStarRating';

// CSS Imports
import cls from './OverallRating.module.css';

const OverallRating = ({ number }) => {
  return (
    <>
      <div className={cls.overallRating}>
        <SingleStarRating number={number} />
        <h1 className={cls.heading}>OVERALL RATING:</h1>
        <div className={cls.ratingContainer}>
          <Rating isDisabled={true} sentValue={number} />
        </div>
      </div>
    </>
  );
};

export default OverallRating;
