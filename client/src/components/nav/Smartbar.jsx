import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Menu } from 'antd'
import { isProd } from '../../config'

export default class Smartbar extends Component {

    render(){
        document.title = isProd ? "Misceland" : "Misceland - Development" 
        return(
            <div>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                  <Menu.Item key="registradora"><Link to="/registradora">Registradora</Link></Menu.Item>
                  <Menu.Item key="almacen"><Link to="/almacen">Almacen</Link></Menu.Item>
                  <Menu.Item key="reportes"><Link to="/reportes">Reportes</Link></Menu.Item>
                  <Menu.Item key="ajustes" hidden><Link to="/ajustes">Ajustes</Link></Menu.Item>
                </Menu>
            </div>
        )
    }
    
} 