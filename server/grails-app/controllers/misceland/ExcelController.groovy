package misceland

import grails.artefact.Controller
import grails.compiler.GrailsCompileStatic
import grails.config.Config
import grails.core.support.GrailsConfigurationAware
import msutil.Constant

import java.time.LocalDate

import static java.time.LocalDate.parse
import static org.springframework.http.HttpStatus.OK

class ExcelController implements GrailsConfigurationAware, Controller{

    static allowedMethods = [ ventas: ['POST','GET'] ]

    ExcelService excelService
    String xlsxMimeType
    String encoding

    @Override
    void setConfiguration(Config co) {
        xlsxMimeType = co.getProperty('grails.mime.types.xlsxMimeType', String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
    }

    @GrailsCompileStatic
    def ventas(){
        response.status = OK.value()
        String nameFile = params.get('fileName', ExcelService.VENTAS_SHEET_NAME)
        response.setHeader "Content-disposition", "attachment; filename=${nameFile}"
        //response.contentType = "application/octet-stream;charset=${encoding}"
        response.contentType = "${xlsxMimeType};charset=${encoding}"
        OutputStream outs = response.outputStream
        excelService.exportExcelFromVentas(outs, request)
        outs.flush()
        outs.close()
    }

    def venta(String fromDate){
        response.status = OK.value()
        LocalDate date = parse(fromDate, Constant.formatter)
        String nameFile = params.get('fileName', excelService.fileNameWithDate(date))
        response.setHeader "Content-disposition", "attachment; filename=${nameFile}"
        response.contentType = "${xlsxMimeType};charset=${encoding}"
        OutputStream outs = response.outputStream
        excelService.exportExcelBook(outs, date, nameFile)
        outs.flush()
        outs.close()
    }

    def range(String initDate, String endDate){
        response.status = OK.value()
        String nameFile = params.get('fileName', ExcelService.VENTAS_SHEET_NAME)
        response.setHeader "Content-disposition", "attachment; filename=${nameFile}"
        //response.contentType = "application/octet-stream;charset=${encoding}"
        response.contentType = "${xlsxMimeType};charset=${encoding}"
        OutputStream outs = response.outputStream
        excelService.exportExcelRange(outs, initDate, endDate)
        outs.flush()
        outs.close()
    }

}
