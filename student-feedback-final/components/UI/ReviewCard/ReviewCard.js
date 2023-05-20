// UI Components Imports
import SingleStarRating from '../SingleStarRating/SingleStarRating';

// CSS Imports
import cls from './ReviewCard.module.css';

const ReviewCard = ({ heading, number, children }) => {
  let calculatedValue = 0;

  return (
    <>
      <section className={cls.card}>
        <h1 className={cls.heading}>{heading}</h1>
        <div className={cls.groupingContainer}>
          <SingleStarRating number={number} />
          <div className={cls.ratingContainer}>{children}</div>
        </div>
      </section>
    </>
  );
};

export default ReviewCard;
