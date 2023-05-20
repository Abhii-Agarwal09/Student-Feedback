// React Imports
import { useState, useEffect } from 'react';

// UI Component Imports
import SpinnerComponent from '../Spinner/Spinner';
// import Btn from '../Button/Btn';

// Chakra UI Imports
import { Button } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

// Custom Hook Imports
import useWindowSize from '../../../hooks/useWindowSize';

// CSS Imports
import cls from './LoadingModal.module.css';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

const LoadingModal = ({ isOpen, callback, isButtonShown, header }) => {
  const size = useWindowSize();

  const { onClose } = useDisclosure();

  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    size.width <= 768 ? setFontSize('0.8rem') : setFontSize('1rem');
  }, [size.width]);

  const closeModal = () => {
    onClose();
    callback();
  };

  return (
    <>
      <Modal onClose={closeModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalBody>
            <div className={cls.spinner}>
              <SpinnerComponent />
            </div>
          </ModalBody>
          <ModalFooter>
            {isButtonShown && (
              <Button
                onClick={closeModal}
                backgroundColor={colors.bgSecondary}
                _hover={{ backgroundColor: colors.bgSecondaryHover }}
                color={colors.white}
                fontSize={fontSize}
              >
                Login
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoadingModal;
