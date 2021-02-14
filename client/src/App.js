import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
//import 'whatwg-fetch';
import Almacen from './components/almacen/Almacen'
import Registradora from './components/registradora/Registradora'
import Reportes from './components/reportes/Reportes'
import 'antd/dist/antd.css';

class App extends Component {

    render(){
        return(
          <Router>
          <div>    
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/reportes">
                <Reportes />
              </Route>
              <Route path="/almacen">
                <Almacen />
              </Route>
              <Route path="/">
                <Registradora />
              </Route>
      
            </Switch>
          </div>
        </Router>
        )
    }

}

export default App;
