export interface User {
  name: string;
  is_admin: boolean;
}

export interface EntityState {
  state: string;
}

export class HomeAssistant extends HTMLElement {
  hass: {
      user: User;
      config: {
          version: string;
      };
      language: string;
      resources: Record<string, Record<string, string>>;
      panelUrl: string;
      states: Record<string, EntityState>;
  }
}

export class Lovelace extends HTMLElement {
  lovelace: {
      config: {
          sip_mode: SIPConfig;
      };
      mode: string;
  }
}

export interface SIPClient {
  test?: boolean;
}

export interface SIPConfig {
  server?: string;
  port?: Number;
  ringtone?: string;
  ringbacktone?: string;
  auto_answer?: boolean;
  name?: string;
  extension?: Number;
  secret?: string;
}

declare global {
  interface Window {
    sipMode: SIPClient;
    sipModeEntities: Record<string, string[]>;
  }
}
