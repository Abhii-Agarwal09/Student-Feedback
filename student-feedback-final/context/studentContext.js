// React Imports
import { useState, createContext, useEffect } from 'react';

// Firebase Imports
import '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
export const StudentContext = createContext();

const StudentContextProvider = ({ children }) => {
  // if (typeof window !== 'undefined') {
  //   const localData = localStorage.getItem('user');

  //   data = localData
  //     ? JSON.parse(localData)
  //     : {
  //         displayName: '',
  //         email: '',
  //         photoURL: '',
  //         isLoggedIn: false,
  //       };
  // }
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    loggedIn: false,
  });

  useEffect(() => {
    // console.log('ls se data fetch kar raha');
    const data = JSON.parse(localStorage.getItem('user'));

    setUser((prevState) => {
      return { ...prevState, ...data };
    });
    // console.log(data);
  }, []);

  useEffect(() => {
    const setLocalStorage = () => {
      const data = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        loggedIn: user.loggedIn,
      };
      // console.log('ls mai data set kar raha hoon');
      localStorage.setItem('user', JSON.stringify(data));
    };

    if (
      user.displayName.length !== 0 ||
      user.email.length !== 0 ||
      (user.photoURL.length !== 0 && user.loggedIn === true)
    ) {
      setLocalStorage();
    }
  }, [user]);

  // useEffect(() => {
  //   localStorage.setItem('user', JSON.stringify(user));
  // }, [user]);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (student) => {
  //     if (!student) {
  //       setUser({
  //         displayName: '',
  //         email: '',
  //         photoURL: '',
  //         isLoggedIn: false,
  //       });
  //     } else {
  //       setUser({
  //         displayName: student.displayName,
  //         email: student.email,
  //         photoURL: student.photoURL,
  //         isLoggedIn: true,
  //       });
  //     }
  //   });
  // }, []);

  return (
    <StudentContext.Provider value={[user, setUser]}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
