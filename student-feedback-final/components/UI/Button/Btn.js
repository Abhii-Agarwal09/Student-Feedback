// React Imports
import { useState, useEffect } from 'react';

// Chakra UI Imports
import { Button } from '@chakra-ui/react';

// Custom Hook Imports
import useWindowSize from '../../../hooks/useWindowSize';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

const Btn = ({ children, onClick, type }) => {
  const size = useWindowSize();

  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    size.width <= 768 ? setFontSize('0.8rem') : setFontSize('1rem');
  }, [size.width]);

  return (
    <>
      <Button
        type={type}
        onClick={onClick}
        backgroundColor={colors.bgSecondary}
        _hover={{ backgroundColor: colors.bgSecondaryHover }}
        color={colors.white}
        width={'100%'}
        fontSize={fontSize}
      >
        {children}
      </Button>
    </>
  );
};

export default Btn;
