'use client'
import { useState } from 'react'
import { Avatar, Menu, MenuItem } from '@mui/material'
import Link from 'next/link'

interface HeaderMenuProps {
  onClose?: () => void
}

const HeaderMenu = ({ onClose }: HeaderMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    if (onClose) {
      onClose()
    }
  }
  
  return (
    <>
      <Avatar
        data-testid="header-menu-avatar"
        onClick={handleMenuOpen}
        sx={{ cursor: 'pointer' }}
      >
        DV
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} href="/">
          My Account
        </MenuItem>
        <MenuItem component={Link} href="/">
          Settings
        </MenuItem>
        <MenuItem component={Link} href="/">
          Analytics
        </MenuItem>
        <MenuItem component={Link} href="/">
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default HeaderMenu
