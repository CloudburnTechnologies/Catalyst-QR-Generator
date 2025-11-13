
import React from 'react';
import { QrCodeType, FormData, QrConfig } from './types';
import { 
  Globe, Type, Mail, Phone, MessageSquare, User, MapPin, Wifi, Calendar, Bitcoin,
  MessageCircle
} from 'lucide-react';

export const QR_CODE_TYPES = [
  { id: QrCodeType.URL, label: 'URL', icon: <Globe size={18} /> },
  { id: QrCodeType.TEXT, label: 'Text', icon: <Type size={18} /> },
  { id: QrCodeType.EMAIL, label: 'Email', icon: <Mail size={18} /> },
  { id: QrCodeType.PHONE, label: 'Phone', icon: <Phone size={18} /> },
  { id: QrCodeType.SMS, label: 'SMS', icon: <MessageSquare size={18} /> },
  { id: QrCodeType.VCARD, label: 'vCard', icon: <User size={18} /> },
  { id: QrCodeType.LOCATION, label: 'Location', icon: <MapPin size={18} /> },
  { id: QrCodeType.WIFI, label: 'WIFI', icon: <Wifi size={18} /> },
  { id: QrCodeType.EVENT, label: 'Event', icon: <Calendar size={18} /> },
  { id: QrCodeType.BITCOIN, label: 'Bitcoin', icon: <Bitcoin size={18} /> },
  { id: QrCodeType.WHATSAPP, label: 'WhatsApp', icon: <MessageCircle size={18} /> },
];

export const INITIAL_FORM_DATA: FormData = {
  url: { url: 'https://www.google.com' },
  text: { text: 'Hello World!' },
  email: { email: '', subject: '', message: '' },
  phone: { phone: '' },
  sms: { phone: '', message: '' },
  vcard: {
    firstname: '', lastname: '', organization: '', position: '',
    phoneWork: '', phonePrivate: '', phoneMobile: '',
    email: '', website: '', street: '', zipcode: '',
    city: '', state: '', country: '',
  },
  location: { latitude: '40.7128', longitude: '-74.0060' },
  wifi: { ssid: '', password: '', encryption: 'WPA' },
  event: { title: '', location: '', startTime: new Date().toISOString().slice(0, 16), endTime: new Date().toISOString().slice(0, 16) },
  bitcoin: { address: '', amount: '' },
  whatsapp: { phone: '', message: '' },
};

export const INITIAL_QR_CONFIG: QrConfig = {
  size: 512,
  foregroundColor: '#0d1f39',
  backgroundColor: '#ffffff',
  bodyShape: 'square',
  eyeFrameShape: 'square',
  eyeBallShape: 'square',
};

export const BODY_SHAPES = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
export const EYE_FRAME_SHAPES = ['square', 'dots', 'extra-rounded'];
export const EYE_BALL_SHAPES = ['square', 'dots', 'stars', 'ducks', 't-rex', 'robot emoji', 'Emoji'];

export const LOGO_PRESETS = [
  // Social Media
  { id: 'facebook', label: 'Facebook', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1200px-2021_Facebook_icon.svg.png' },
  { id: 'instagram', label: 'Instagram', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
  { id: 'twitter', label: 'Twitter', url: 'https://img.icons8.com/?size=100&id=yoQabS8l0qpr&format=png&color=000000' },
  { id: 'vimeo', label: 'Vimeo', url: 'https://img.icons8.com/?size=100&id=21048&format=png&color=000000' },
  { id: 'youtube', label: 'YouTube', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png' },
  { id: 'google', label: 'Google', url: 'https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
  { id: 'pinterest', label: 'Pinterest', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png' },
  { id: 'whatsapp', label: 'Whatsapp', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png' },
  // Email & Communication
  { id: 'email', label: 'Email', url: 'https://cdn-icons-png.flaticon.com/512/732/732200.png' },
  { id: 'sms', label: 'SMS/Text', url: 'https://img.icons8.com/?size=100&id=eAI6V8tuK5nR&format=png&color=000000' },
  { id: 'gmail', label: 'Gmail', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/1200px-Gmail_icon_%282020%29.svg.png' },
  { id: 'outlook', label: 'Outlook', url: 'https://img.icons8.com/?size=100&id=ut6gQeo5pNqf&format=png&color=000000' },
  { id: 'phone', label: 'Phone', url: 'https://img.icons8.com/?size=100&id=9730&format=png&color=081BBD' },
  // Other
  { id: 'bitcoin', label: 'Bitcoin', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png' },
  { id: 'googleplay', label: 'Google Play', url: 'https://img.icons8.com/?size=100&id=22988&format=png&color=000000' },
  { id: 'appstore', label: 'Apple App Store', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/1200px-App_Store_%28iOS%29.svg.png' },
  { id: 'calendar', label: 'Calendar', url: 'https://cdn-icons-png.flaticon.com/512/591/591576.png' },
  { id: 'pdf', label: 'PDF', url: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' },
  { id: 'wifi', label: 'WiFi', url: 'https://img.icons8.com/?size=100&id=13047&format=png&color=081BBD' },
  { id: 'share', label: 'Share', url: 'https://img.icons8.com/?size=100&id=Dg4oPBhHsupv&format=png&color=081BBD' },
];
