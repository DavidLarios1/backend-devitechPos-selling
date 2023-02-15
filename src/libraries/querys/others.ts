export const wacherParameters = 'select valor from wacher_parametros w where w.codigo=$1';

export const dataVentaCtMovimiento = `select row_to_json (t)
from (
select cm.id id_movimiento
, cmd.bodegas_id id_bodega
, cm.tipo tipo_movimiento
, cm.consecutivo consecutivo
, cm.atributos -> 'consecutivo' ->> 'prefijo' prefijo_consecutivo
, cm.atributos atributos_movimientos
, coalesce(fnc_consultar_parametro (i_codigo => 'IMPRIMIR_VENTA_FINALIZADA') , 'S') impreso
from ct_movimientos cm
join ct_movimientos_detalles cmd on cm.id = cmd.movimientos_id 
where cm.id = $1) t;`;
