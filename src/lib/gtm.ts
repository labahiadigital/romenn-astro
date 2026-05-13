/**
 * Helper de Google Tag Manager.
 *
 * Centraliza el push de eventos al `dataLayer` para usarlo desde los
 * formularios de la web. El evento `formulario_enviado` SOLO debe dispararse
 * cuando el backend confirma que el envío fue correcto (HTTP 2xx), nunca:
 *   - al pulsar el botón de envío
 *   - cuando falla la validación local
 *   - cuando la respuesta del backend NO es OK
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Empuja un evento al `dataLayer` de GTM de forma segura (SSR-friendly).
 */
export function pushDataLayer(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Marca un formulario como enviado correctamente.
 *
 * Llamar SOLO tras una respuesta OK del backend.
 *
 * @param formName Identificador opcional del formulario (contacto, valoracion, etc.)
 */
export function trackFormSubmit(formName?: string): void {
  pushDataLayer({
    event: "formulario_enviado",
    ...(formName ? { form_name: formName } : {}),
  });
}
