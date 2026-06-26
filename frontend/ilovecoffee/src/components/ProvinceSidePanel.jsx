import { useRef, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import PlaceIcon from '@mui/icons-material/Place';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

const fallbackColors = {
  primary: '#8b572a',
  primaryDark: '#5f3717',
  primaryLight: '#fff3e6',
  primarySoft: '#f0dcc6',
  surface: '#fffaf3',
  surfaceSoft: '#f8ead8',
  border: '#d7b38e',
  textHeading: '#2f1d10',
  textMain: '#5d3d24',
  textMuted: '#7d6652',
  shadow: 'rgba(75, 46, 31, 0.2)',
};

export default function ProvinceSidePanel({
  selectedDrink,
  selectedProvinceId,
  onProvinceChange,
  monthRanges,
  onMonthRangeChange,
}) {
  const closeTimerRef = useRef(null);
  const isSelectOpenRef = useRef(false);

  const [hoveredItem, setHoveredItem] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);

  const selectedColors = selectedDrink?.colors || fallbackColors;

  const openMonthPanel = (item, element) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setHoveredItem(item);
    setAnchorElement(element);
  };

  const scheduleCloseMonthPanel = () => {
    if (isSelectOpenRef.current) {
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setHoveredItem(null);
      setAnchorElement(null);
    }, 180);
  };

  const keepMonthPanelOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  };

  const handleSelectOpen = () => {
    isSelectOpenRef.current = true;
    keepMonthPanelOpen();
  };

  const handleSelectClose = () => {
    isSelectOpenRef.current = false;
  };

  const getAvailableEndMonths = (itemId) => {
    const startMonth = monthRanges[itemId]?.startMonth;

    if (!startMonth) {
      return dashboardConfig.monthFilter.availableMonths;
    }

    return dashboardConfig.monthFilter.availableMonths.filter(
      (month) => month.value >= startMonth
    );
  };

  const getNavButtonStyles = (isSelected, index) => ({
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1.5,
    borderRadius: '10px',
    px: 1.4,
    py: 1.35,
    minHeight: 52,
    minWidth: {
      xs: 'max-content',
      lg: '100%',
    },
    whiteSpace: 'nowrap',
    textTransform: 'none',
    overflow: 'hidden',

    color: isSelected ? '#ffffff' : 'var(--text-heading)',
    backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface)',

    border: isSelected
      ? '1px solid var(--primary-dark)'
      : '1px solid var(--border)',

    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',

    animation: 'fadeSlideRight 0.35s ease both',
    animationDelay: `${index * 0.08}s`,

    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',

    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '18%',
      width: 4,
      height: '64%',
      borderRadius: '0 999px 999px 0',
      backgroundColor: isSelected ? '#ffffff' : 'transparent',
    },

    '&:hover': {
      transform: {
        xs: 'translateY(-2px)',
        lg: 'translateX(6px)',
      },
      backgroundColor: isSelected
        ? 'var(--primary-dark)'
        : 'var(--primary-light)',
      borderColor: isSelected ? 'var(--primary-dark)' : 'var(--primary)',
      boxShadow: 'var(--shadow-md)',
    },

    '&:active': {
      transform: 'scale(0.98)',
    },

    '&:focus-visible': {
      outline: '3px solid var(--primary-soft)',
      outlineOffset: 2,
    },
  });

  const monthDialogPaperStyles = {
    width: 280,
    p: 2,
    borderRadius: '10px',
    border: `1px solid ${selectedColors.border}`,
    background: `linear-gradient(145deg, ${selectedColors.surface} 0%, ${selectedColors.surfaceSoft} 100%)`,
    boxShadow: `0 14px 34px ${selectedColors.shadow}`,
    animation: 'softPop 0.2s ease both',
  };

  const monthSelectStyles = {
    borderRadius: '8px',
    backgroundColor: selectedColors.surface,
    color: selectedColors.textHeading,

    '& .MuiSelect-select': {
      fontWeight: 800,
      color: selectedColors.textHeading,
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: selectedColors.border,
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: selectedColors.primary,
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: selectedColors.primary,
      borderWidth: '1px',
    },

    '& .MuiSvgIcon-root': {
      color: selectedColors.primary,
    },
  };

  const monthInputLabelStyles = {
    color: selectedColors.textMuted,
    fontWeight: 700,

    '&.Mui-focused': {
      color: selectedColors.primary,
    },
  };

  const monthSelectMenuProps = {
    disablePortal: false,
    disableScrollLock: true,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    PaperProps: {
      sx: {
        mt: 0.75,
        borderRadius: '10px',
        border: `1px solid ${selectedColors.border}`,
        background: `linear-gradient(180deg, ${selectedColors.surface} 0%, ${selectedColors.primaryLight} 100%)`,
        color: selectedColors.textHeading,
        boxShadow: `0 14px 34px ${selectedColors.shadow}`,
        maxHeight: 300,
        overflow: 'auto',

        '& .MuiMenu-list': {
          py: 0.75,
          backgroundColor: 'transparent',
        },

        '& .MuiMenuItem-root': {
          mx: 0.75,
          my: 0.25,
          borderRadius: '7px',
          fontWeight: 800,
          color: selectedColors.textHeading,
          backgroundColor: 'transparent',
          transition:
            'background-color 0.18s ease, color 0.18s ease, transform 0.18s ease',
        },

        '& .MuiMenuItem-root:hover': {
          backgroundColor: selectedColors.primaryLight,
          color: selectedColors.primaryDark,
          transform: 'translateX(2px)',
        },

        '& .MuiMenuItem-root.Mui-selected': {
          backgroundColor: `${selectedColors.primarySoft} !important`,
          color: selectedColors.primaryDark,
          fontWeight: 950,
        },

        '& .MuiMenuItem-root.Mui-selected:hover': {
          backgroundColor: `${selectedColors.primaryLight} !important`,
        },

        '&::-webkit-scrollbar': {
          width: 8,
        },

        '&::-webkit-scrollbar-track': {
          backgroundColor: selectedColors.surfaceSoft,
          borderRadius: 999,
        },

        '&::-webkit-scrollbar-thumb': {
          backgroundColor: selectedColors.primary,
          borderRadius: 999,
          border: `2px solid ${selectedColors.surfaceSoft}`,
        },

        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: selectedColors.primaryDark,
        },
      },
    },
  };

  const renderNavButton = (item, index, iconType = 'province') => {
    const isSelected = selectedProvinceId === item.id;

    return (
      <Button
        key={item.id}
        fullWidth
        disableElevation
        onClick={() => onProvinceChange(item.id)}
        onMouseEnter={(event) => openMonthPanel(item, event.currentTarget)}
        onMouseLeave={scheduleCloseMonthPanel}
        sx={getNavButtonStyles(isSelected, index)}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.15,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              backgroundColor: isSelected
                ? 'rgba(255, 255, 255, 0.2)'
                : 'var(--primary-light)',
              color: isSelected ? '#ffffff' : 'var(--primary)',
              border: isSelected ? 'none' : '1px solid var(--border)',
            }}
          >
            {iconType === 'overall' ? (
              <LocalCafeIcon sx={{ fontSize: 19 }} />
            ) : (
              <PlaceIcon sx={{ fontSize: 19 }} />
            )}
          </Box>

          <Typography
            component="span"
            sx={{
              fontWeight: 900,
              fontSize: '0.92rem',
              lineHeight: 1.15,
              textAlign: 'left',
              color: 'inherit',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.label}
          </Typography>
        </Box>

        <KeyboardArrowRightIcon
          sx={{
            fontSize: 20,
            opacity: isSelected ? 1 : 0.45,
            transform: isSelected ? 'translateX(2px)' : 'none',
            transition: 'transform 0.18s ease, opacity 0.18s ease',
            flexShrink: 0,
          }}
        />
      </Button>
    );
  };

  const isMonthPanelOpen = Boolean(hoveredItem && anchorElement);

  return (
    <Box
      component="aside"
      sx={{
        width: {
          xs: '100%',
          lg: 290,
        },
        minWidth: {
          lg: 290,
        },

        background:
          'linear-gradient(180deg, var(--sidebar-bg-soft) 0%, var(--sidebar-bg) 48%, var(--sidebar-bg-deep) 100%)',

        borderRight: {
          xs: 'none',
          lg: '1px solid var(--sidebar-border)',
        },
        borderBottom: {
          xs: '1px solid var(--sidebar-border)',
          lg: 'none',
        },

        px: 2.5,
        py: 3,
        position: {
          xs: 'relative',
          lg: 'sticky',
        },
        top: 0,
        height: {
          xs: 'auto',
          lg: '100vh',
        },

        boxShadow: {
          xs: 'var(--shadow-sm)',
          lg: '8px 0 28px rgba(0, 0, 0, 0.08)',
        },

        zIndex: 20,
        animation: {
          xs: 'fadeSlideUp 0.45s ease both',
          lg: 'fadeSlideRight 0.45s ease both',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.4,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '10px',
            background:
              'linear-gradient(145deg, var(--surface) 0%, var(--primary-light) 100%)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
          }}
        >
          <LocalCafeIcon sx={{ color: 'var(--primary)', fontSize: 27 }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 950,
              color: 'var(--text-heading)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {dashboardConfig.appName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-muted)',
              fontWeight: 800,
            }}
          >
            Regional Dashboard
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--sidebar-border)', mb: 2.25 }} />

      <Box sx={{ mb: 2 }}>
        {renderNavButton(dashboardConfig.overall, 0, 'overall')}
      </Box>

      <Divider sx={{ borderColor: 'var(--sidebar-border)', mb: 2.25 }} />

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          color: 'var(--text-muted)',
          fontWeight: 950,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          mb: 1.5,
          pl: 0.5,
        }}
      >
        {dashboardConfig.provinceLabel}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'row',
            lg: 'column',
          },
          gap: 1.15,
          overflowX: {
            xs: 'auto',
            lg: 'visible',
          },
          pb: {
            xs: 1,
            lg: 0,
          },

          '&::-webkit-scrollbar': {
            height: 6,
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--primary)',
            borderRadius: 999,
          },
        }}
      >
        {dashboardConfig.provinces.map((province, index) =>
          renderNavButton(province, index + 1)
        )}
      </Box>

      <Popper
        open={isMonthPanelOpen}
        anchorEl={anchorElement}
        placement="right-start"
        disablePortal
        sx={{
          zIndex: 30,
        }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [12, 0],
            },
          },
        ]}
      >
        {hoveredItem && (
          <Paper
            onMouseEnter={keepMonthPanelOpen}
            onMouseLeave={scheduleCloseMonthPanel}
            elevation={0}
            sx={monthDialogPaperStyles}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 950,
                color: selectedColors.textHeading,
                mb: 0.5,
              }}
            >
              {hoveredItem.label}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: selectedColors.textMuted,
                fontWeight: 800,
                mb: 1.5,
              }}
            >
              Filter dashboard by month range
            </Typography>

            <Stack spacing={1.5}>
              <FormControl size="small" fullWidth>
                <InputLabel
                  id={`${hoveredItem.id}-start-month-label`}
                  sx={monthInputLabelStyles}
                >
                  Start Month
                </InputLabel>

                <Select
                  labelId={`${hoveredItem.id}-start-month-label`}
                  label="Start Month"
                  value={monthRanges[hoveredItem.id]?.startMonth || ''}
                  onOpen={handleSelectOpen}
                  onClose={handleSelectClose}
                  onChange={(event) =>
                    onMonthRangeChange(
                      hoveredItem.id,
                      'startMonth',
                      event.target.value
                    )
                  }
                  MenuProps={monthSelectMenuProps}
                  sx={monthSelectStyles}
                >
                  {dashboardConfig.monthFilter.availableMonths.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel
                  id={`${hoveredItem.id}-end-month-label`}
                  sx={monthInputLabelStyles}
                >
                  End Month
                </InputLabel>

                <Select
                  labelId={`${hoveredItem.id}-end-month-label`}
                  label="End Month"
                  value={monthRanges[hoveredItem.id]?.endMonth || ''}
                  onOpen={handleSelectOpen}
                  onClose={handleSelectClose}
                  onChange={(event) =>
                    onMonthRangeChange(
                      hoveredItem.id,
                      'endMonth',
                      event.target.value
                    )
                  }
                  MenuProps={monthSelectMenuProps}
                  sx={monthSelectStyles}
                >
                  {getAvailableEndMonths(hoveredItem.id).map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography
                variant="caption"
                sx={{
                  color: selectedColors.textMuted,
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {dashboardConfig.monthFilter.helperText}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Popper>
    </Box>
  );
}