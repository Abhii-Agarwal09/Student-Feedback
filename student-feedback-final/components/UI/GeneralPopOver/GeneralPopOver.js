// React Imports
import { useRef } from 'react';

// Chakra UI Imports
import { Button, ButtonGroup } from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';

// CSS as JSON Imports
import colors from '../../../styles/variables.json';

const GeneralPopOver = ({ header, body, children, callback }) => {
  const initialFocusRef = useRef();
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          backgroundColor={colors.white}
          paddingTop={'1.5rem'}
          paddingBottom={'1.5rem'}
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent color="black" bg="#efefef">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          {header}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>{body}</PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          pb={4}
        >
          <ButtonGroup size="sm">
            <Button onClick={callback} colorScheme="red" ref={initialFocusRef}>
              Logout
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default GeneralPopOver;
