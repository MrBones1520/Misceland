import React, { Component } from 'react'
import Smartbar from '../nav/Smartbar'
import { Layout, Table, Button, Select, Form } from 'antd';
import { api } from '../../config'
import { DownloadOutlined, DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import moment from 'moment'

const { Header, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'Fecha Venta',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Productos totales',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: 'Total vendido',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Operaciones',
        dataIndex: 'details',
        key: 'details',
    },
]

const initState = {
    dataSource: [],
    columns: columns,
    optionsDates: []
}

function CustomTable(props) {
    return (
        <>
            <Table
                columns={props.columns}
                dataSource={props.dataSource} />
        </>
    )
}

function SpecReport(props) {
    const { options, handledReport } = props
    const [form] = Form.useForm();
    let initDate

    const onFinish = () => {
        form.validateFields().
        then( values => {
            const init_date = values['init_date']
            const end_date = values['end_date']
            api('excel',`range?initDate=${init_date}&endDate=${end_date}`)
            .then((blob) => {
                var url = window.URL.createObjectURL(new Blob([blob]));
                var a = document.createElement('a');
                a.href = url;
                a.download = `book_from_${init_date}_to_${end_date}.xlsx`;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();  //afterwards we remove the element again
            })
            .catch((err) => alert("Range Report error:"+ err))
        }).
        catch( err => alert("Error Form Finish: "+ err))
       
    };

    return (
        <Form form={form} layout="inline" onFinish={onFinish}>
            <Form.Item label="Fecha inicio" name="init_date" rules={[{ required: true}]}>
                <Select key="initDate" style={{ width: 120 }}>
                    {options.map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item label="Fecha Fin" name="end_date" rules={[{ required: true}]}>
                <Select key="endDate" style={{ width: 120 }}>
                    {options.map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button>Mostrar Filtro</Button>
                <Button type="primary" htmlType="submit">Generar reporte con filtro</Button>
            </Form.Item>
        </Form>
    )

}

export default class Reportes extends Component {

    constructor(props) {
        super(props)
        this.state = this.configureState(initState)
    }

    componentDidMount() {
        api('ventas?type=resume').then(dataSource => {
            this.setState({
                dataSource: dataSource
                , optionsDates: dataSource.map(item => item.key)
            })
        })
    }

    handledDelete(date){
        api('ventas', 'deleteAll?fromDate='+date, '', { method: 'delete' }).then( response => {
            if(response.count > 0){
                this.setState({dataSource: [...this.state.dataSource].filter(item => item.date !== date)})
                alert(`Se ha eliminado las ventas de la fecha ${date}`)
            }
        }).catch( err => alert("Error Delete: "+ err))
    }

    handledReport(date){
        alert(`Generando reporte de ${date}...`)
        api('excel', 'venta?fromDate='+date)
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `${date}.xlsx`
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        })
    }

    handledRangeReport(initDate, endDate){
        api('excel', `range?initDate=${initDate}&endDate=${endDate}`)
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `${initDate}_to_${endDate}.xlsx`
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        })
    }

    configureState(state) {
        let keyOperations = "details"
        let actions = {
            ...state.columns.find(item => item.key === keyOperations),
            render: (text, record) => (
                <div>
                    <Button onClick={() => this.handledDelete(record.date)}><DeleteOutlined />Eliminar</Button>
                    <Button onClick={() => this.handledReport(record.date)}><FileExcelOutlined />Exportar</Button>
                </div>
            )
        }
        let columnsWithActions = [...state.columns.filter(item => item.key !== keyOperations), actions]

        state.columns = columnsWithActions

        return state
    }

    getCompleteExcelBook() {
        alert("Exportando ...")
        api('excel', 'ventas')
            .then(blob => {
                var url = window.URL.createObjectURL(new Blob([blob]));
                var a = document.createElement('a');
                a.href = url;
                a.download = "complete_book.xlsx";
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();  //afterwards we remove the element again
            })

    }

    render() {
        const { dataSource, columns, optionsDates } = this.state
        return (
            <>
                <Layout>
                    <Header>
                        <Smartbar />
                    </Header>
                    <Layout>
                        <Content>
                            <Button htype="primary" shape="round" icon={<DownloadOutlined />} size='large' onClick={this.getCompleteExcelBook}>
                                Descargar libro completo
                    </Button>
                            <SpecReport options={optionsDates} handledReport={this.handledRangeReport} />
                            <CustomTable dataSource={dataSource} columns={columns} />
                        </Content>
                    </Layout>
                </Layout>
            </>
        )
    }

}