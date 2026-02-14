export interface QuoteState {
  tipoPieza: string | null;
  material: string | null;
  dimensiones: string | null;
  cantidad: number | null;
  toleranciasAcabados: string | null;
  urgencia: string | null;
  industria: string | null;
}

export const initialQuoteState: QuoteState = {
  tipoPieza: null,
  material: null,
  dimensiones: null,
  cantidad: null,
  toleranciasAcabados: null,
  urgencia: null,
  industria: null,
};
