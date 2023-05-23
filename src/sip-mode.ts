import { localize } from './localize/localize';

import { ConInfo } from './conf-info';
import { HomeAssistant, Lovelace, SIPClient, SIPConfig, User } from '@types';

import { UA, WebSocketInterface } from "jssip/lib/JsSIP";
import { RTCSessionEvent } from "jssip/lib/UA";
import { EndEvent, PeerConnectionEvent, IncomingEvent, OutgoingEvent, IceCandidateEvent, RTCSession } from "jssip/lib/RTCSession";

import {
  ELEMENT, MAX_ATTEMPTS, RETRY_DELAY,
} from '@constants';

export class SIPMode implements SIPClient {
  constructor() {
    window.sipModeEntities = {};
    this.ha = document.querySelector<HomeAssistant>(ELEMENT.HOME_ASSISTANT);
    this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;
    this.user = this.ha.hass.user;
    this.llAttempts = 0;

    this.run();

    // TODO CHECK CONFIG
    if (this.server == "") {
      console.log("NO SERVER. NOT INITALIZING");
      return;
    }

    this.currentCamera = undefined;
  }

  public run(lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE)) {
    if (!lovelace) {
      return;
    }
    this.lovelace = lovelace;
    this.getConfig();

    console.log("SIPMode (server = " + this.server + ", port = " + this.port + ", ringtone = " + this.ringtone + ", ringbacktone = " + this.ringbacktone +
      ", auto_answer = " + this.auto_answer + ",. name = " + this.name + ", extension = " + this.extension + ", secret = " + this.secret);

    return;
  }

  protected getConfig() {
    this.llAttempts++;
    try {
      const llConfig = this.lovelace.lovelace.config;
      const config = llConfig.sip_mode || {};
      this.processConfig(config);
    } catch (e) {
      if (this.llAttempts < MAX_ATTEMPTS) {
        setTimeout(() => this.getConfig(), RETRY_DELAY);
      } else {
        console.log('Lovelace config not found, continuing with default configuration.');
        console.log(e);
        this.processConfig({});
      }
    }

    return;
  }

  protected processConfig(config: SIPConfig) {
    this.server = "";
    this.port = 0;
    this.ringtone = "";
    this.ringbacktone = "";
    this.auto_answer = false;
    this.name = "";
    this.extension = 0;
    this.secret = "";

    this.mode = this.lovelace.lovelace.mode;
    this.huiRoot = this.lovelace.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;

    this.server = config.server ? config.server : "";
    this.port = config.port ? config.port : 0;
    this.ringtone = config.ringtone ? config.ringtone : "";
    this.ringbacktone = config.ringbacktone ? config.ringbacktone : "";
    this.auto_answer = config.auto_answer ? config.auto_answer : false;
    this.name = config.name ? config.name : "";
    this.extension = config.extension ? config.extension : 0;
    this.secret = config.secret ? config.secret : "";

    return;
  }

  // Elements
  private ha: HomeAssistant;
  private main: ShadowRoot;
  private user: User;
  private huiRoot: ShadowRoot;
  private lovelace: Lovelace;
  private drawerLayout: HTMLElement;
  private mode: string;
  private llAttempts: number;

  // Config
  private server: string;
  private port: Number;
  private ringtone: string;
  private ringbacktone: string;
  private auto_answer: boolean;
  private name: string;
  private extension: Number;
  private secret: string;

  // JSSip
  private sipPhone: UA | undefined;
  private sipPhoneSession: RTCSession | null;
  private sipCallOptions: any;

  private config: any;
  private hass: any;
  private timerElement: string = "00:00";
  private currentCamera: any;
  private intervalId!: number;
  private error: any = null;
  private audioVisualizer: any;
  private callStatus: string = "Idle";
  private user_extension: string = "None";
  private card_title: string = "Unknown";
  private connected: boolean = false;

  // Public
  public test: boolean;


  // TODO

  endCall() {

  }

  async connect() {

  }

}

{/* <ha-icon-button slot="actionItems" .label="TEST" .path="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"></ha-icon-button> */}



// Console tag
const info = new ConInfo();
info.log();

// Initial Run
Promise.resolve(customElements.whenDefined("hui-view")).then(() => {
  window.sipMode = new SIPMode();
});