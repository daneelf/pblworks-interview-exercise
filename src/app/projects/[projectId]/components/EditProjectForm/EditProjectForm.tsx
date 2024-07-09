'use client'

import { updateProject } from '@/app/projects/[projectId]/actions/update-project'
import {
  Grid,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material'

import { debounce } from 'lodash'
import { Project } from '@prisma/client'
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'

export const EditProjectForm = ({
  project: initialProject,
}: {
  project: Project
}) => {
  const [project, setProject] = useState(initialProject)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle')
  const initialRender = useRef(true)
  const saveInProgress = useRef(false)

  const saveProject = useCallback(async () => {
    if (
      JSON.stringify(project) === JSON.stringify(initialProject) ||
      saveInProgress.current
    )
      return

    saveInProgress.current = true
    setSaveStatus('saving')

    try {
      await updateProject(project)
      setSaveStatus('success')
    } catch (error) {
      console.error('Error while saving project:', error)
      setSaveStatus('error')
    } finally {
      saveInProgress.current = false
    }
  }, [project, initialProject])

  const debouncedSaveProject = useMemo(
    () => debounce(saveProject, 500),
    [saveProject]
  )

  const handleChange = useCallback(
    (field: keyof Project) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setProject((prev) => ({ ...prev, [field]: event.target.value }))
    },
    []
  )

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    debouncedSaveProject()
    return () => debouncedSaveProject.cancel()
  }, [project, debouncedSaveProject])

  const handleCloseSnackbar = () => {
    setSaveStatus('idle')
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h2" sx={{ wordWrap: 'break-word' }}>
        {project.title || 'Untitled project'}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} md={5} lg={4}>
          <TextField
            fullWidth
            data-testid="project-title-input"
            label="Project Title"
            value={project.title}
            placeholder="Enter the project title, eg. 'Power of the punch'"
            onChange={handleChange('title')}
            aria-label="Project Title"
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <TextField
            fullWidth
            data-testid="project-subhead-input"
            label="Project Subhead"
            value={project.subhead}
            placeholder="Use a small sentence to describe the project, eg. 'Students will learn Newtons Laws while constructing a boxing glove'"
            onChange={handleChange('subhead')}
            aria-label="Project Subhead"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            data-testid="project-description-input"
            label="Project Description"
            value={project.description}
            placeholder="Describe the project in detail (suggested length: 300 words)"
            onChange={handleChange('description')}
            multiline
            rows={4}
            aria-label="Project Description"
          />
        </Grid>
      </Grid>

      <Snackbar
        open={saveStatus === 'success'}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Changes saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={saveStatus === 'error'}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Failed to save changes. Please try again later.
        </Alert>
      </Snackbar>
    </Paper>
  )
}
