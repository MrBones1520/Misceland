import React, { Component } from "react";
import Smartbar from '../nav/Smartbar'
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default class Almacen extends Component {
      render(){
        return(
          <>
            <Layout>
              <Header>
                <Smartbar />
              </Header>
              <Layout>
                <Sider>Sider</Sider>
                <Content>Content</Content>
              </Layout>
              <Footer>Footer</Footer>
            </Layout>
          </>
        )
      }
}