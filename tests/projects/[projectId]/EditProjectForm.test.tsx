import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditProjectForm } from '@/app/projects/[projectId]/components/EditProjectForm/EditProjectForm';
import * as updateProjectModule from '@/app/projects/[projectId]/actions/update-project';
import { Project } from '@prisma/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

jest.mock('@/app/projects/[projectId]/actions/update-project', () => ({
  updateProject: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockUpdateProject = updateProjectModule.updateProject as jest.MockedFunction<typeof updateProjectModule.updateProject>;

const mockProject: Project = {
  id: 1,
  title: 'Test Project',
  subhead: 'Test Subhead',
  description: 'Test Description',
};

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('EditProjectForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders form fields with initial project data', async () => {
    renderWithTheme(<EditProjectForm project={mockProject} />);
  
    const titleInput = screen.getByTestId('project-title-input').querySelector('input') as HTMLInputElement;
    const subheadInput = screen.getByTestId('project-subhead-input').querySelector('input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('project-description-input').querySelector('textarea') as HTMLTextAreaElement;
  
    expect(titleInput.value).toBe('Test Project');
    expect(subheadInput.value).toBe('Test Subhead');
    expect(descriptionInput.value).toBe('Test Description');
  });

  test('updates form fields on user input', async () => {
    renderWithTheme(<EditProjectForm project={mockProject} />);
    
    const titleInput = screen.getByTestId('project-title-input').querySelector('input') as HTMLInputElement;
    const subheadInput = screen.getByTestId('project-subhead-input').querySelector('input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('project-description-input').querySelector('textarea') as HTMLTextAreaElement;

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(subheadInput, { target: { value: 'Updated Subhead' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    });

    expect(titleInput.value).toBe('Updated Title');
    expect(subheadInput.value).toBe('Updated Subhead');
    expect(descriptionInput.value).toBe('Updated Description');
  });

  test('calls updateProject after user input and debounce', async () => {
    mockUpdateProject.mockResolvedValue(mockProject);
    renderWithTheme(<EditProjectForm project={mockProject} />);
    
    const titleInput = screen.getByTestId('project-title-input').querySelector('input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockUpdateProject).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        title: 'Updated Title',
        subhead: 'Test Subhead',
        description: 'Test Description',
      }));
    });
  });

  test('shows error message after failed save', async () => {
    // Mock console.error to prevent the error from being logged during the test
    const originalError = console.error;
    console.error = jest.fn();
  
    mockUpdateProject.mockRejectedValue(new Error('Save failed'));
    renderWithTheme(<EditProjectForm project={mockProject} />);
    
    const titleInput = screen.getByTestId('project-title-input').querySelector('input') as HTMLInputElement;
  
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      jest.advanceTimersByTime(500);
    });
  
    await waitFor(() => {
      expect(screen.getByText('Failed to save changes. Please try again later.')).toBeInTheDocument();
    });
  
    // Restore the original console.error after the test
    console.error = originalError;
  });
});