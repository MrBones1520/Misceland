package msutil

import java.time.format.DateTimeFormatter

class Constant {

    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d-MM-yyyy")
    static DateTimeFormatter formatterWithoutYear = DateTimeFormatter.ofPattern("d-MMM")


}
