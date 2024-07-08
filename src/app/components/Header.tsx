import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import HeaderMenu from './HeaderMenu'

interface HeaderProps {
  projectTitle?: string
}

const Header = ({ projectTitle }: HeaderProps) => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{ backgroundColor: 'white', mb: 3 }}
    >
      <Toolbar>
        <Link href="/projects" passHref>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/design-logo.svg"
              alt="PBLWorks Design"
              width={150}
              height={50}
            />
          </Box>
        </Link>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="text.primary">
            {projectTitle || ''}
          </Typography>
        </Box>
        <HeaderMenu />
      </Toolbar>
    </AppBar>
  )
}

export default Header
