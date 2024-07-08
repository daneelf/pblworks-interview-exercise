import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/app/components/Header'

describe('Header', () => {
  it('renders the logo and links to the projects page', () => {
    render(<Header />)
    const logoLink = screen.getByRole('link', { name: /pblworks design/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/projects')
  })
  
  it('renders the project title when provided', () => {
    const projectTitle = 'Test Project'
    render(<Header projectTitle={projectTitle} />)
    const titleElement = screen.getByText(projectTitle)
    expect(titleElement).toBeInTheDocument()
  })

  it('renders the project title element', () => {
    render(<Header />)
    const titleElement = screen.getByRole('heading', { level: 6 })
    expect(titleElement).toBeInTheDocument()
  })

  it('renders the HeaderMenu component', () => {
    render(<Header />)
    const avatarElement = screen.getByTestId('header-menu-avatar')
    expect(avatarElement).toBeInTheDocument()
  })
})
