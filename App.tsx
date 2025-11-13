import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QrCodeType, FormData, QrConfig, GroundingChunk } from './types';
import { QR_CODE_TYPES, INITIAL_FORM_DATA, INITIAL_QR_CONFIG, LOGO_PRESETS, BODY_SHAPES, EYE_FRAME_SHAPES, EYE_BALL_SHAPES } from './constants';
import Accordion from './components/Accordion';
import { generateLocationDetails, generateEventDetails } from './services/geminiService';
import AIAssistant from './components/AIAssistant';
import { Download, Image as ImageIcon, Palette, Settings, Square, LoaderCircle } from 'lucide-react';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QrCodeType>(QrCodeType.URL);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [qrConfig, setQrConfig] = useState<QrConfig>(INITIAL_QR_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  
  const handleFormChange = useCallback((type: QrCodeType, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  }, []);

  const handleConfigChange = (field: keyof QrConfig, value: any) => {
    setQrConfig(prev => ({ ...prev, [field]: value }));
  };
  
  const generateQrContent = useCallback(() => {
    switch (activeTab) {
      case QrCodeType.URL: return formData.url.url;
      case QrCodeType.TEXT: return formData.text.text;
      case QrCodeType.EMAIL: {
        const data = formData.email;
        return `mailto:${data.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
      }
      case QrCodeType.PHONE: return `tel:${formData.phone.phone}`;
      case QrCodeType.SMS: {
        const data = formData.sms;
        return `SMSTO:${data.phone}:${data.message}`;
      }
      case QrCodeType.WIFI: {
        const data = formData.wifi;
        return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
      }
      case QrCodeType.LOCATION: {
        const data = formData.location;
        return `geo:${data.latitude},${data.longitude}`;
      }
      case QrCodeType.BITCOIN: {
        const data = formData.bitcoin;
        return `bitcoin:${data.address}?amount=${data.amount}`;
      }
      case QrCodeType.EVENT: {
        const data = formData.event;
        const formatVEventDate = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return `BEGIN:VEVENT\nSUMMARY:${data.title}\nLOCATION:${data.location}\nDTSTART:${formatVEventDate(data.startTime)}\nDTEND:${formatVEventDate(data.endTime)}\nEND:VEVENT`;
      }
      case QrCodeType.VCARD: {
        const data = formData.vcard;
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (data.firstname || data.lastname) vcard += `N:${data.lastname};${data.firstname}\n`;
        if (data.organization) vcard += `ORG:${data.organization}\n`;
        if (data.position) vcard += `TITLE:${data.position}\n`;
        if (data.phoneWork) vcard += `TEL;TYPE=WORK:${data.phoneWork}\n`;
        if (data.phonePrivate) vcard += `TEL;TYPE=HOME:${data.phonePrivate}\n`;
        if (data.phoneMobile) vcard += `TEL;TYPE=CELL:${data.phoneMobile}\n`;
        if (data.email) vcard += `EMAIL:${data.email}\n`;
        if (data.website) vcard += `URL:${data.website}\n`;
        if (data.street || data.city || data.state || data.zipcode || data.country) {
            vcard += `ADR;TYPE=HOME:;;${data.street};${data.city};${data.state};${data.zipcode};${data.country}\n`;
        }
        vcard += 'END:VCARD';
        return vcard;
      }
      case QrCodeType.WHATSAPP: {
        const data = formData.whatsapp;
        return `https://wa.me/${data.phone}?text=${encodeURIComponent(data.message)}`;
      }
      default: return '';
    }
  }, [activeTab, formData]);
  
  useEffect(() => {
    setIsLoading(true);
    const content = generateQrContent();

    if (!qrWrapperRef.current) return;

    if (!content) {
        qrWrapperRef.current.innerHTML = ''; // Clear QR code
        setIsLoading(false);
        return;
    }
    
    // Map human-friendly names to library-specific names
    const eyeFrameShape = qrConfig.eyeFrameShape === 'dots' ? 'dot' : qrConfig.eyeFrameShape;
    const eyeBallShape = qrConfig.eyeBallShape === 'dots' ? 'dot' : qrConfig.eyeBallShape;

    const options = {
        width: qrConfig.size,
        height: qrConfig.size,
        data: content,
        margin: 10,
        image: qrConfig.logo,
        dotsOptions: {
            color: qrConfig.foregroundColor,
            type: qrConfig.bodyShape,
        },
        backgroundOptions: {
            color: qrConfig.backgroundColor,
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.4
        },
        cornersSquareOptions: {
            color: qrConfig.foregroundColor,
            type: eyeFrameShape,
        },
        cornersDotOptions: {
            color: qrConfig.foregroundColor,
            type: eyeBallShape,
        },
    };

    if (!qrCodeRef.current) {
        qrCodeRef.current = new QRCodeStyling(options as any);
        qrWrapperRef.current.innerHTML = '';
        qrCodeRef.current.append(qrWrapperRef.current);
    } else {
        qrCodeRef.current.update(options as any);
    }
    setIsLoading(false);
  }, [generateQrContent, qrConfig]);

  const handleDownload = (format: 'png' | 'svg') => {
    if(!qrCodeRef.current) return;
    qrCodeRef.current.download({
        name: 'qrcode',
        extension: format
    });
  };
  
  const onLogoSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setLogoPreview(result);
            handleConfigChange('logo', result);
            setSelectedLogo(null);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handlePresetLogoSelect = (preset: {id: string, url: string}) => {
    setLogoPreview(preset.url);
    handleConfigChange('logo', preset.url);
    setSelectedLogo(preset.id);
  };

  const handleLocationAIAssist = (prompt: string): Promise<{ text: string, groundingChunks?: GroundingChunk[] | null }> => {
     return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const res = await generateLocationDetails(prompt, { latitude, longitude });
                resolve({ text: res.text, groundingChunks: res.candidates?.[0]?.groundingMetadata?.groundingChunks });
            },
            async () => { // Geolocation failed
                const res = await generateLocationDetails(prompt);
                resolve({ text: res.text, groundingChunks: res.candidates?.[0]?.groundingMetadata?.groundingChunks });
            }
        );
    });
  };

  const handleEventAIAssist = useCallback(async (prompt: string) => {
      const res = await generateEventDetails(prompt);
      return { text: res.text, groundingChunks: res.candidates?.[0]?.groundingMetadata?.groundingChunks };
  }, []);

  const renderForm = useMemo(() => {
    const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none";
    const labelClass = "block text-sm font-medium text-gray-300 mb-1";
    
    switch(activeTab) {
      case QrCodeType.URL: {
        const currentData = formData.url;
        return <div>
            <label className={labelClass} htmlFor="url">Your URL</label>
            <input
                type="url"
                id="url"
                value={currentData.url}
                onChange={e => handleFormChange(activeTab, 'url', e.target.value)}
                className={inputClass}
                placeholder="https://"
            />
        </div>;
      }
      case QrCodeType.TEXT: {
        const currentData = formData.text;
        return <div>
          <label className={labelClass} htmlFor="text">Your Text</label>
          <textarea id="text" value={currentData.text} onChange={e => handleFormChange(activeTab, 'text', e.target.value)} rows={4} className={inputClass}></textarea>
        </div>;
      }
      case QrCodeType.EMAIL: {
        const currentData = formData.email;
        return <div className="space-y-4">
            <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={currentData.email} onChange={e => handleFormChange(activeTab, 'email', e.target.value)} className={inputClass} placeholder="your@email.com"/>
            </div>
             <div>
                <label className={labelClass}>Subject</label>
                <input type="text" value={currentData.subject} onChange={e => handleFormChange(activeTab, 'subject', e.target.value)} className={inputClass} />
            </div>
             <div>
                <label className={labelClass}>Message</label>
                <textarea value={currentData.message} onChange={e => handleFormChange(activeTab, 'message', e.target.value)} className={inputClass} rows={3}></textarea>
            </div>
        </div>
      }
      case QrCodeType.PHONE: {
        const currentData = formData.phone;
        return <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={currentData.phone} onChange={e => handleFormChange(activeTab, 'phone', e.target.value)} className={inputClass} placeholder="+1234567890"/>
        </div>
      }
      case QrCodeType.SMS: {
         const currentData = formData.sms;
         return <div className="space-y-4">
             <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" value={currentData.phone} onChange={e => handleFormChange(activeTab, 'phone', e.target.value)} className={inputClass} placeholder="+1234567890"/>
            </div>
            <div>
                <label className={labelClass}>Message</label>
                <textarea value={currentData.message} onChange={e => handleFormChange(activeTab, 'message', e.target.value)} className={inputClass} rows={3}></textarea>
            </div>
         </div>
      }
      case QrCodeType.LOCATION: {
        const currentData = formData.location;
        return <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass} htmlFor="lat">Latitude</label>
                    <input type="text" id="lat" value={currentData.latitude} onChange={e => handleFormChange(activeTab, 'latitude', e.target.value)} className={inputClass}/>
                </div>
                <div>
                    <label className={labelClass} htmlFor="lon">Longitude</label>
                    <input type="text" id="lon" value={currentData.longitude} onChange={e => handleFormChange(activeTab, 'longitude', e.target.value)} className={inputClass}/>
                </div>
            </div>
            <AIAssistant 
                onGenerate={handleLocationAIAssist}
                onComplete={(data) => {
                    if (data.latitude && data.longitude) {
                       handleFormChange(activeTab, 'latitude', data.latitude);
                       handleFormChange(activeTab, 'longitude', data.longitude);
                    }
                }}
                parseResponse={(text) => {
                    const [lat, lon] = text.match(/-?\d+\.\d+/g) || [];
                    return { latitude: lat || '', longitude: lon || '' };
                }}
                placeholder="e.g., Eiffel Tower, Paris"
            />
        </div>;
      }
      case QrCodeType.EVENT: {
          const currentData = formData.event;
          return <div className="space-y-4">
              <div>
                  <label className={labelClass}>Event Title</label>
                  <input type="text" value={currentData.title} onChange={e => handleFormChange(activeTab, 'title', e.target.value)} className={inputClass} />
              </div>
              <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" value={currentData.location} onChange={e => handleFormChange(activeTab, 'location', e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className={labelClass}>Start Time</label>
                      <input type="datetime-local" value={currentData.startTime} onChange={e => handleFormChange(activeTab, 'startTime', e.target.value)} className={`${inputClass} text-gray-300`}/>
                  </div>
                  <div>
                      <label className={labelClass}>End Time</label>
                      <input type="datetime-local" value={currentData.endTime} onChange={e => handleFormChange(activeTab, 'endTime', e.target.value)} className={`${inputClass} text-gray-300`}/>
                  </div>
              </div>
              <AIAssistant
                  onGenerate={handleEventAIAssist}
                  onComplete={(data) => {
                     if (data.title) handleFormChange(activeTab, 'title', data.title);
                     if (data.location) handleFormChange(activeTab, 'location', data.location);
                     if (data.startTime) handleFormChange(activeTab, 'startTime', new Date(data.startTime).toISOString().slice(0, 16));
                     if (data.endTime) handleFormChange(activeTab, 'endTime', new Date(data.endTime).toISOString().slice(0, 16));
                  }}
                  parseResponse={(text) => {
                        try {
                            const cleanedText = text.replace(/```json|```/g, '').trim();
                            return JSON.parse(cleanedText);
                        } catch {
                            const titleMatch = text.match(/title:\s*"(.*?)"/i);
                            const locMatch = text.match(/location:\s*"(.*?)"/i);
                            return { title: titleMatch?.[1] || '', location: locMatch?.[1] || '' };
                        }
                  }}
                  placeholder="e.g., WWDC 2024"
              />
          </div>;
      }
       case QrCodeType.WHATSAPP: {
            const currentData = formData.whatsapp;
            return <div className="space-y-4">
                <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" value={currentData.phone} onChange={e => handleFormChange(activeTab, 'phone', e.target.value)} className={inputClass} placeholder="With country code, e.g., 1234567890" />
                </div>
                <div>
                    <label className={labelClass}>Message</label>
                    <textarea value={currentData.message} onChange={e => handleFormChange(activeTab, 'message', e.target.value)} className={inputClass} rows={3}></textarea>
                </div>
            </div>;
       }
      default:
        return <div>
          <p className="text-gray-400">This QR code type form is not yet implemented.</p>
        </div>
    }
  }, [activeTab, formData, handleEventAIAssist, handleFormChange, handleLocationAIAssist]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-gray-700/50">
        <div className="flex items-center" style={{ paddingLeft: '100px' }}>
            <Logo />
            <span className="ml-3 text-lg font-semibold text-gray-300 hidden sm:block">QR Creator</span>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <div className="bg-gray-800 rounded-lg shadow-2xl">
              <div className="p-2 border-b border-gray-700">
                 <div className="flex flex-wrap gap-1">
                  {QR_CODE_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === type.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                 </div>
              </div>
              
              <Accordion title="Enter Content" icon={<Settings size={20} />} isOpen={true}>
                {renderForm}
              </Accordion>
              
              <Accordion title="Set Colors" icon={<Palette size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Foreground Color</label>
                      <div className="relative">
                        <input type="color" value={qrConfig.foregroundColor} onChange={e => handleConfigChange('foregroundColor', e.target.value)} className="w-16 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                        <span className="ml-3 font-mono">{qrConfig.foregroundColor}</span>
                      </div>
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                      <div className="relative">
                        <input type="color" value={qrConfig.backgroundColor} onChange={e => handleConfigChange('backgroundColor', e.target.value)} className="w-16 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                         <span className="ml-3 font-mono">{qrConfig.backgroundColor}</span>
                      </div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Add Logo/Image" icon={<ImageIcon size={20} />}>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-500">
                        {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain"/> : <span className="text-xs text-gray-400">No Logo</span>}
                    </div>
                    <div>
                        <label htmlFor="logo-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-md transition-colors text-sm">
                            Upload Image
                        </label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={e => e.target.files && onLogoSelect(e.target.files[0])} />
                        {logoPreview && <button onClick={() => { setLogoPreview(''); handleConfigChange('logo', undefined); setSelectedLogo(null) }} className="ml-2 text-red-400 hover:text-red-500 text-sm">Remove</button>}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Or select a preset logo:</h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {LOGO_PRESETS.map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetLogoSelect(preset)}
                                title={preset.label}
                                className={`flex items-center justify-center p-2 rounded-md transition-colors aspect-square bg-gray-700 hover:bg-gray-600 ${selectedLogo === preset.id ? 'ring-2 ring-indigo-400' : ''}`}
                            >
                                <img src={preset.url} alt={preset.label} className="w-full h-full object-contain"/>
                            </button>
                        ))}
                    </div>
                </div>
              </Accordion>
              
              <Accordion title="Customize Design" icon={<Square size={20} />}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Body Shape</label>
                    <div className="grid grid-cols-3 gap-2">
                      {BODY_SHAPES.map(shape => (
                        <button key={shape} onClick={() => handleConfigChange('bodyShape', shape)} className={`px-3 py-2 text-sm rounded-md capitalize transition-colors ${qrConfig.bodyShape === shape ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                          {shape.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Eye Frame Shape</label>
                    <div className="grid grid-cols-3 gap-2">
                      {EYE_FRAME_SHAPES.map(shape => (
                        <button key={shape} onClick={() => handleConfigChange('eyeFrameShape', shape)} className={`px-3 py-2 text-sm rounded-md capitalize transition-colors ${qrConfig.eyeFrameShape === shape ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                           {shape.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Eye Ball Shape</label>
                    <div className="grid grid-cols-3 gap-2">
                      {EYE_BALL_SHAPES.map(shape => (
                        <button key={shape} onClick={() => handleConfigChange('eyeBallShape', shape)} className={`px-3 py-2 text-sm rounded-md capitalize transition-colors ${qrConfig.eyeBallShape === shape ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                           {shape.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
          
          <div className="w-full lg:w-2/5 xl:w-1/3 sticky top-24 self-start">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
                <div className="aspect-square bg-white p-4 rounded-md relative flex items-center justify-center">
                    {isLoading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"><LoaderCircle className="animate-spin text-indigo-600" size={48} /></div>}
                    <div ref={qrWrapperRef} className="w-full h-full [&>canvas]:w-full [&>canvas]:h-auto [&>svg]:w-full [&>svg]:h-auto" />
                    {!generateQrContent() && !isLoading && <div className="absolute text-gray-500">QR Code will appear here</div>}
                </div>
                
                <div className="mt-6">
                     <label className="block text-sm font-medium text-gray-300">Quality / Size ({qrConfig.size}px)</label>
                     <input type="range" min="128" max="2048" step="128" value={qrConfig.size} onChange={e => handleConfigChange('size', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"/>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <button onClick={() => handleDownload('png')} disabled={!generateQrContent() || isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                        <Download size={18}/> Download PNG
                    </button>
                     <button onClick={() => handleDownload('svg')} disabled={!generateQrContent() || isLoading} className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-gray-300 font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                        Download SVG
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
