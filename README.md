# Food Store

Trabajo Práctico Integrador de Programación 4 · UTN  
**Alumno:** Juan Cruz Leal

Desarrollé Food Store para consultar el catálogo, armar un carrito y hacer pedidos con entrega a domicilio. El administrador maneja el catálogo, el stock, las cuentas y el estado de los pedidos. El cliente elige efectivo o transferencia al confirmar el pedido.

## Repositorio y video

- [Repositorio público del proyecto en GitHub](https://github.com/juansantafe7/TPI-Programacion-4-Food-Store)
- [Video de demostración en Google Drive](https://drive.google.com/file/d/1JXFcaQtCXZpum7oVRBL6jfOTF4xRnpfX/view)

## Requisitos

- Python 3.11 a 3.13. Los comandos de Windows usan Python 3.13.
- PostgreSQL 15 o superior en ejecución. Para desarrollo también se puede usar SQLite.
- Node.js 20.19+ de la rama 20 o Node.js 22.12+.
- pnpm 9 o superior.

## Backend

En pgAdmin, abrí Query Tool conectado a la base `postgres` y ejecutá una vez:

```sql
CREATE DATABASE foodstore_db;
```

Usá una base nueva para el TPI porque el modelo de las unidades anteriores tiene otras tablas y columnas. Desde Git Bash en Windows, ubicado en la carpeta que contiene este README:

```bash
cd backend
py -3.13 -m venv .venv
source .venv/Scripts/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

En Linux o macOS usá `python3 -m venv .venv` y `source .venv/bin/activate`. Si en Windows tenés Python 3.12, reemplazá `py -3.13` por `py -3.12`.

Editá `backend/.env` con tu usuario y contraseña de PostgreSQL. Si la contraseña incluye caracteres reservados para una URL, codificalos en la cadena. Por ejemplo, `@` se escribe `%40`. Después, con el entorno virtual activo:

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

- API REST en <http://localhost:8000/api/v1>
- Swagger en <http://localhost:8000/docs>
- ReDoc en <http://localhost:8000/redoc>

El seed crea el administrador **`admin` / `Admin1234!`**, tres categorías y ocho productos con stock e imágenes. Se puede ejecutar de nuevo sin duplicar los registros ni sobrescribir su stock. Para probar la compra como cliente, creá una cuenta desde **Registrarme**.

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión. Ejemplo: `postgresql://postgres:TU_CLAVE@localhost:5432/foodstore_db`. Para una base local SQLite usá `sqlite:///./foodstore.db`. |
| `SECRET_KEY` | Clave de firma del JWT. Usá un valor propio de al menos 32 caracteres. |
| `ALGORITHM` | Algoritmo de firma. El ejemplo usa `HS256`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token y la cookie. El ejemplo usa `30`. |
| `FRONTEND_ORIGIN` | Origen habilitado por CORS con credenciales. El ejemplo usa `http://localhost:5173`. |

## Frontend

Abrí otra terminal en la carpeta que contiene este README.

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm build
pnpm dev
```

Entrá en <http://localhost:5173>. Usá `localhost` en ambas direcciones para que la sesión use el mismo host.

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | URL base de Axios. El ejemplo usa `http://localhost:8000/api/v1`. |

## Cliente y administración

| Pantalla | Qué se puede hacer |
| --- | --- |
| `/`, `/carrito` | Buscar por nombre, filtrar por categoría, avanzar de página y armar un carrito que se conserva al recargar. |
| `/register`, `/login` | Crear una cuenta de cliente e iniciar sesión con nombre de usuario y contraseña. |
| `/checkout`, `/mis-pedidos` | Confirmar el pedido con dirección y forma de pago, consultar el detalle y cancelar un pedido propio pendiente. |
| `/admin/resumen`, `/admin/pedidos` | Consultar indicadores, filtrar pedidos, ver los detalles, avanzar el estado o cancelar. |
| `/admin/categorias`, `/admin/productos`, `/admin/usuarios` | Administrar el catálogo, ajustar stock y disponibilidad, y activar o desactivar cuentas. |

## Cómo se guarda un pedido

El router valida la solicitud y obtiene el usuario de la sesión. El servicio de pedidos abre un Unit of Work y usa sus repositorios con una sola sesión de base de datos. Mientras recorre los productos, comprueba disponibilidad y stock, descuenta las unidades y arma las líneas con una copia del nombre y del precio. Si falla una línea, se revierte la transacción completa.

El cliente puede cancelar un pedido propio mientras esté pendiente. El administrador puede avanzar a preparación y entrega o cancelar un pedido pendiente o en preparación. La cancelación devuelve al stock las cantidades de las líneas en la misma transacción. El resumen cuenta los pedidos del día con fecha UTC y suma los importes de los entregados.

El frontend usa TanStack Query para consultar la API y actualizar el catálogo, los pedidos y el resumen después de una operación. Zustand conserva el carrito y los datos públicos del perfil. Al abrir la aplicación se verifica la sesión con `/auth/me`. El JWT viaja en una cookie HttpOnly y la API controla los permisos en cada operación protegida.

## Validación

Probé el registro, la sesión, el recorrido de compra y las operaciones del administrador. En los pedidos comprobé el descuento de stock, la devolución al cancelar y el rechazo de operaciones que no corresponden al estado o al usuario.

| Caso | Comprobación |
| --- | --- |
| Registro y sesión | Registro con rol cliente, duplicado rechazado, inicio de sesión, cookie HttpOnly, recarga y cierre de sesión. |
| Catálogo y compra | Búsqueda y paginación, carrito persistido, detalle con nombre y precio de compra, descuento de stock y redirección a Mis pedidos. |
| Reglas de pedido | Rechazo si hay productos repetidos, stock insuficiente, datos inválidos o una transición prohibida. Un pedido ajeno queda fuera del listado del cliente. |
| Cancelación | El pedido pasa a cancelado y se restituye el stock. Una segunda cancelación se rechaza. |
| Administración | CRUD de categorías y productos, cambio de stock y disponibilidad, gestión de usuarios, estados e ingresos de entregas. |

En el video muestro el registro y la compra con una cuenta de cliente. Después cancelo el primer pedido y verifico que la pizza napolitana vuelve de 12 a 14 unidades. Con el segundo pedido muestro el cambio a preparación y entrega, el resumen, la gestión de usuarios y la edición de una categoría.
