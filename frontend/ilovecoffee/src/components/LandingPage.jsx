import AcUnitIcon from '@mui/icons-material/AcUnit';
import CoffeeIcon from '@mui/icons-material/Coffee';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SpaIcon from '@mui/icons-material/Spa';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const coffeeOptions = [
  {
    id: 'blackCoffee',
    name: 'Black Coffee',
    tagline: 'Start your day with a caffeinated punch.',
    description: 'Bold, simple, and strong for a focused start.',
    icon: CoffeeIcon,
    colors: {
      primary: '#4b2e1f',
      primaryDark: '#2b1d12',
      primarySoft: '#ead7c7',
      primaryLight: '#fff1e4',
      surface: '#fff8ef',
      surfaceSoft: '#f4e4d7',
      border: '#c29b7b',
      shadow: 'rgba(75, 46, 31, 0.2)',
      textHeading: '#1f140d',
      textMuted: '#7a6252',
      chartSales: '#4b2e1f',
      chartOrderType: '#7b4a2f',
      chartProduct: '#a5673f',
      chartActual: '#6f8f52',
      chartForecast: '#c56f2d',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha',
    tagline: 'Smooth energy with a calm green boost.',
    description: 'A lighter café choice with steady energy.',
    icon: SpaIcon,
    colors: {
      primary: '#6f8f52',
      primaryDark: '#45602f',
      primarySoft: '#e2ecd2',
      primaryLight: '#f1f8e8',
      surface: '#fbfff4',
      surfaceSoft: '#eef7df',
      border: '#b7c99b',
      shadow: 'rgba(111, 143, 82, 0.22)',
      textHeading: '#1d2b14',
      textMuted: '#6b7b5c',
      chartSales: '#6f8f52',
      chartOrderType: '#52743a',
      chartProduct: '#9bb76f',
      chartActual: '#4f7f4a',
      chartForecast: '#b88a3a',
    },
  },
  {
    id: 'latte',
    name: 'Latte',
    tagline: 'Creamy espresso comfort in every sip.',
    description: 'A smooth and balanced café favourite.',
    icon: LocalCafeIcon,
    colors: {
      primary: '#b9824f',
      primaryDark: '#7a4f2c',
      primarySoft: '#f0dcc6',
      primaryLight: '#fff3e6',
      surface: '#fff7ed',
      surfaceSoft: '#f7e4cf',
      border: '#d7b38e',
      shadow: 'rgba(185, 130, 79, 0.22)',
      textHeading: '#2f1d10',
      textMuted: '#7d6652',
      chartSales: '#b9824f',
      chartOrderType: '#8e5f37',
      chartProduct: '#d9903d',
      chartActual: '#6f8f52',
      chartForecast: '#c56f2d',
    },
  },
  {
    id: 'coldBrew',
    name: 'Cold Brew',
    tagline: 'Cool, bold, and refreshing.',
    description: 'A chilled caffeine kick for busy days.',
    icon: AcUnitIcon,
    colors: {
      primary: '#3f5f73',
      primaryDark: '#243b4a',
      primarySoft: '#d8e6ee',
      primaryLight: '#edf7fc',
      surface: '#f4fbff',
      surfaceSoft: '#dcecf5',
      border: '#9db8c9',
      shadow: 'rgba(63, 95, 115, 0.22)',
      textHeading: '#142633',
      textMuted: '#647987',
      chartSales: '#3f5f73',
      chartOrderType: '#557f95',
      chartProduct: '#8cb3c7',
      chartActual: '#6f8f52',
      chartForecast: '#c56f2d',
    },
  },
  {
    id: 'mocha',
    name: 'Mocha',
    tagline: 'Coffee energy with chocolate warmth.',
    description: 'A sweet café drink with rich flavour.',
    icon: IcecreamIcon,
    colors: {
      primary: '#7b4328',
      primaryDark: '#4a2818',
      primarySoft: '#efd8c8',
      primaryLight: '#fff0e6',
      surface: '#fff3ea',
      surfaceSoft: '#f4dccc',
      border: '#c89576',
      shadow: 'rgba(123, 67, 40, 0.22)',
      textHeading: '#2a130b',
      textMuted: '#7c5e4e',
      chartSales: '#7b4328',
      chartOrderType: '#9a5a36',
      chartProduct: '#c47a48',
      chartActual: '#6f8f52',
      chartForecast: '#c56f2d',
    },
  },
  {
    id: 'tea',
    name: 'Tea',
    tagline: 'A warm sip for a calmer start.',
    description: 'Light, cozy, and perfect for a slower café moment.',
    icon: EmojiFoodBeverageIcon,
    colors: {
      primary: '#8f6b3f',
      primaryDark: '#5f4526',
      primarySoft: '#eadcc5',
      primaryLight: '#fff5e8',
      surface: '#fffaf1',
      surfaceSoft: '#f4e8d5',
      border: '#cdb18a',
      shadow: 'rgba(143, 107, 63, 0.22)',
      textHeading: '#2d2113',
      textMuted: '#7d6a55',
      chartSales: '#8f6b3f',
      chartOrderType: '#a98250',
      chartProduct: '#c69a5f',
      chartActual: '#6f8f52',
      chartForecast: '#c56f2d',
    },
  },
];

export default function LandingPage({
  selectedDrinkId,
  isLeaving,
  onDrinkSelect,
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: {
          xs: 2,
          md: 5,
        },
        py: {
          xs: 4,
          md: 6,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top left, rgba(217, 144, 61, 0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(139, 87, 42, 0.14), transparent 32%), linear-gradient(135deg, #fff4e4 0%, #f7efe4 45%, #efe0cd 100%)',
        animation: isLeaving
          ? 'landingExit 0.65s cubic-bezier(0.22, 1, 0.36, 1) both'
          : 'fadeSlideUp 0.45s ease both',
        pointerEvents: isLeaving ? 'none' : 'auto',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1320,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: 5,
          }}
        >
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            backgroundColor: 'transparent',
            overflow: 'visible',
        }}
        >
        <Typography
            component="div"
            sx={{
            display: 'inline-block',
            color: 'var(--primary)',
            backgroundColor: 'transparent',
            fontFamily:
                '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
            fontSize: {
                xs: '4rem',
                sm: '5.5rem',
                md: '7rem',
                lg: '8rem',
            },
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'visible',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'geometricPrecision',
            textShadow: 'none',
            animation:
                'handwrittenReveal 1.8s cubic-bezier(0.22, 1, 0.36, 1) both, handwrittenFloat 3.5s ease-in-out 2s infinite',
            }}
        >
            CanAI Cafe
        </Typography>
        </Box>


          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 950,
              color: 'var(--text-heading)',
              letterSpacing: '-0.06em',
              fontSize: {
                xs: '2.4rem',
                md: '4rem',
              },
            }}
          >
            Start your day with a caffeinated punch.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              mx: 'auto',
              maxWidth: 680,
              color: 'var(--text-muted)',
              fontWeight: 700,
              lineHeight: 1.7,
            }}
          >
            Choose your café mood first, then explore the CanAI Cafe dashboard
            by province, month range, product performance, and order type.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(6, minmax(0, 1fr))',
            },
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          {coffeeOptions.map((drink, index) => {
            const DrinkIcon = drink.icon;
            const { colors } = drink;
            const isSelected = selectedDrinkId === drink.id;
            const isDimmed = selectedDrinkId && !isSelected;

            return (
              <Card
                key={drink.id}
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                  minHeight: 330,
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${colors.border}`,
                  background: `linear-gradient(145deg, ${colors.surface} 0%, ${colors.surfaceSoft} 100%)`,
                  borderRadius: '14px',
                  boxShadow: isSelected
                    ? `0 22px 48px ${colors.shadow}`
                    : `0 10px 26px ${colors.shadow}`,
                  opacity: isDimmed ? 0.45 : 1,
                  filter: isDimmed ? 'blur(1px) saturate(0.8)' : 'none',
                  transformOrigin: 'center center',
                  animation: isSelected
                    ? 'selectedCoffeePop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both'
                    : 'softPop 0.45s ease both',
                  animationDelay: isSelected ? '0s' : `${index * 0.06}s`,
                  transition:
                    'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, opacity 0.22s ease, filter 0.22s ease',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark})`,
                  },

                  '&:hover': {
                    transform: isSelected ? undefined : 'translateY(-6px)',
                    boxShadow: `0 16px 36px ${colors.shadow}`,
                    borderColor: colors.primary,
                  },
                }}
              >
                <CardContent
                  sx={{
                    height: '100%',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',

                    '&:last-child': {
                      pb: 2.5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: colors.primaryLight,
                      color: colors.primary,
                      border: `1px solid ${colors.border}`,
                      mb: 2,
                      transition: 'transform 0.2s ease',

                      ...(isSelected && {
                        transform: 'rotate(-3deg) scale(1.08)',
                      }),
                    }}
                  >
                    <DrinkIcon sx={{ fontSize: 26 }} />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 950,
                      color: colors.textHeading,
                      mb: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {drink.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.primary,
                      fontWeight: 900,
                      mb: 1,
                      lineHeight: 1.5,
                      minHeight: 48,
                    }}
                  >
                    {drink.tagline}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.textMuted,
                      lineHeight: 1.6,
                      minHeight: 72,
                    }}
                  >
                    {drink.description}
                  </Typography>

                  <Button
                    fullWidth
                    disabled={Boolean(selectedDrinkId)}
                    onClick={() => onDrinkSelect(drink)}
                    sx={{
                      mt: 'auto',
                      borderRadius: '8px',
                      py: 1.1,
                      textTransform: 'none',
                      fontWeight: 900,
                      color: '#ffffff',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      boxShadow: `0 8px 18px ${colors.shadow}`,

                      '&:hover': {
                        background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                        boxShadow: `0 12px 24px ${colors.shadow}`,
                      },

                      '&.Mui-disabled': {
                        color: '#ffffff',
                        opacity: isSelected ? 1 : 0.55,
                        background: isSelected
                          ? `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`
                          : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      },
                    }}
                  >
                    {isSelected
                      ? 'Preparing Dashboard...'
                      : `Choose ${drink.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}