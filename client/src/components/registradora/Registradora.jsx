import React, { Component } from 'react'
import Smartbar from '../nav/Smartbar'
import { Layout, Table, Input, Button, Space, Modal, List, Typography, message, Descriptions, Popconfirm } from 'antd';
import { api, initColumns } from '../../config'
import { BarcodeOutlined, ExclamationCircleOutlined, MinusOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Search } = Input;
const { confirm } = Modal;
const columns = [
  {
    title: 'Cantidad',
    dataIndex: 'cantidad',
    key: 'count',
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal',
    key: 'subprice',
  },
  {
    title: 'Acciones',
    dataIndex: 'acciones',
    key: 'actions',
  },
]

const initState = {
  cacheData: {},
  dataSale: [],
  dataApi: [],
  count: 0,
  search: "",
  columns: [...initColumns, ...columns],
  visible: false,
}

function Tabla(props) {
  return (
    <>
      <Table columns={props.columns} dataSource={props.data} {...props}/>
    </>
  )
}

function GroupButton(props) {
  return (
    <Space>
      <Button type="primary" onClick={props.onPay}>Pagar</Button>
      <Button type="primary" onClick={props.onDiscard}>Descartar</Button>
    </Space>
  )
}

function ListPreview(props) {
  let total = !(props.data && props.data.length) ? 0 : props.data.map(it => it.subtotal).reduce((acc, value) => acc += value)
  return (
    <List
      header={<div>Vista previa</div>}
      footer={<div>Total a cobrar: ${total}</div>}
      bordered
      dataSource={props.data}
      renderItem={item => (
        <List.Item>
          <Typography.Text mark>{item.nombre}</Typography.Text> {item.cantidad} X {item.precio} = {item.subtotal}
        </List.Item>
      )}
    />
  )
}

function TicketModal(props) {
  return (
    <Modal
      title="Vista previa de la venta"
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
    >
      <ListPreview data={props.dataSale} />
    </Modal>
  )
}

function Scores(props) {
  return (
    <Descriptions title="Informacion Venta">
      <Descriptions.Item label="Cajero">Zhou Maomao</Descriptions.Item>
      <Descriptions.Item label="productos #">{props.count}</Descriptions.Item>
      <Descriptions.Item label="Total">${props.total}</Descriptions.Item>
    </Descriptions>
  )
}

export default class Registradora extends Component {

