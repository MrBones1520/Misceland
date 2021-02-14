package misceland

import grails.artefact.Controller
import grails.core.GrailsApplication
import grails.plugins.*

class ApplicationController implements PluginManagerAware, Controller {

    GrailsApplication grailsApplication
    GrailsPluginManager pluginManager

    def index() {
            [grailsApplication: grailsApplication, pluginManager: pluginManager]
    }
}
