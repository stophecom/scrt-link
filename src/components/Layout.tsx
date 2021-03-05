import React from 'react';
import { Box, Divider, IconButton, Link } from '@material-ui/core';
import Spacer from './Spacer';
import ExternalLink from './ExternalLink';

import styled from 'styled-components';
import TwitterIcon from '@material-ui/icons/Twitter';

const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)}px;
`;

const Layout: React.FC = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <MainContent>
        <>{children}</>
      </MainContent>

      <Box
        display="flex"
        padding={1}
        justifyContent="flex-center"
        component="footer"
      >
        <Spacer flexDirection="row" spacing={1}>
          <IconButton
            component={ExternalLink}
            href="https://twitter.com/stophecom"
          >
            <TwitterIcon />
          </IconButton>
        </Spacer>
      </Box>
    </Box>
  );
};

export default Layout;
