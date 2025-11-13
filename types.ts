
export enum QrCodeType {
  URL = 'url',
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  SMS = 'sms',
  VCARD = 'vcard',
  LOCATION = 'location',
  WIFI = 'wifi',
  EVENT = 'event',
  BITCOIN = 'bitcoin',
  WHATSAPP = 'whatsapp',
}

export interface FormData {
  [key: string]: { [key:string]: any };
  url: { url: string };
  text: { text: string };
  email: { email: string; subject: string; message: string };
  phone: { phone: string };
  sms: { phone: string; message: string };
  vcard: {
    firstname: string; lastname: string; organization: string; position: string;
    phoneWork: string; phonePrivate: string; phoneMobile: string;
    email: string; website: string; street: string; zipcode: string;
    city: string; state: string; country: string;
  };
  location: { latitude: string; longitude: string };
  wifi: { ssid: string; password: string; encryption: 'WPA' | 'WEP' | 'nopass' };
  event: { title: string; location: string; startTime: string; endTime: string };
  bitcoin: { address: string; amount: string };
  whatsapp: { phone: string; message: string };
}

export interface QrConfig {
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  logo?: string;
  bodyShape: string;
  eyeFrameShape: string;
  eyeBallShape: string;
}

// FIX: Made properties of GroundingChunk optional to match the type from @google/genai.
export type GroundingChunk = {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri?: string;
            title?: string;
            text?: string;
        }[];
    }[]
  };
};
