import { Injectable, isDevMode } from '@angular/core';

/**
 * LoggerService — centraliza el logging de la aplicacion.
 *
 * En modo desarrollo (ng serve) los mensajes aparecen normalmente
 * en la consola del navegador.
 * En produccion (ng build) todos los metodos son no-ops, evitando
 * fuga de informacion interna y ruido innecesario.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {

  private readonly isDev = isDevMode();

  /** Informacion general de depuracion (solo dev). */
  log(message: string, ...args: unknown[]): void {
    if (this.isDev) {
      console.log(`[LOG] ${message}`, ...args);
    }
  }

  /** Advertencias no criticas (solo dev). */
  warn(message: string, ...args: unknown[]): void {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Errores de operacion.
   * En desarrollo muestra el detalle completo.
   * En produccion solo registra un mensaje generico sin datos sensibles.
   */
  error(message: string, error?: unknown): void {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // En produccion: solo mensaje, sin stack trace ni datos del servidor.
      console.error(`[ERROR] ${message}`);
    }
  }
}
