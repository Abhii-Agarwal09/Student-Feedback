// React Imports
import { useState, useRef } from 'react';

// Third part imports
import axios from 'axios';

// Chakra UI Imports
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

// UI Component Imports
import Btn from '../UI/Button/Btn';
import GeneralModal from '../UI/GeneralModal/GeneralModal';
import LoadingModal from '../UI/LoadingModal/LoadingModal';

// CSS Imports
import cls from './FacultyNotFound.module.css';

const FacultyNotFound = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={cls.facultyNotFoundSection}>
        <p className={cls.facultyNotFoundDescription}>
          <strong>Didn’t find your faculty?</strong> Fill the form and help us
          to add your faculty to the list
        </p>
        <div className={cls.facultyNotFoundBtnContainer}>
          <Btn onClick={() => setIsModalOpen(true)}>Click Here</Btn>
        </div>
      </div>
      <NewFacultyModal
        isOpen={isModalOpen}
        callback={() => setIsModalOpen(false)}
      />
    </>
  );
};

const NewFacultyModal = ({ isOpen, callback }) => {
  const { onClose } = useDisclosure();

  const [data, setData] = useState({
    courseName: '',
    courseCode: '',
    facultyName: '',
    facultySchool: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataChangeHandler = (e) => {
    setData(() => {
      return {
        ...data,
        [e.target.name]: e.target.value,
      };
    });
  };

  const postData = async (newFacultyData) => {
    // console.log('yea bhejunga', newFacultyData);

    const token = JSON.parse(localStorage.getItem('token'));

    setIsLoading(true);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}reviews/request`,
      newFacultyData,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );

    // console.log(res);
    setIsLoading(false);
    setData({
      courseName: '',
      courseCode: '',
      facultyName: '',
      facultySchool: '',
    });
    setIsModalOpen(true);
    closeModal();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(data);
    postData(data);
  };

  const closeModal = () => {
    onClose();
    callback();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Faculty Details</ModalHeader>
          <form onSubmit={submitHandler}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Course Name</FormLabel>
                <Input
                  onChange={dataChangeHandler}
                  name="courseName"
                  placeholder="Course Name"
                  required
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Course Code</FormLabel>
                <Input
                  onChange={dataChangeHandler}
                  name="courseCode"
                  placeholder="Course Code"
                  required
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Faculty Name</FormLabel>
                <Input
                  onChange={dataChangeHandler}
                  name="facultyName"
                  placeholder="Faculty Name"
                  required
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Faculty School</FormLabel>
                <Input
                  onChange={dataChangeHandler}
                  name="facultySchool"
                  placeholder="Faculty School"
                  required
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="teal" mr={3}>
                Request Faculty
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <GeneralModal
        header={'Faculty Request Created ✅'}
        body={
          'Your request to add faculty is sent. Our team will be working on it soon...😄'
        }
        isOpen={isModalOpen}
        callback={() => {
          setIsModalOpen(false);
        }}
      />

      <LoadingModal
        header={'Submitting Faculty Request...'}
        isOpen={isLoading}
        callback={() => {}}
        isButtonShown={false}
      />
    </>
  );
};

export default FacultyNotFound;
