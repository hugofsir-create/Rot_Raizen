export interface Material {
  id: string;
  sku: string;
  descripcion: string;
  categoria: string;
}

export interface NonAptEntry {
  id: string;
  materialId: string;
  sku: string;
  descripcion: string;
  cantidad: number;
  motivo: string;
  fecha: string;
  lote: string;
}
