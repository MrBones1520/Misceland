package misceland

import grails.converters.JSON
import grails.rest.RestfulController
import grails.util.Environment
import msutil.Constant
import request.VentaItemRequest

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

class VentasController extends RestfulController<Venta>{

    VentaService ventaService
    int defaultMax = Environment.current == Environment.PRODUCTION ? Venta.count : 100

    VentasController(){
        super(Venta)
    }

    def index(Integer max, String type){
        params.max = Math.min(max ?: defaultMax, defaultMax)
        def list = ventaService.list(params)
        switch (type){
            case "info":
                respond(list, view: 'info')
            break
            case "group":
                respond(ventaService.getGroupsVenta(list))
            break
            case "group-details":
                response.setContentType("application/json")
                render ventaService.getGroupsDetailVenta(list) as JSON
            break
            case "resume":
                response.setContentType("application/json")
                render ventaService.getResumeOf(list) as JSON
                break
            default:
                respond(list)
            break
        }
    }

    def saveAll(){
        if(request.JSON){
            List<VentaItemRequest> ventas = request.JSON.collect { new VentaItemRequest(it) }
            def ventasResponse = ventaService.saveAllItems(ventas)
            respond(ventasResponse, status: 200)
        }
        else
            respond([message: "Las ventas no son validas"],status: 400)
    }

    def deleteAll() {
        try {
            def date = LocalDate.parse(params.get("fromDate"), Constant.formatter)
            response.setContentType("application/json")
            render ventaService.findAndDelete(date) as JSON
        } catch (DateTimeParseException ex) {
            render([message: "format invalid. fromDate=ddMMyyyy", date: params.get("fromDate")] as JSON)
        }

    }

}