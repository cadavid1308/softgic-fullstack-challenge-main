import { AppBar, Box, Button, CircularProgress, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { store } from './store';
import { initKeycloak, keycloak } from './keycloak';
import { sesionIniciada } from './features/sesion/sesionSlice';

// Carga federada del remoto; se muestra estado de carga explícito mientras resuelve.
const BandejaSolicitudes = lazy(() => import('mfeSolicitudes/BandejaSolicitudes'));
const ResumenAnalitico = lazy(() => import('mfeSolicitudes/ResumenAnalitico'));

const shellTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0e3b43', contrastText: '#fffaf2' },
    secondary: { main: '#ef6f61', contrastText: '#fffaf2' },
    background: { default: '#f4efe6', paper: '#fffaf2' },
    text: { primary: '#16343a', secondary: '#617276' },
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
    button: { fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 5 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 3, paddingInline: 18 } } },
    MuiPaper: { styleOverrides: { root: { border: '1px solid rgba(14, 59, 67, 0.10)', boxShadow: '0 12px 30px rgba(14, 59, 67, 0.07)' } } },
  },
});

function Rutas() {
  const dispatch = useDispatch();
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initKeycloak()
      .then((autenticado) => {
        if (autenticado) {
          const roles = keycloak.tokenParsed?.realm_access?.roles ?? [];
          dispatch(sesionIniciada({ nombreUsuario: keycloak.tokenParsed?.preferred_username ?? '', roles }));
        }
        setListo(true);
      })
      .catch(() => setError('No fue posible inicializar la sesión con Keycloak'));
  }, [dispatch]);

  if (error) return <Box role="alert">{error}</Box>;
  if (!listo) return <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center"><CircularProgress aria-label="Inicializando sesión" /></Box>;

  return (
    <ThemeProvider theme={shellTheme}>
      <CssBaseline />
      <Box minHeight="100vh" sx={{ bgcolor: 'background.default', backgroundImage: 'radial-gradient(rgba(14,59,67,.07) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', borderBottom: '4px solid #ef6f61' }}>
        <Toolbar sx={{ gap: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '.02em' }}>NODO / OPERACIONES</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,250,242,.68)', letterSpacing: '.14em' }}>MESA DE SOLICITUDES</Typography>
          </Box>
          <Button component={Link} to="/" color="inherit">Bandeja</Button>
          <Button component={Link} to="/analitica" color="inherit">Analítica</Button>
          <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>{keycloak.tokenParsed?.preferred_username}</Typography>
          <Button color="inherit" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>Salir</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Suspense fallback={<Box display="flex" justifyContent="center" p={6}><CircularProgress aria-label="Cargando módulo" /></Box>}>
          <Routes>
            <Route path="/" element={<BandejaSolicitudes />} />
            <Route path="/analitica" element={<ResumenAnalitico />} />
          </Routes>
        </Suspense>
      </Container>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Rutas />
      </BrowserRouter>
    </Provider>
  );
}
