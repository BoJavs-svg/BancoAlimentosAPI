```markdown
# Documentación de Rutas

## Obtener Posts

- **Ruta**: `GET /getPosts`
- **Descripción**: Recupera todos los posts disponibles.
- **Output**:
  ```json
  {
    "message": "Posts retrieved",
    "posts": [Array de objetos de posts]
  }
  ```

## Obtener Comentarios

- **Ruta**: `GET /getComments/:postId`
- **Parámetros**:
  - `postId`: Identificador único del post.
- **Descripción**: Recupera los comentarios asociados a un post específico.
- **Output**:
  ```json
  {
    "message": "Comments retrieved",
    "comments": [Array de objetos de comentarios]
  }
  ```

## Obtener Pollito

- **Ruta**: `GET /getPollito/:polloId`
- **Parámetros**:
  - `polloId`: Identificador único del pollito.
- **Descripción**: Recupera información sobre un pollito específico.
- **Output**:
  ```json
  {
    "message": "Pollo received",
    "pollo": [Objeto de información sobre el pollito]
  }
  ```

## Autenticar Token de Sesión

- **Ruta**: `GET /authSessionToken/:sessionToken`
- **Parámetros**:
  - `sessionToken`: Token de sesión del usuario.
- **Descripción**: Autentica un token de sesión de usuario.
- **Output**:
  ```json
  {
    "user": [Objeto de información del usuario autenticado]
  }
  ```

## Registrarse como Usuario

- **Ruta**: `POST /userSignUp`
- **Descripción**: Registra un nuevo usuario.
- **Output**:
  ```json
  {
    "message": "New object created successfully"
  }
  ```

## Iniciar Sesión de Usuario

- **Ruta**: `POST /userLogin`
- **Descripción**: Inicia sesión de usuario.
- **Output**:
  ```json
  {
    "user": [Objeto de información del usuario autenticado]
  }
  ```

## Crear Nuevo Post

- **Ruta**: `POST /post`
- **Descripción**: Crea un nuevo post.
- **Output**:
  ```json
  {
    "message": "New post created successfully"
  }
  ```

## Crear Nuevo Comentario

- **Ruta**: `POST /comment`
- **Descripción**: Crea un nuevo comentario en un post.
- **Output**:
  ```json
  {
    "message": "New comment created successfully"
  }
  ```

## Crear Nuevo Pollito

- **Ruta**: `POST /pollo`
- **Descripción**: Crea un nuevo pollito.
- **Output**:
  ```json
  {
    "message": "New pollo created successfully"
  }
  ```

## Dar Like a un Post

- **Ruta**: `PATCH /likePost/:postId/:like`
- **Descripción**: Da like a un post.
- **Output**:
  ```json
  {
    "message": "Post liked successfully"
  }
  ```

## Dar Like a un Comentario

- **Ruta**: `PATCH /likeComment/:commentId/:like`
- **Descripción**: Da like a un comentario.
- **Output**:
  ```json
  {
    "message": "Comment liked successfully"
  }
  ```

## Ver un Post

- **Ruta**: `PATCH /view/:postId`
- **Descripción**: Incrementa las vistas de un post.
- **Output**:
  ```json
  {
    "message": "Post viewed successfully"
  }
  ```

## Editar un Post

- **Ruta**: `PATCH /editPost/:postId`
- **Descripción**: Edita el contenido de un post.
- **Output**:
  ```json
  {
    "message": "Post updated successfully"
  }
  ```

## Reportar Contenido

- **Ruta**: `PATCH /report/:postId`
- **Descripción**: Reporta un post.
- **Output**:
  ```json
  {
    "message": "Reported successfully"
  }
  ```

## Reportar un Post

- **Ruta**: `PATCH /reportPost/:postId`
- **Descripción**: Reporta un post específico.
- **Output**:
  ```json
  {
    "message": "Post reported successfully"
  }
  ```

## Obtener Pollito por ID

- **Ruta**: `GET /getPollito/:polloId`
- **Parámetros**:
  - `polloId`: Identificador único del pollito.
- **Descripción**: Recupera información sobre un pollito específico por su ID.
- **Output**:
  ```json
  {
    "message": "Pollo received",
    "pollo": [Objeto de información sobre el pollito]
  }
  ```

## Actualizar Pollito

- **Ruta**: `PATCH /patchPollito/:polloId`
- **Parámetros**:
  - `polloId`: Identificador único del pollito.
  - `nApple`: Número de manzanas del pollito.
- **Descripción**: Actualiza el número de manzanas de un pollito.
- **Output**:
  ```json
  {
    "message": "Pollito changed successfully"
  }
  ```
```
