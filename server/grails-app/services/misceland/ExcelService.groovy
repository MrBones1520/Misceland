package misceland

import builders.dsl.spreadsheet.builder.poi.PoiSpreadsheetBuilder
import msutil.Constant
import msutil.ExcelStylesheet
import org.apache.tomcat.jni.Local

import java.time.LocalDate
import java.time.Month
import java.time.format.DateTimeFormatter

class ExcelService {

    public static final String SHEET_NAME = "Books"
    public static final String HEADER_ISBN = "Isbn"
    public static final String HEADER_NAME = "Name"

    public static final String VENTAS_SHEET_NAME = "ventas"

    public static final String EXCEL_FILE_SUFIX = ".xlsx"

    public static final List<String> HEADERS = ["Codigo Barras",
        "Nombre", "Categoria/Impuesto", "Categoria/Nombre", "Contenido","Cantidad", "Precio", "Subtotal"]

    VentaService ventaService

    def exportExcelFromVentas(OutputStream outputStream, def req){
        //File file = File.createTempFile(VENTAS_SHEET_NAME, EXCEL_FILE_SUFIX)
        LinkedHashMap<Set<String>, List<Venta>> groups = ventaService.getGroupsVentaByYear()

        PoiSpreadsheetBuilder.stream(outputStream).build {
            apply ExcelStylesheet
            groups.each { date , ventas ->
                Set<String> vals = date.split('-')
                int year = vals[0].toInteger()
                int month = vals[1].toInteger()
                sheet("$year") { s ->
                     ventas.groupBy{it.fechaCompra.dayOfMonth }.each { dayOfMonth, allVentas ->
                         row {
                             cell {
                                 value LocalDate.of(year, month, dayOfMonth).format(Constant.formatterWithoutYear)
                                 colspan HEADERS.size()
                                 style {
                                     align center, center
                                 }
                             }
                         }
                         row {
                             HEADERS.each { header ->
                                 cell {
                                     width auto
                                     value header
                                     style ExcelStylesheet.STYLE_HEADER
                                 }
                             }
                         }
                         allVentas.each { Venta venta ->
                             row {
                                 cell(venta.codigo)
                                 cell(venta.nombre)
                                 cell(venta.categoriaImpuesto)
                                 cell(venta.categoriaNombre)
                                 cell(venta.contenido)
                                 cell(venta.cantidad)
                                 cell(venta.precio)
                                 cell(venta.subtotal)
                             }
                         }
                         row {
                             cell("Total")
                             cell(allVentas*.subtotal.sum())
                             cell("No. Productos")
                             cell(allVentas.size())
                         }
                         (1..4).each {
                             row()
                         }
                     }
                }
            }
            sheet("Resumen"){
                row {
                    cell('Total')
                    cell('Count')
                }
                row {
                    cell(groups.values().flatten()*.subtotal.sum())
                    cell(groups.size())
                }
            }
        }
    }

    String fileNameWithDate(LocalDate date){
        return "${date.toString().replaceAll('-','')}_report"
    }

    def exportExcelBook(OutputStream out, LocalDate date, String fileName){
        //File file = File.createTempFile(fileName, EXCEL_FILE_SUFIX)
        def ventas = ventaService.findAll(date)

        PoiSpreadsheetBuilder.create(out).build {
            apply ExcelStylesheet
            sheet(date.month.name()+" "+date.year) { s ->
                row {
                    cell {
                        value date
                        colspan HEADERS.size()
                        style {
                            align center, center
                            format "dd mmm"
                        }
                    }
                }
                row {
                    HEADERS.each { header ->
                        cell {
                            width auto
                            value header
                            style ExcelStylesheet.STYLE_HEADER
                        }
                    }
                }
                ventas.each { venta ->
                    row {
                        cell(venta.codigo)
                        cell(venta.nombre)
                        cell(venta.categoriaImpuesto)
                        cell(venta.categoriaNombre)
                        cell(venta.contenido)
                        cell(venta.cantidad)
                        cell(venta.precio)
                        cell(venta.subtotal)
                    }
                }
                row {
                    cell("Total Venta")
                    cell(ventas*.subtotal.sum())
                    cell("No. Productos")
                    cell(ventas.size())
                }
            }
        }
        //file
    }

    def exportExcelRange(OutputStream out, String initDate, String endDate){

        def ventas = ventaService.getRangeVentas(initDate, endDate)

        PoiSpreadsheetBuilder.create(out).build {
            ExcelStylesheet excelStylesheet
            sheet("$initDate to $endDate") {
                row {
                    cell(initDate)
                    cell(endDate)
                }
            }
        }
    }

}
