import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Link } from '@material-ui/core'

import Page from '@/components/Page'

import { emailSantihans } from '@/constants'

const Imprint = () => (
  <Page title="Imprint" subtitle={`…for legal reasons.`}>
    <Box mb={4}>
      <Typography>
        SANTiHANS GmbH (The Company)
        <br />
        CH-4056 Basel <br />
        UID: CHE-244.875.499
        <br />
        <Link href={`mailto:${emailSantihans}`}>{emailSantihans}</Link>
      </Typography>
    </Box>
    <Box mb={4}>
      <Typography variant="h3">Disclaimer</Typography>
      <Typography>
        The content included in this website has been compiled from a variety of sources and is
        subject to change without notice as are any products, programs, offerings, or technical
        information described in this website. The Company makes no representation or warranty
        whatsoever regarding the completeness, quality, or adequacy of the website or content, or
        the suitability, functionality, or operation of this website or its content. By using this
        website, you assume the risk that the content on this website may be inaccurate, incomplete,
        or offensive or may not meet your needs and requirements. The Company specifically disclaims
        all warranties, express or implied, including without limitation the warranties of
        merchantability, fitness for a particular purpose, and non-infringement with respect to this
        website. In no event will the Company be liable for any special, indirect, incidental or
        consequential damages even if company has been advised of the possibility of such damages.
      </Typography>
    </Box>
  </Page>
)

export default Imprint
