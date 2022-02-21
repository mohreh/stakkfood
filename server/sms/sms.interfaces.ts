export interface GhasedakOptions {
  apiKey: string;
}

export interface SimpleMessage {
  message: string;
  receptor: string;
  linenumber: string;
  senddate?: string | Date;
  checkid?: string;
}
