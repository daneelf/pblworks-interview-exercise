import '@testing-library/jest-dom'
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'

import HeaderMenu from '@/app/components/HeaderMenu'

describe('HeaderMenu', () => {
  it('renders the avatar', () => {
    render(<HeaderMenu />)
    const avatarElement = screen.getByTestId('header-menu-avatar')
    expect(avatarElement).toBeInTheDocument()
  })

  it('opens the menu when the avatar is clicked', () => {
    render(<HeaderMenu />)
    const avatarElement = screen.getByTestId('header-menu-avatar')
    fireEvent.click(avatarElement)
    const menuElement = screen.getByRole('menu')
    expect(menuElement).toBeInTheDocument()
  })

  it('renders the menu items with correct links', () => {
    render(<HeaderMenu />)
    const avatarElement = screen.getByTestId('header-menu-avatar')
    fireEvent.click(avatarElement)
    const menuItemElements = screen.getAllByRole('menuitem')
    expect(menuItemElements[0]).toHaveAttribute('href', '/')
    expect(menuItemElements[1]).toHaveAttribute('href', '/')
    expect(menuItemElements[2]).toHaveAttribute('href', '/')
    expect(menuItemElements[3]).toHaveAttribute('href', '/')
  })
})
