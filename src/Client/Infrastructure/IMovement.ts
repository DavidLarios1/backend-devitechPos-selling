export interface IMovement {
  codigo_respuesta: string;
  texto_respuesta: string;
  id_movimiento: number;
  tipo_movimiento: string;
  consecutivo: string;
  prefijo_consecutivo: string;
  atributos_movimientos: AtributosMovimientos;
  impreso: string;
  data: Data;
}

export interface AtributosMovimientos {
  responsables_nombre: string;
  responsables_identificacion: string;
  personas_nombre: string;
  personas_identificacion: string;
  tercero_nombre: string;
  tercero_identificacion: string;
  surtidor: number;
  cara: number;
  manguera: number;
  grado: number;
  islas: string;
  familiaDesc: string;
  familiaId: string;
  consecutivo: Consecutivo;
  isElectronica: boolean;
  suspendido: boolean;
  cliente: Data;
  extraData: string;
  fidelizada: string;
  vehiculo_placa: string;
  vehiculo_numero: string;
  vehiculo_odometro: string;
  rumbo: string;
  CuentaLocal: string;
  isCuentaLocal: string;
  identificadorCupo: string;
  tipoCupo: string;
  isCredito: string;
  recuperada: string;
  tipoVenta: string;
  isContingencia: boolean;
}

export interface Data {
}

export interface Consecutivo {
  id: number;
  empresas_id: number;
  tipo_documento: number;
  prefijo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  consecutivo_inicial: number;
  consecutivo_actual: number;
  consecutivo_final: number;
  estado: string;
  resolucion: string;
  observaciones: string;
  equipos_id: number;
  cs_atributos: CSAtributos;
}

export interface CSAtributos {
  alerta_dias: string;
  alerta_consecutivos: string;
  destino: string;
  correosNotificar: string;
  autoretenedor_1: boolean;
  autoretenedor_2: boolean;
}
