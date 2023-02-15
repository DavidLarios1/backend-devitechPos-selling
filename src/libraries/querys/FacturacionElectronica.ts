export const prcControlarVentasFe = `create or replace procedure public.prc_controlar_ventas_fe(i_tiempo_reenvio int,i_cliente_defecto text,inout o_ventas int array)
language  plpgsql
as $procedure$
  declare 
  movimiento  record;
begin
  for movimiento in (select id, fecha_generado  from transmision where sincronizado = 3 order by id asc) loop
   if (select (extract(EPOCH from NOW() - movimiento.fecha_generado) / 60 > i_tiempo_reenvio) ) 
    then
       raise notice 'Actualizando registro %', movimiento.id;
      update transmision set sincronizado=2,request = jsonb_set(request::jsonb , '{cliente}', i_cliente_defecto::jsonb)  where id= movimiento.id;
     else
        o_ventas:= array_append(o_ventas, movimiento.id);
    end if;
  end loop;
end;
$procedure$`;
