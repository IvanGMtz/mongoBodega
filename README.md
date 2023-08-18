# mongoDB

mongoDB es una aplicación de gestión de bodegas y productos, construida con Node.js y una base de datos MongoDB. Esta aplicación te permite administrar tus inventarios de manera eficiente y organizada. A continuación, encontrarás información detallada sobre cómo configurar y ejecutar el proyecto.

## Requerimientos

El proyecto está desarrollado utilizando Node.js y MongoDB, por lo que necesitarás lo siguiente para ejecutarlo:

- Node.js ([https://nodejs.org](https://nodejs.org/)) - Verifica que la versión instalada sea compatible con las dependencias del proyecto. Se recomienda la versión 18.16.0 de Node.js.
- MongoDB Atlas (https://www.mongodb.com/cloud/atlas) - Se requiere una base de datos MongoDB en línea para almacenar la información del proyecto.

## Configuración del archivo .env

Crea un archivo `.env` en la raíz del proyecto, configura las variables de entorno necesarias y la conexión a la base de datos. Un ejemplo de cómo configurar el archivo `.env` se proporciona en el archivo `.env.example`:

```json
MY_SERVER={"hostname":"127.10.10.15", "port":"3001"}

ATLAS_USER="tu_usuario_de_MongoDB_Atlas"
ATLAS_PASSWORD="tu_contraseña_de_MongoDB_Atlas"
ATLAS_DB="nombre_de_tu_base_de_datos_en_Atlas"
```

## Instalación de Dependencias

Ejecuta el siguiente comando en la terminal para instalar las dependencias necesarias:

```
npm install
```

## Montar el Servidor

Una vez configuradas las variables de entorno, puedes iniciar el servidor con el siguiente comando:

```
npm run dev
```

## Petición

Para de interactuar con los endpoints puedes hacerlo mediante la siguiente petición GET:

```
GET http://127.10.10.15:3001/<nombre_endpoint>
```

## Endpoints Disponibles

### Listar Bodegas

Endpoint: `GET /bodega`

Este endpoint te permite listar todas las bodegas registradas en el sistema, ordenadas alfabéticamente.

### Crear Bodega

Endpoint: `POST /bodega`

Crea una nueva bodega en el sistema. Los datos de entrada deben incluir:

- `nombre`: Nombre de la bodega.
- `id_responsable`: ID del responsable de la bodega.
- `estado`: Estado de la bodega.

### Listar Productos por Total Descendente

Endpoint: `GET /producto`

Obtén la lista de todos los productos ordenados en orden descendente según el campo "Total", que representa la cantidad total de unidades considerando todas las bodegas.

### Insertar Producto en Inventario

Endpoint: `POST /inventario`

Agrega un nuevo producto al inventario en una bodega por defecto. Los parámetros de entrada deben incluir:

- `id_producto`: ID del producto a insertar.
- `cantidad`: Cantidad inicial del producto en el inventario.

### Insertar o Actualizar Registro en Inventario

Endpoint: `POST /inventario`

Inserta o actualiza un registro en la tabla de inventarios. Los parámetros de entrada deben incluir:

- `id_producto`: ID del producto.
- `id_bodega`: ID de la bodega.
- `cantidad`: Cantidad a insertar o sumar al inventario existente.

## Ejemplos de Datos

Bodegas:

```json
{
    "_id": "64de98b3c4c23cafeebe25ba",
    "id": 29,
    "nombre": "Almacén Atuesta 555",
    "id_responsable": 11,
    "estado": 11,
    "created_at": "2022-07-21T00:00:00.000Z",
    "updated_at": "2022-07-21T00:00:00.000Z"
}
```

Usuarios:

```json
{
    "_id": "64de98b1c4c23cafeebe2594",
    "id": 1,
    "nombre": "Alejandro",
    "email": "alejandro@example.com",
    "estado": 1,
    "password": "12345"
}
```

Productos:

```json
{
    "nombre": "Gafas",
    "estado": 1,
    "created_by": 11,
    "total": 149995
}
```

Inventarios:

```json
{
    "_id": "64de98b5c4c23cafeebe25c6",
    "id": 1,
    "id_bodega": 1,
    "id_producto": 3,
    "cantidad": 103,
    "created_by": 11,
    "created_at": "2023-05-26"
}
```

## Dependencias Utilizadas

Este proyecto utiliza diversas dependencias para su funcionamiento. A continuación, se detallan las dependencias principales y sus respectivas versiones:

- **express**: 4.18.2 Express es un marco de aplicación web rápido, minimalista y flexible para Node.js. Es utilizado en este proyecto para manejar las rutas y la lógica de la aplicación.

- **dotenv**: 16.3.1 Dotenv es una librería que permite cargar variables de entorno desde un archivo `.env`. En este proyecto, se utiliza para gestionar las configuraciones sensibles.
- **express-rate-limit**: 6.8.1 Express Rate Limit es un middleware que proporciona limitación de velocidad y control de la frecuencia de las solicitudes HTTP. Se utiliza aquí para prevenir ataques de fuerza bruta y abusos.
- **mongodb**: 5.7.0 MongoDB es una base de datos NoSQL ampliamente utilizada. En este proyecto, se usa para almacenar y recuperar datos relacionados con el alquiler de autos.
- **nodemon**: 3.0.1 Nodemon es una herramienta que ayuda en el desarrollo al reiniciar automáticamente la aplicación cuando se detectan cambios en el código fuente. Esto agiliza el proceso de desarrollo y prueba.