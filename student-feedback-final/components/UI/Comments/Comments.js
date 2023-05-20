// CSS Imports
import cls from './Comments.module.css';

const Comments = ({ children }) => {
  return (
    <>
      <div className={cls.comments}>{children}</div>
    </>
  );
};

export default Comments;
