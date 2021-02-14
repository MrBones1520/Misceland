import pjson from './../package.json';

export const isProd = process.env.NODE_ENV === 'production';
export const SERVER_URL = isProd ? '/api/' : 'http://localhost:8080/';
export const CLIENT_VERSION = pjson.version;
export const REACT_VERSION = pjson.dependencies.react;

export const initColumns = [
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'code',
      editable: false,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'name',
      editable: true,
    },
    {
      title: 'Contenido',
      dataIndex: 'contenido',
      key: 'content',
      editable: true,
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      key: 'description',
      editable: true,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'price',
      editable: true,
    },
  ];

export function api(domain, action='' ,id='', options = { method: 'GET'}){
  const headers = {
    'Content-Type': 'application/json'
  }
  options['headers'] = headers
    return fetch(getResourceUrl(id, domain, action), options)
    .then(response => {
        if( domain === 'excel')
            return response.blob()
        else if( response.status === 204)
            return true
        else if( response.ok )
            return response.json()
        else    
            throw new Error("Producto Not Found")
    })
}

function getResourceUrl(id, domain, action){
    return `${SERVER_URL+domain}${id ? '/'+id : ''}${action ? "/"+action: ""}`
}

