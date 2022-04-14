package misceland

import grails.rest.Resource

@Resource(readOnly = true)
class Sale {

    String folio
    List<Article> articles

    Employee employee
    Client client

    Date createdDate

    static mapping = {
        id name: 'folio'
        version false
        batchSize 20
    }
}
