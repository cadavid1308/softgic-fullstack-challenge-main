import { Chip } from '@mui/material';

const ESTILOS: Record<string, { color: string; background: string }> = {
  REGISTRADA: { color: '#0e5964', background: '#d8f0ec' },
  EN_ATENCION: { color: '#8a4b1e', background: '#f9dfb8' },
  RESUELTA: { color: '#286448', background: '#d8eedb' },
  CERRADA: { color: '#53666b', background: '#e2e7e4' },
};

export interface EstadoChipProps {
  estado: 'REGISTRADA' | 'EN_ATENCION' | 'RESUELTA' | 'CERRADA';
}

/** Componente reutilizable documentado en Storybook (estados representativos). */
export function EstadoChip({ estado }: EstadoChipProps) {
  const estilo = ESTILOS[estado];
  return <Chip label={estado.replace('_', ' ')} size="small" sx={{ color: estilo.color, bgcolor: estilo.background, borderRadius: 1, fontWeight: 800, letterSpacing: '.04em' }} />;
}
