// Next Imports
import Image from 'next/image';

// React Imports
import { useState, useEffect } from 'react';

// CSS Imports
import cls from './FacultyData.module.css';

// Asset Imports
import left from '../../../public/assets/FacultyName-Left.svg';
import middle from '../../../public/assets/FacultyName-Middle.svg';

const FacultyData = ({
  leftHeading,
  middleHeading,
  rightHeading,
  leftHeadingData,
  middleHeadingData,
  rightHeadingData,
}) => {
  return (
    <>
      <div className="conatiner">
        <section className={cls.facultyData}>
          <div className={cls.groupingContainer}>
            <div className={cls.circleContainer}>
              <Image
                src={left}
                className={cls.image}
                alt="image"
                layout="responsive"
                draggable={false}
              />
            </div>
            <div className={cls.circleContainer}>
              <Image
                src={middle}
                className={cls.image}
                alt="image"
                layout="responsive"
                draggable={false}
              />
            </div>
          </div>
          <div className={cls.dataConatiner}>
            <p className={cls.text}>
              {leftHeading}: <strong>{leftHeadingData}</strong>
            </p>
            <p className={cls.text}>
              {middleHeading}: <strong>{middleHeadingData}</strong>
            </p>
            <p className={cls.text}>
              {rightHeading}: <strong>{rightHeadingData}</strong>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default FacultyData;