  constructor(props) {
    super(props)
    this.state = this.configureActions(initState)
    this.confimdDiscardSale = this.confimdDiscardSale.bind(this)
    this.handledFetchProducto = this.handledFetchProducto.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(evt){
    const { value } = evt.target;

    this.setState({
      search: value
    })

  }

  configureActions(init_state){
    const columnWithActions = { 
      ...initState.columns.find( item => item.dataIndex === 'acciones' ),
      render: (text, record) =>
      (
        <div>
          <Button onClick={() => this.subData(record)}><MinusOutlined /></Button>
          <Button onClick={() => this.updateData(record.codigo)}><PlusCircleOutlined /></Button>
          <Popconfirm title="Estas seguro de eliminar este producto?" onConfirm={() => this.remData(record)}>
            <Button><DeleteOutlined /></Button>
          </Popconfirm>
        </div>
      ) 
     }
    init_state.columns = [...initState.columns.filter(item => item.dataIndex !== 'acciones'), columnWithActions]
    return init_state

  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    api('ventas', 'saveAll', '', { method: 'post', body: JSON.stringify(this.state.dataApi) })
      .then((respnd) => {
        this.handleCancel()
        alert(respnd.message)
        this.setState(initState)
      })
      .catch(err => alert("Error en ventas: " + err))

  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handledFetchProducto = (evt) => {
    evt.persist()
    const { search, dataSale } = this.state
    
    if(search !== '' && search !== undefined){
      if (!dataSale.find( item => item.codigo === search)) {
          api('productos', search)
          .then(this.addData)
          .catch(() => message.error('No existe ningun producto con el codigo: ' + search, 4))
      } 
      else {
          this.updateData(search)
      }
    }
  }

  handledKeys = (evt) => {
    if(evt.keyCode === 32){
      let code = this.state.search
      this.setState({search: code.trim()})
      this.showModal()
    }
      
    if(evt.key === 'Shift')
      this.confimdDiscardSale()
  }

  cacheProductos = (prod) => {
    let newCacheData = { ...this.state.cacheData }
    if (!(prod.codigo in this.state.cacheData))
      newCacheData[prod.codigo] = prod
    return newCacheData
  }

  findData(codigo){
    const findCodigo = (it) => it.codigo === codigo
    let tempDataSale = this.state.dataSale
    let tempDataApi = this.state.dataApi

    let producto = tempDataSale.find(findCodigo)
    let foundIndex = tempDataSale.findIndex(findCodigo)

    let productoApi = tempDataApi.find(findCodigo)
    let foundApiIndex = tempDataApi.findIndex(findCodigo)

    return {
      producto, foundIndex, productoApi, foundApiIndex, tempDataApi, tempDataSale
    }
  }

  updateData(codigo){
    const { producto, foundIndex, productoApi, foundApiIndex, tempDataApi, tempDataSale } = this.findData(codigo)

    producto.cantidad += 1
    productoApi.cantidad = producto.cantidad
    producto['subtotal'] = producto.cantidad * producto.precio

    tempDataApi[foundApiIndex] = productoApi
    tempDataSale[foundIndex] = producto

    this.setState({
      count: this.state.count + 1,
      dataSale: tempDataSale,
      search: ""
    })
}

  addData = (prod) => {
    let newDataProd = { ...prod, key: prod.codigo, cantidad: 1, subtotal: prod.precio }
    let dataApi = { codigo: prod.codigo, cantidad: 1 }

    this.setState({
      dataApi: [...this.state.dataApi, dataApi],
      dataSale: [...this.state.dataSale, newDataProd],
      cacheData: this.cacheProductos(prod),
      count: this.state.count + 1,
      search: ""
    })
  }

  subData = (prod) => {
    if(prod.cantidad <= 1)
      this.remData(prod)
    else{
      const { producto, foundIndex, productoApi, foundApiIndex, tempDataApi, tempDataSale } = this.findData(prod.codigo)

      producto.cantidad -= 1
      productoApi.cantidad = producto.cantidad
      producto['subtotal'] = producto.cantidad * producto.precio

      tempDataApi[foundApiIndex] = productoApi
      tempDataSale[foundIndex] = producto

      this.setState({
        count: this.state.count - 1,
        dataSale: tempDataSale,
        search: ""
      })

    }

  }

  remData = (prod) => { 
    const { dataApi, dataSale } = this.state
    const removeByCodigo = item => item.codigo !== prod.codigo
    const newDataApi = dataApi.filter(removeByCodigo)
    const newDataSale = dataSale.filter(removeByCodigo)
    this.setState({
      dataApi: newDataApi,
      dataSale: newDataSale,
      count: this.state.count - prod.cantidad,
    })
  }

  confimdDiscardSale = () => {
    confirm({
      title: '¿Estas seguro(a) de descartar la venta actual?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acciòn no puede revertirse',
      okText: 'Si',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.setState(initState)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const { columns, dataSale, visible, count, search } = this.state
    return (
      <>
        <TicketModal
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          dataSale={dataSale}
        />
        <Layout>
          <Header>
            <Smartbar />
          </Header>

          <Content>
            <Scores count={count} total={0} />
            <Tabla style={{ height: '55vh' }} columns={columns} data={dataSale} />
            <GroupButton onPay={this.showModal} onDiscard={this.confimdDiscardSale} />
            <Search
              prefix={<BarcodeOutlined className="site-form-item-icon" />}
              placeholder="Buscar por codigo de barras"
              enterButton={<Button onClick={this.handledFetchProducto}>Buscar</Button>}
              size="large"
              value={search}
              allowClear
              onChange={this.onChange}
              onKeyUp={(evt) => this.handledKeys(evt)}
              onPressEnter={this.handledFetchProducto}
            />
          </Content>
        </Layout>
      </>
    )
  }

}