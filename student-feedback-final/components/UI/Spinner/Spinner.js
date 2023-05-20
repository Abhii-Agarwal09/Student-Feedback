// Chakra UI Imports
import { Spinner } from '@chakra-ui/react';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

const SpinnerComponent = ({ size }) => {
  return (
    <>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={colors.bgPrimary}
        size={size || 'lg'}
      />
    </>
  );
};

export default SpinnerComponent;
