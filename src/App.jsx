import { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Collapse,
  Dialog,
  Drawer,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MenuIcon from '@mui/icons-material/Menu'
import {
  MenuBook,
  Book,
  Description,
  Bookmark,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material'
import { ChromePicker } from 'react-color'
import BibleModel from './components/BibleModel';
import OpenBibleModel from './components/OpenBibleModel';

function getContrastTextColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 40; // 40-70%
  const lightness = Math.floor(Math.random() * 30) + 20; // 20-50%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const presets = {
  classic: {
    'outer-leather': '#3B2417', // Deep rich brown for outer leather
    'inner-leather': '#8B6B4E', // Warm tan for inner leather
    'guilding': '#D4AF37', // Antique gold for guilding
    'ribbon-1': '#800000', // Deep maroon for first ribbon
    'ribbon-2': '#2B4B3C', // Forest green for second ribbon
    'ribbon-3': '#1B365D' // Navy blue for third ribbon
  },
  contemporary: {
    'outer-leather': '#37474F', // Blue gray for modern outer leather
    'inner-leather': '#FAFAFA', // Snow white for minimalist inner leather
    'guilding': '#90A4AE', // Light blue gray for subtle metallic finish
    'ribbon-1': '#FF5722', // Deep orange for bold first ribbon
    'ribbon-2': '#009688', // Teal for trendy second ribbon
    'ribbon-3': '#673AB7' // Deep purple for stylish third ribbon
  },
  elegant: {
    'outer-leather': '#1A1A1A', // Rich black for sophisticated outer leather
    'inner-leather': '#F5F5F5', // White smoke for refined inner leather
    'guilding': '#D4AF37', // Metallic gold for elegant accents
    'ribbon-1': '#800080', // Purple for luxurious first ribbon
    'ribbon-2': '#4B0082', // Indigo for deep second ribbon
    'ribbon-3': '#483D8B' // Dark slate blue for refined third ribbon
  },
  modern: {
    'outer-leather': '#2C3E50', // Midnight blue for contemporary outer leather
    'inner-leather': '#ECF0F1', // Cloud white for clean inner leather
    'guilding': '#BDC3C7', // Silver gray for modern metallic finish
    'ribbon-1': '#E74C3C', // Bright red for vibrant first ribbon
    'ribbon-2': '#3498DB', // Bright blue for fresh second ribbon
    'ribbon-3': '#2ECC71' // Emerald green for bold third ribbon
  },
  ornate: {
    'outer-leather': '#563159', // Royal purple for luxurious outer leather
    'inner-leather': '#FFFFF0', // Ivory for elegant inner leather
    'guilding': '#DAA520', // Goldenrod for ornate metallic details
    'ribbon-1': '#DC143C', // Crimson for bold first ribbon
    'ribbon-2': '#4169E1', // Royal blue for regal second ribbon
    'ribbon-3': '#8B008B' // Dark magenta for rich third ribbon
  },
  rustic: {
    'outer-leather': '#8B4513', // Saddle brown for weathered leather look
    'inner-leather': '#DEB887', // Burlywood for aged inner leather
    'guilding': '#CD853F', // Peru brown for rustic metallic accents
    'ribbon-1': '#556B2F', // Dark olive green for earthy first ribbon
    'ribbon-2': '#8B7355', // Light brown for natural second ribbon
    'ribbon-3': '#A0522D' // Sienna for warm third ribbon
  },
  traditional: {
    'outer-leather': '#582F0E', // Deep brown for traditional outer leather
    'inner-leather': '#C4A484', // Tan for classic inner leather
    'guilding': '#996515', // Bronze for traditional metalwork
    'ribbon-1': '#006400', // Dark green for traditional first ribbon
    'ribbon-2': '#8B0000', // Dark red for classic second ribbon
    'ribbon-3': '#000080' // Navy blue for traditional third ribbon
  },
  vintage: {
    'outer-leather': '#654321', // Dark brown for aged leather
    'inner-leather': '#E8DCC4', // Light beige for faded inner leather
    'guilding': '#B8860B', // Dark goldenrod for antique metalwork
    'ribbon-1': '#800020', // Burgundy for classic first ribbon
    'ribbon-2': '#2F4F4F', // Dark slate gray for muted second ribbon
    'ribbon-3': '#4A412A' // Dark olive for aged third ribbon
  },
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [isExploded, setIsExploded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [yapSize, setYapSize] = useState('standard');
  const [selectedComponent, setSelectedComponent] = useState('outer-leather')
  const [expandedComponent, setExpandedComponent] = useState('')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [selectedColorItem, setSelectedColorItem] = useState(null)
  const [colors, setColors] = useState({
    'outer-leather': '#5B2831',
    'inner-leather': '#d2b48c',
    'guilding': '#ffd700',
    'ribbon-1': '#2D5A3A',
    'ribbon-2': '#d2b48c',
    'ribbon-3': '#1B4B82'
  })

  const [lockedColors, setLockedColors] = useState({})

  const handleRandomizeColors = () => {
    const newColors = { ...colors };
    Object.keys(colors).forEach(key => {
      if (!lockedColors[key]) {
        newColors[key] = getRandomColor();
      }
    });
    setColors(newColors);
  };

  const handleToggleLock = (componentId) => {
    setLockedColors(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  const handleColorChange = (color) => {
    setColors(prevColors => ({
      ...prevColors,
      [selectedColorItem]: color.hex
    }))
  }

  const handleExpandClick = (componentId) => {
    setExpandedComponent(expandedComponent === componentId ? '' : componentId);
  };

  const handleColorClick = (componentId) => {
    setSelectedColorItem(componentId);
    setColorPickerOpen(true);
  };

  const components = [
    { name: 'Outer Leather', icon: <Book />, id: 'outer-leather' },
    { name: 'Inner Leather', icon: <MenuBook />, id: 'inner-leather' },
    { name: 'Guilding', icon: <Description />, id: 'guilding' },
    { name: 'Ribbon 1', icon: <Bookmark />, id: 'ribbon-1' },
    { name: 'Ribbon 2', icon: <Bookmark />, id: 'ribbon-2' },
    { name: 'Ribbon 3', icon: <Bookmark />, id: 'ribbon-3' }
  ]

  const SidebarContent = () => (
    <Box sx={{ 
      width: { xs: 220, sm: 160 }, 
      p: 1.5,
      backgroundColor: '#ffffff',
      height: '100%',
      borderRight: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1.5, 
          fontSize: '1rem',
          fontWeight: 600,
          color: '#2c3e50',
          textAlign: 'left',
          width: '100%',
          letterSpacing: '0.3px'
        }}
      >
        Bible Customization
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
        <Button
          variant="outlined"
          fullWidth
          size="small"
          onClick={() => setIsExploded(!isExploded)}
          sx={{
            borderColor: isExploded ? '#e74c3c' : '#64748b',
            color: isExploded ? '#e74c3c' : '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            '&:hover': {
              borderColor: isExploded ? '#c0392b' : '#475569',
              color: isExploded ? '#c0392b' : '#475569',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }
          }}
        >
          {isExploded ? 'Unexplode' : 'Explode'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="small"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            borderColor: isOpen ? '#e74c3c' : '#64748b',
            color: isOpen ? '#e74c3c' : '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            '&:hover': {
              borderColor: isOpen ? '#c0392b' : '#475569',
              color: isOpen ? '#c0392b' : '#475569',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }
          }}
        >
          {isOpen ? 'Close' : 'Open'}
        </Button>
      </Box>
      <List sx={{ mb: 1.5 }}>
        {components.map((component) => (
          <ListItem
            key={component.id}
            button
            dense
            onClick={() => handleColorClick(component.id)}
            sx={{
              py: 0.8,
              borderRadius: 1,
              mb: 0.5,
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                transform: 'translateX(2px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ListItemIcon sx={{ 
                minWidth: 32,
                color: colors[component.id],
                '& svg': {
                  fontSize: '1.2rem',
                  stroke: 'rgba(0, 0, 0, 0.1)',
                  strokeWidth: '0.5px'
                }
              }}>
                {component.icon}
              </ListItemIcon>
              <ListItemText 
                primary={component.name} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#475569',
                    letterSpacing: '0.2px'
                  } 
                }} 
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLock(component.id);
                }}
                sx={{
                  color: lockedColors[component.id] ? '#e74c3c' : '#64748b',
                  '&:hover': {
                    color: lockedColors[component.id] ? '#c0392b' : '#475569'
                  }
                }}
              >
                {lockedColors[component.id] ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        px: 0.5
      }}>
        <select 
          value={yapSize}
          onChange={(e) => setYapSize(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.5em 0.8em',
            borderRadius: '6px',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            fontSize: '0.8em',
            fontWeight: '500',
            fontFamily: 'inherit',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.2s ease-in-out',
            outline: 'none'
          }}
        >
          <option value="standard">Standard Yap</option>
          <option value="half">Half Yap</option>
          <option value="full">Full Yap</option>
        </select>

        <select 
          onChange={(e) => setColors(presets[e.target.value])} 
          style={{ 
            width: '100%', 
            padding: '0.5em 0.8em',
            borderRadius: '6px',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            fontSize: '0.8em',
            fontWeight: '500',
            fontFamily: 'inherit',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.2s ease-in-out',
            outline: 'none'
          }}
        >
          <option value="" disabled selected>Presets</option>
          <option value="classic">Classic</option>
          <option value="contemporary">Contemporary</option>
          <option value="elegant">Elegant</option>
          <option value="modern">Modern</option>
          <option value="ornate">Ornate</option>
          <option value="rustic">Rustic</option>
          <option value="traditional">Traditional</option>
          <option value="vintage">Vintage</option>
        </select>
        <button 
          onClick={handleRandomizeColors} 
          style={{ 
            width: '100%',
            padding: '0.5em 0.8em',
            borderRadius: '6px',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            fontSize: '0.8em',
            fontWeight: '500',
            fontFamily: 'inherit',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Randomize Colors
        </button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh', width: '100vw', display: 'flex', color: '#000000', overflow: 'hidden' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <Paper elevation={3} sx={{ 
          width: 180, 
          borderRadius: 0, 
          borderRight: 1, 
          borderColor: 'divider',
          display: drawerOpen ? 'block' : 'none',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1200
        }}>
          <SidebarContent />
        </Paper>
      )}

      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        p: { xs: 0, sm: 1 },
        ml: { xs: 0, sm: drawerOpen ? '180px' : 0 },
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        <Box sx={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}>
          {isOpen ? 
            <OpenBibleModel colors={colors} yapSize={yapSize} /> :
            <BibleModel colors={colors} yapSize={yapSize} isExploded={isExploded} />
          }
        </Box>
      </Box>
      <Dialog
        open={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        PaperProps={{
          sx: { 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <ChromePicker
          color={selectedColorItem ? colors[selectedColorItem] : '#fff'}
          onChange={handleColorChange}
        />
      </Dialog>
    </Container>
  )
}

export default App
