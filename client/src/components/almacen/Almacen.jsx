import React, { Component, useState } from "react";
import Smartbar from '../nav/Smartbar'
import { Layout, Table, Input, Button, Space, Modal, Form, Cascader, Popconfirm, InputNumber} from 'antd';
import { api, initColumns } from '../../config'
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, DeleteOutlined, SaveOutlined, ExclamationOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;

const columns = [
  {
    title: 'Categoria',
    key: 'category',
    dataIndex: ["categoria", "nombre"],
    width: 100,
    editable: true
  },
  {
    title: 'Acciones',
    key: 'operation',
    fixed: 'right',
    width: 100,
  }
]

const initState = {
  position: 'topLeft',
  dataSource: [],
  categorias: [], 
  columns: [...initColumns, ...columns ],
  searchText: '',
  searchedColumn: '',
  count: 0,
  visible: false
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Form.Item name={dataIndex} >{inputType === 'number' ? <InputNumber /> : <Input />}</Form.Item>;
  const isCategory = title === "Categoria" 
  const cascader = <Form.Item name={dataIndex}><Cascader options={initState.categorias} defaultValue={[ record !== undefined ? record.categoria.nombre : ""]}/> </Form.Item>
  const formItem = (
    <Form.Item
      shouldUpdate
      label={title}
      noStyle
      rules={[
        {
          required: true,
          message: `Please Input ${title}!`,
        },
      ]}
      children={() => {
        return isCategory ? cascader : inputNode
      }}
    />
  )
  

  return (
    <td {...restProps}>
      {editing ? formItem : children}
    </td>
  );
}


function CustomViewData(props){
  const { data, columns, setData, Delete, onCreate, position } = props
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = (await form.validateFields())
      alert(JSON.stringify(row))
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData, key, row);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData, key, row);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const renderActions = (text, record) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Button onClick={() => save(record.key)} style={{ marginRight: 8 }}>
            <SaveOutlined />
            Guardar
          </Button>
          <Popconfirm title="¿Estas seguro de cancelar?" onConfirm={cancel}>
            <Button><ExclamationOutlined />Cancelar</Button>
          </Popconfirm>
        </span>
      ) : (
        <div>
          <Button onClick={() => edit(record)}><EditOutlined />Ediar</Button>
          <Popconfirm title="Estas seguro de eliminar este producto?" onConfirm={() => Delete(record) }>
            <Button><DeleteOutlined/>Eliminar</Button>
          </Popconfirm>
        </div>
      )
    }

  const mergedColumns = columns.map(col => {
    if(col.key === 'operation')
      col['render'] = renderActions

    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return(
    <>
      <Button onClick={onCreate} type="primary" style={{ marginBottom: 16 }}>
        Nuevo Producto
      </Button>
    <Form form={form} component={false}>
      <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            position: [position],
          }}
        />
    </Form>
      
    </>
  )
}

function ModalFormProducto(props){  
  const [form] = Form.useForm();  

  return (
    <Modal
    title="Nuevo Producto"
    visible={props.visible}
    onCancel={props.onCancel}
    onOk={() => {
      form.
      validateFields().
      then((values) => {
          form.resetFields()
          values.categoria = values.categoria[0]
          props.onCreate(values)
      })
    }}
    >

      <Form
      key="producto-form"
      form={form}
      onFinish={props.onFinish}
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
    >
      <Form.Item
        key="code"
        label="Codigo de Barras"
        name="codigo"
        rules={[{ required: true, message: 'Ingresa un codigo de barras.' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        key="name"
        label="Nombre del producto"
        name="nombre"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        key="category"
        label="Categoria" 
        name="categoria"
      >
          <Cascader
            options={props.categorias}
          />
        </Form.Item>

      <Form.Item
        key="content"
        label="Contenido Neto"
        name="contenido"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        key="price"
        label="Precio Individual"
        name="precio"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        key="description"
        label="Descripcion"
        name="descripcion"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <Input.TextArea />
      </Form.Item>

    </Form>

    </Modal>
    )
}

export default class Almacen extends Component {

      constructor(props){
          super(props)
          this.state = this.configureState(initState)
          this.setData = this.setData.bind(this)
          this.handleDelete = this.handleDelete.bind(this)
      }

      componentDidMount() {
          api('productos').then(data => this.setState({ dataSource: data, count: data.length }))
          api('categorias').then(data => {
              const categorias = data.map( cat => { return {key: cat.nombre,label: cat.nombre, value: cat.id} } )
              this.setState({ categorias: categorias})
              initState.categorias = categorias
            }
          )
      }

      configureState(init_state){
        init_state.columns = [...initColumns.map(col => this.transformColumn(col)), ...columns]
        return init_state
      }

      transformColumn(column){
          return {
            ...column,
            ...this.getColumnSearchProps(column.dataIndex)
          }
      }

      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

      handleSubmit = (values) => {
        api('productos','','',{method: 'POST', body: JSON.stringify(values) }).
        then((resp) => {
          alert("Se ha guardado el producto")
          this.setState({dataSource: [resp,...this.state.dataSource], visible: false})
        })
        .catch( err => alert("Error: "+err))
        
      }

      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

      showDialog = e => {
        this.setState({
          visible: true,
        });
      };

      handleOk = e => {
        console.log(e);
        
        this.setState({
          visible: false,
        });
      };
    
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };

      setData(newDataSource, key, record){   
        alert(JSON.stringify(record))
        api('productos', '', key, { method:'put', body: JSON.stringify(record) }).then( response => {
          this.setState({
            dataSource: newDataSource
          })
        })
        
      }

      handleDelete(record){
          alert(record.key)
          api('productos','',record.key, {method: 'DELETE'})
          .then( isDelete => {
              alert("Se ha eliminado el producto "+record.key)
              this.setState({
                dataSource: [...this.state.dataSource].filter( item => item.key !== record.key)
              })
          }).catch( err => alert("Error en:" +err ))
      }
    

      render(){
        const { columns, dataSource, position, visible, categorias } = this.state 
        return(
          <>
          <ModalFormProducto 
            visible={visible}
            categorias={categorias}
            onCreate={this.handleSubmit}
            onCancel={(e) => this.handleCancel(e)} 
          />
              
            <Layout key="container">
              <Header>
                <Smartbar/>
              </Header>
              <Layout key="internal">
                <Content>
                  <CustomViewData 
                  columns={columns} 
                  data={dataSource} 
                  position={position} 
                  onCreate={this.showDialog} 
                  Delete={this.handleDelete}
                  setData={this.setData}
                  />
                </Content>
              </Layout> 
              <Footer>Footer</Footer>
            </Layout>
          </>
        )
      }
}