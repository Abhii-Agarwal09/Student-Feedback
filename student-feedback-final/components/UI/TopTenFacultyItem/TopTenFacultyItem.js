// UI Component Imports
import SingleStarRating from '../SingleStarRating/SingleStarRating';

// CSS Imports
import cls from './TopTenFacultyItem.module.css';

const TopTenFacultyItem = ({ rank, name, number }) => {
  return (
    <>
      <div className={cls.groupingContainer}>
        <div className={cls.rank}>{rank}</div>
        <div className={cls.name}>{name}</div>
        <div className={cls.overallRating}>
          OVERALL RATING:
          <SingleStarRating number={number} />
        </div>
      </div>
    </>
  );
};

export default TopTenFacultyItem;
