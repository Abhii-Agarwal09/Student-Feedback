// Chakra UI Imports
import { ChakraProvider } from '@chakra-ui/react';

// Student Context
import StudentContextProvider from '../context/studentContext';

// CSS Imports
import '../styles/globals.css';
import '../styles/variables.css';

import Layout from '../components/AdComp/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ChakraProvider>
        <StudentContextProvider>
          <Component {...pageProps} />
        </StudentContextProvider>
      </ChakraProvider>
    </Layout>
  );
}

export default MyApp;
