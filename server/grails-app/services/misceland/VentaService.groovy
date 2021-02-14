package misceland

import groovy.transform.PackageScope
import request.VentaItemRequest

import java.time.LocalDate
import msutil.Constant

class VentaService {

    ProductoService productoService

    @PackageScope def groupByFechaCompra = { Venta it ->
        it.fechaCompra
    }

    def list(def params){
        Venta.list(params)
    }

    def getGroupsVenta(def list){
        list.groupBy(groupByFechaCompra)
    }

    def getGroupsVentaByYear(){
        list([max: Venta.count]).groupBy{ Venta it -> it.fechaCompra.year + "-" + it.fechaCompra.month.value }
    }

    def getGroupsDetailVenta(def list){
        def groups = getGroupsVenta(list)
        [index: groups.keySet(), result: groups]
    }

    def getResumeOf(def list){
        def groups = getGroupsVenta(list)
        return groups.collect { LocalDate fecha, List<Venta> ventas ->
            [key: fecha.toString(), date: fecha.toString(), count: ventas.size(), total: ventas*.subtotal.sum(), items: ventas]
        }
    }

    def saveAllItems(List<VentaItemRequest> items){
        int fails = 0, saves = 0
        items.collect { VentaItemRequest item ->
            Producto producto = productoService.get(item.codigo)
            if(producto){
                def venta = new Venta(producto, item)
                if(venta.validate()){
                    venta.save()
                    saves++
                }else
                    fails++

            }else
                fails++
        }
        return [message: "save all", count: items.size(), fails: fails, saves: saves]
    }

    def findAll(LocalDate date){
        list([max: Venta.count]).findAll{it.fechaCompra.toLocalDate().isEqual(date)}
    }

    def findAndDelete(LocalDate date){
        List<Venta> listAll = findAll(date) ?: []
        Venta.withTransaction { listAll*.delete(flush: true) }
        return [message: listAll.size() > 0 ? "delete all" : "not found ventas with ${date.toString()}",
                date: date.toString(), count: listAll.size(), list: listAll]
    }

    def getRangeVentas(String initDate0, String endDate0){
        LocalDate initDate = LocalDate.parse(initDate0, Constant.formatter)
        LocalDate endDate = LocalDate.parse(endDate0, Constant.formatter)
        return Venta.findAllByFechaCompraBetween(initDate, endDate)
    }


}