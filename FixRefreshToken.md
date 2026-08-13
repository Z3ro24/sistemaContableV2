# Documentación: Arquitectura y Solución de Refresco de Tokens JWT (`FixRefreshToken.md`)

Este documento resume la arquitectura implementada para la gestión y renovación automática de tokens de autenticación (JWT) en el frontend, así como las recomendaciones y próximos pasos para la evolución del sistema.

---

## 1. 🔍 El Problema Original (Condición de Carrera)

Cuando el **Access Token** de un usuario expiraba mientras navegaba en la aplicación, se producían peticiones HTTP paralelas (por ejemplo, cargar trabajadores, empresas y parámetros al mismo tiempo).

### Síntoma:
El usuario experimentaba un **pestañeo visual efímero a la pantalla de Login (`/`)** antes de volver a la vista solicitada.

### Causa Raíz:
- **Petición A** recibía un `401 Unauthorized` e iniciaba `POST /auth/refresh`. El backend rotaba el token de refresco en las cookies.
- **Petición B** (enviada al mismo milisegundo) también recibía un `401` e intentaba llamar a `POST /auth/refresh` usando el token anterior (que ya había sido rotado e invalidado por la Petición A).
- Al fallar la Petición B con 401 en `/auth/refresh`, ejecutaba el `catch` dispatching `logout()` y redirigiendo temporalmente a la pantalla de Login `/`.

---

## 2. 🛠️ Lo Que Se Implementó (Fase 1: Interceptor Reactivo con Cola Mutex)

Se modificó `frontend/src/services/apiService.ts` implementando una **cola de peticiones (*Failed Queue*)** y un cerrojo de refresco (*Mutex Flag* `isRefreshing`):

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               FLUJO CON COLA MUTEX IMPLEMENTADO EN AXIOS                                 │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                           │
│  Petición 1 (GET /companies) ──► 401 ──► (isRefreshing = false) ──► Inicia POST /auth/refresh            │
│                                                                           │                               │
│  Peticiones 2, 3 y 4        ──► 401 ──► (isRefreshing = true)  ──► Se agregan a `failedQueue`           │
│                                                                           │                               │
│                                                                           ▼                               │
│                                                                  Procesa `failedQueue`                    │
│                                                                  Reintenta Peticiones 2, 3 y 4            │
│                                                                  (Sin desloguear al usuario)              │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Código Implementado (`apiService.ts`):
```typescript
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearCsrfToken();
        store.dispatch(logout());
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 3. 🚀 Lo Que Se Puede Hacer a Futuro (Fase 2: Refresco Proactivo Silencioso)

Para evitar por completo que las peticiones lleguen a chocar con un `401 Unauthorized`, se recomienda implementar un **Silent Refresh Proactivo con Temporizador**.

### Concepto:
Si el *Access Token* vence cada 15 minutos (900 segundos), la aplicación puede programar un temporizador automático a los **14 minutos** para renovarlo en segundo plano de manera preventiva.

### Ejemplo de Implementación Futura (`useAuthInit.ts`):

```typescript
import { useEffect } from 'react';
import api from '../services/apiService';

export const useSilentRefresh = (tokenExpirationMinutes = 15) => {
  useEffect(() => {
    // Calcular intervalo a los 14 minutos (14 * 60 * 1000 = 840,000 ms)
    const refreshIntervalMs = (tokenExpirationMinutes - 1) * 60 * 1000;

    const timer = setInterval(async () => {
      try {
        // Solo refrescar si el usuario tiene la pestaña activa
        if (!document.hidden) {
          await api.post('/auth/refresh');
          console.log('[Auth] Token renovado proactivamente en segundo plano.');
        }
      } catch (error) {
        console.warn('[Auth] Falló el refresco proactivo silencioso.');
      }
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [tokenExpirationMinutes]);
};
```

### Ventajas de la Estrategia Híbrida Futura:
1. **Peticiones 100% Limpias**: Ninguna petición del usuario devolverá 401 mientras esté activo en la app.
2. **Red de Seguridad**: El interceptor con Cola Mutex actual seguirá activo como respaldo en caso de micro-cortes de red o reanudación de laptop tras hibernar.
