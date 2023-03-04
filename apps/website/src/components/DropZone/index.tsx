import React, { ReactNode, useState } from 'react'
import { styled } from '@mui/system'
import { useDropzone } from 'react-dropzone'
import { Box, Paper, Button, Chip, Backdrop, Typography } from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import { useTranslation } from 'next-i18next'

import { LimitReachedNotice } from '@/components/UpgradeNotice'
import { Error } from '@/components/Error'
import { MB } from '@/constants'
import usePrettyBytes from '@/hooks/usePrettyBytes'

const PREFIX = 'DropZone'

const classes = {
  paper: `${PREFIX}-paper`,
  dropInfo: `${PREFIX}-dropInfo`,
  maxFileSizeInfo: `${PREFIX}-maxFileSizeInfo`,
  chip: `${PREFIX}-chip`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: '2px',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '152px',
    padding: theme.spacing(5),
    position: 'relative',
    textAlign: 'center',
  },

  [`& .${classes.dropInfo}`]: {
    marginTop: ' .3em',
  },

  [`& .${classes.maxFileSizeInfo}`]: {
    opacity: 0.5,
    fontSize: '.8em',
    position: 'absolute',
    right: '5px',
    bottom: '5px',
  },

  [`& .${classes.chip}`]: {
    paddingLeft: '.6em',
    paddingRight: '.6em',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '.3em',
  },
}))

interface DropZoneProps {
  onChange(file: File | null): void
  maxFileSize?: number
  isStandalone?: boolean
}
const DropZone: React.FC<DropZoneProps> = ({ isStandalone, onChange, maxFileSize = 10 * MB }) => {
  const { t } = useTranslation('common')
  const prettyBytes = usePrettyBytes()

  const [error, setError] = useState<ReactNode>(null)
  const [file, setFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFilesInput(acceptedFiles)
    },
    noClick: true,
    noKeyboard: true,
    disabled: false,
  })

  const handleFilesInput = (files: File[] | FileList) => {
    setError(null)

    // Custom error handling
    if (!files.length) {
      setError(t('components.DropZone.error.noFiles', 'No file selected. Please try another file.'))
      return
    }

    // We only allow one file for now.
    if (files.length > 1) {
      setError(
        t(
          'components.DropZone.error.tooManyFiles',
          'Too many files. Only one file allowed at this point. You may compress multiple files into one zip file before uploading.',
        ),
      )
      return
    }
    const file = files[0]

    setFile(file)

    if (file.size > maxFileSize) {
      setError(
        <>
          <Box>
            {t('components.DropZone.error.fileToLarge', {
              defaultValue: 'File too large. Maximum file size is {{max}}.',
              max: prettyBytes(maxFileSize),
            })}
          </Box>
          <LimitReachedNotice openLinksInNewTab={isStandalone} />
        </>,
      )
      return
    }

    onChange(file)
  }

  return (
    <Root {...getRootProps()}>
      <Backdrop open={isDragActive} style={{ zIndex: 100 }}>
        <Typography variant="h2" gutterBottom style={{ color: '#fff', textAlign: 'center' }}>
          {t('components.DropZone.backdrop', `Drop It Like It's Hot`)}
        </Typography>
      </Backdrop>
      <Paper variant="outlined" className={classes.paper}>
        {file && (
          <>
            <Chip
              deleteIcon={<Delete />}
              className={classes.chip}
              color="default"
              label={`${file.name} - ${prettyBytes(file.size)}`}
              onDelete={() => {
                setFile(null)
                setError(null)
                onChange(null)
              }}
            />
          </>
        )}
        {(error || !file) && (
          <>
            <input
              {...getInputProps()}
              id="file-input"
              type="file"
              onChange={(e) => {
                setFile(null)
                setError(null)
                onChange(null)
                if (e.target.files) {
                  handleFilesInput(e.target.files)
                }
              }}
            />
            <label htmlFor="file-input">
              <Button
                component="span"
                size="large"
                color="primary"
                variant="contained"
                startIcon={<CloudUpload />}
              >
                {t('components.DropZone.button', 'Select file')}
              </Button>
            </label>
            <Typography className={classes.dropInfo} variant="body2">
              {t('components.DropZone.dragAndDrop', '…or drag & drop here.')}
            </Typography>
            <Typography className={classes.maxFileSizeInfo} variant="body2">
              {t('components.DropZone.maxFileSize', {
                defaultValue: `Max. {{maxSize}}`,
                maxSize: prettyBytes(maxFileSize),
              })}
            </Typography>
          </>
        )}
      </Paper>
      {error && (
        <Box mt={1}>
          <Error error={error} />
        </Box>
      )}
    </Root>
  )
}

export default DropZone
