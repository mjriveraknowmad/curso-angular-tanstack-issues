
# Angular + TanStack Query — Proyecto del curso

Proyecto de ejemplo creado durante el curso "Angular - Pro: Siguiente Nivel" (Fernando Herrera) para practicar Angular y TanStack Query (React Query para Angular).

**Estado:** proyecto didáctico, no listo para producción sin configurar variables de entorno.

**Repositorio:** contenido local del curso, código fuente en `src/`.

**Prerequisitos**
- Node.js (16+ recomendado) y npm o pnpm

**Instalación**
```bash
npm install
```

**Desarrollo**
```bash
npm start
```

**Tests**
```bash
npm test
```

**Estructura relevante**
- Código principal: `src/app/`
- Entornos: `src/environments/`

Configuración de entornos (IMPORTANTE antes de desplegar)
- Renombrar los archivos de ejemplo y editarlos con tus secretos:
	- [src/environments/environment.development.example.ts](src/environments/environment.development.example.ts) → [src/environments/environment.development.ts](src/environments/environment.development.ts)
	- [src/environments/environment.example.ts](src/environments/environment.example.ts) → [src/environments/environment.ts](src/environments/environment.ts)

- Dentro de los archivos resultantes, añade el token de GitHub y cualquier otra clave necesaria. Ejemplo de contenido mínimo:
```ts
export const environment = {
	production: false,
	githubToken: 'TU_TOKEN_DE_GITHUB_AQUI'
}
```


**Build / Producción**
- Antes de ejecutar `npm run build` o desplegar, asegúrate de haber creado y configurado `src/environments/environment.ts` y `src/environments/environment.development.ts` con los tokens correctos.

**Descripción breve del flujo**
- El proyecto consume la API pública de GitHub para listar issues y etiquetas; por eso necesita un token para evitar límites de tasa y acceder a endpoints protegidos.
- La integración con TanStack Query facilita la gestión del cache y las peticiones en los servicios de `src/app/modules/issues/services/`.

**Recursos**
- Curso: "Angular - Pro: Siguiente Nivel" — Fernando Herrera (Udemy)
