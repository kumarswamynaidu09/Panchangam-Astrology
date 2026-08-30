import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { AppState } from '../types';

interface ResultsScreenProps {
  appState: AppState;
  onBack: () => void;
}

export default function ResultsScreen({ appState, onBack }: ResultsScreenProps) {
  let { birthDetails, locationDetails, panchangaData, planetaryPositions, lagnaData, jatakaData } = appState;

  const captureRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, { 
        pixelRatio: 2,
        filter: (node) => {
          return !(node instanceof HTMLElement && node.classList.contains('no-print'));
        }
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'janma_kundali.png';
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  const downloadAsPDF = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, { 
        pixelRatio: 2,
        filter: (node) => {
          return !(node instanceof HTMLElement && node.classList.contains('no-print'));
        }
      });
      const width = captureRef.current.offsetWidth;
      const height = captureRef.current.offsetHeight;
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save('janma_kundali.pdf');
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  // MOCK DATA OVERRIDE FOR DEMO
  panchangaData = {
    dateGregorian: "15-08-1990",
    dayOfWeek: "బుధవారం",
    tithi: "శుక్ల పక్ష పంచమి",
    nakshatra: "రోహిణి",
    yoga: "శోభన",
    karana: "బవ",
    sunrise: "06:15 AM",
    sunset: "06:30 PM",
    lagna: "వృషభ లగ్నం",
    rashi: "వృషభ రాశి"
  };

  planetaryPositions = [
    { planet: "రవి", rashi: "సింహ", degree: "12° 45'", nakshatra: "మఖ", pada: "1", colorClass: "text-[#D32F2F]", icon: "light_mode" },
    { planet: "చంద్ర", rashi: "వృషభ", degree: "05° 20'", nakshatra: "రోహిణి", pada: "2", colorClass: "text-[#1976D2]", icon: "dark_mode" },
    { planet: "కుజ", rashi: "మేష", degree: "18° 10'", nakshatra: "భరణి", pada: "3", colorClass: "text-[#C2185B]", icon: "local_fire_department" },
    { planet: "బుధ", rashi: "కన్య", degree: "02° 35'", nakshatra: "ఉత్తర ఫల్గుణి", pada: "4", colorClass: "text-[#388E3C]", icon: "psychology" },
    { planet: "గురు", rashi: "ధనుస్సు", degree: "25° 50'", nakshatra: "పూర్వాషాడ", pada: "1", colorClass: "text-[#F57C00]", icon: "school" },
    { planet: "శుక్ర", rashi: "తుల", degree: "10° 15'", nakshatra: "స్వాతి", pada: "2", colorClass: "text-[#E64A19]", icon: "favorite" },
    { planet: "శని", rashi: "మకరం", degree: "22° 40'", nakshatra: "శ్రవణ", pada: "3", colorClass: "text-[#1976D2]", icon: "work" },
    { planet: "రాహు", rashi: "కుంభం", degree: "15° 00'", nakshatra: "శతభిషం", pada: "4", colorClass: "text-[#455A64]", icon: "all_inclusive" },
    { planet: "కేతు", rashi: "సింహ", degree: "15° 00'", nakshatra: "మఖ", pada: "2", colorClass: "text-[#5D4037]", icon: "brightness_3" },
  ];

  lagnaData = {
    lagnaName: "వృషభ",
    lagnaDegree: "10°",
    chart: {
      "vrushabham": ["చంద్ర", "లగ్నం"],
      "mesham": ["కుజ"],
      "simham": ["రవి", "కేతు"],
      "kanya": ["బుధ"],
      "thula": ["శుక్ర"],
      "dhanussu": ["గురు"],
      "makaram": ["శని"],
      "kumbham": ["రాహు"],
    }
  };

  jatakaData = {
    ayanamsa: "23° 45' 12\"",
    kalamanam: "చాంద్రమానం",
    dinaSankhya: "145",
    samvatsaram: "ప్రమోదూత",
    rutuvu: "వర్ష రుతువు",
    masam: "శ్రావణ మాసం",
    paksham: "శుక్ల పక్షం",
    dasaBalance: "చంద్ర దశ 4 సం. 2 నె. 10 రో."
  };

  const rasiKeyToTeluguMap: Record<string, string[]> = {
    "meenam": ["మీన", "మీనం"],
    "mesham": ["మేష", "మేషం"],
    "vrushabham": ["వృషభ", "వృషభం"],
    "mithunam": ["మిథున", "మిథునం"],
    "karkatakam": ["కర్కాటక", "కర్కాటకం"],
    "simham": ["సింహ", "సింహం"],
    "kanya": ["కన్య"],
    "thula": ["తుల", "తులా"],
    "vruschikam": ["వృశ్చిక", "వృశ్చికం"],
    "dhanussu": ["ధనుస్సు", "ధనుర్"],
    "makaram": ["మకర", "మకరం"],
    "kumbham": ["కుంభ", "కుంభం"],
  };

  const renderChartCell = (
    title: string, 
    rasiKey: string, 
    isCenter = false,
    outerLabel?: { text: string, pos: 'top' | 'right' | 'bottom' | 'left' }
  ) => {
    if (isCenter) {
      return (
        <div className="chart-cell-center">
        </div>
      );
    }
    
    const matchStrings = rasiKeyToTeluguMap[rasiKey] || [];
    const planetsInThisRasi = planetaryPositions
      .filter(p => matchStrings.some(match => p.rashi.includes(match)))
      .map(p => p.planet);
      
    if (lagnaData?.lagnaName && matchStrings.some(match => lagnaData.lagnaName.includes(match))) {
      planetsInThisRasi.push("లగ్నం");
    }
    
    return (
      <div className="chart-cell">
        {planetsInThisRasi.length > 0 ? (
          <div className="flex flex-row flex-wrap justify-center gap-x-2 gap-y-0.5 z-10 px-1">
            {planetsInThisRasi.map((item, idx) => {
              const nameMap: Record<string, string> = {
                "రవి": "ర",
                "చంద్ర": "చ",
                "కుజ": "కు",
                "బుధ": "బు",
                "గురు": "గు",
                "శుక్ర": "శు",
                "శని": "శ",
                "రాహు": "రా",
                "కేతు": "కే",
                "లగ్నం": "ల",
                "చంద్రలగ్నం": "చ"
              };
              let shortName = nameMap[item] || item.charAt(0);
              
              return (
                <span key={idx} className="font-extrabold text-[#1A237E] leading-tight text-lg md:text-2xl">
                  {shortName}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div ref={captureRef} className="font-body-md text-on-surface pb-16 md:pb-0 min-h-screen" style={{ backgroundColor: '#003215' }}>
      <header className="bg-primary dark:bg-primary flex flex-col items-center justify-center py-6 px-4 w-full border-b-2 border-secondary relative">
        <div className="flex items-center justify-between w-full max-w-5xl">
          <button onClick={onBack} className="p-2 text-secondary-fixed hover:bg-secondary/20 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-fixed" style={{ lineHeight: '1.4' }}>శ్రీ భవానీ శంకర జ్యోతిష్యాలయం</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-[1100px] px-4 md:px-0 py-8">
        <div className="bg-surface traditional-border rounded-lg shadow-xl overflow-hidden">
          <div className="p-container-padding bg-surface-container-low border-b traditional-border grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <h2 className="col-span-1 md:col-span-2 font-title-lg text-title-lg text-tertiary-container flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined">person</span> జాతక వివరాలు
              </h2>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">పేరు</span>
                <span className="font-medium flex-1 min-h-[24px]">: {birthDetails.name || '\u00A0'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">జనన స్థలం</span>
                <span className="font-medium flex-1 min-h-[24px]">: {
                  [locationDetails.city, locationDetails.district, locationDetails.state, locationDetails.country].filter(Boolean).join(", ") || '\u00A0'
                }</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">జనన తేదీ</span>
                <span className="font-medium flex-1 min-h-[24px]">: {
                  birthDetails.date ? (() => {
                    const parts = birthDetails.date.split('-');
                    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : birthDetails.date;
                  })() : '\u00A0'
                }</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">అక్షాంశం</span>
                <span className="font-medium flex-1 min-h-[24px]">: {locationDetails.latitude ? `${locationDetails.latitude}° N` : '\u00A0'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">జనన సమయం</span>
                <span className="font-medium flex-1 min-h-[24px]">: {
                  (birthDetails.time.hh || birthDetails.time.mm) 
                    ? `${birthDetails.time.hh}:${birthDetails.time.mm} ${birthDetails.time.meridian}`
                    : '\u00A0'
                }</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-on-surface-variant">రేఖాంశం</span>
                <span className="font-medium flex-1 min-h-[24px]">: {locationDetails.longitude ? `${locationDetails.longitude}° E` : '\u00A0'}</span>
              </div>
            </div>
            
            <div className="col-span-1 border-t md:border-t-0 md:border-l traditional-border pt-4 md:pt-0 md:pl-6">
              <h3 className="font-title-lg text-title-lg text-tertiary-container mb-2">శ్రీ భవానీ శంకర జ్యోతిష్యాలయం</h3>
              <p className="font-medium mb-1">దివ్య శ్రీకాంత్ శర్మ సిద్ధాంతి</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                H.No: 4-2-18B, Sarmala Lakshmi nagar, Colony,<br/>
                Behind M.B. Dargah, Kowkoor, Secunderabad - 500010.<br/>
                ఫోన్: 98660 54009, 73964 66399
              </p>
            </div>
          </div>

          <div className="px-container-padding pt-6 pb-2">
            <div className="flex flex-wrap gap-2 md:gap-0 traditional-border rounded-lg overflow-hidden bg-surface-container">
              <button className="flex-1 min-w-[120px] py-3 px-2 text-center bg-primary text-on-primary font-bold traditional-border border-0 md:border-r last:border-r-0">
                పంచాంగ వివరాలు
              </button>
              <button className="flex-1 min-w-[120px] py-3 px-2 text-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all traditional-border border-0 md:border-r last:border-r-0">
                గ్రహ స్థితి
              </button>
              <button className="flex-1 min-w-[120px] py-3 px-2 text-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all traditional-border border-0 md:border-r last:border-r-0">
                లగ్న చక్రం
              </button>
              <button className="flex-1 min-w-[120px] py-3 px-2 text-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all traditional-border border-0 md:border-r last:border-r-0">
                దశా ఫలితాలు
              </button>
              <button className="flex-1 min-w-[120px] py-3 px-2 text-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
                జాతక వివరాలు
              </button>
            </div>
          </div>

          <div className="p-container-padding grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-center font-title-lg text-title-lg text-tertiary-container mb-4">పంచాంగ వివరాలు</h3>
                <table className="w-full panchangam-table">
                  <tbody>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th className="w-1/3">తేదీ (గ్రెగోరియన్)</th>
                      <td className="w-4">:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.dateGregorian || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>వారము</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.dayOfWeek || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>తిథి</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.tithi || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>నక్షత్రం</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.nakshatra || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>యోగం</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.yoga || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>కరణం</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.karana || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/50 h-8">
                      <th>సూర్యోదయం</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.sunrise || '\u00A0'}</td>
                    </tr>
                    <tr className="h-8">
                      <th>సూర్యాస్తమయం</th>
                      <td>:</td>
                      <td className="font-medium min-h-[24px]">{panchangaData.sunset || '\u00A0'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-center font-title-lg text-title-lg text-tertiary-container mb-4">గ్రహ స్థితి (రాశి చక్రం)</h3>
                <div className="overflow-x-auto">
                  <table className="graha-table">
                    <thead>
                      <tr>
                        <th>గ్రహం</th>
                        <th>రాశి</th>
                        <th>డిగ్రీ</th>
                        <th>నక్షత్రం</th>
                        <th>పాదం</th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface-container-lowest">
                      {planetaryPositions.map((pos, idx) => (
                        <tr key={idx}>
                          <td className={`${pos.colorClass} flex items-center justify-center gap-1`}>
                            <span className="material-symbols-outlined text-sm">{pos.icon}</span> {pos.planet}
                          </td>
                          <td className="min-h-[38px]">{pos.rashi || '\u00A0'}</td>
                          <td className="min-h-[38px]">{pos.degree || '\u00A0'}</td>
                          <td className="min-h-[38px]">{pos.nakshatra || '\u00A0'}</td>
                          <td className="min-h-[38px]">{pos.pada || '\u00A0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-center font-title-lg text-title-lg text-tertiary-container mb-6">జన్మ కుండలి</h3>
                <div className="flex justify-center w-full">
                  <div className="border-[5px] border-[#8E24AA] p-0 inline-block bg-white shadow-md rounded-sm">
                    <div className="grid grid-cols-4 grid-rows-4 w-[310px] h-[310px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] mx-auto bg-white kundali-grid aspect-square">
                      {renderChartCell('మీనం', 'meenam')}
                      {renderChartCell('మేషం', 'mesham')}
                      {renderChartCell('వృషభం', 'vrushabham')}
                      {renderChartCell('మిథునం', 'mithunam')}
                      
                      {renderChartCell('కుంభం', 'kumbham')}
                      {renderChartCell('', '', true)}
                      {renderChartCell('కర్కాటకం', 'karkatakam')}
                      
                      {renderChartCell('మకరం', 'makaram')}
                      {renderChartCell('సింహం', 'simham')}
                      
                      {renderChartCell('ధనుస్సు', 'dhanussu')}
                      {renderChartCell('వృశ్చికం', 'vruschikam')}
                      {renderChartCell('తుల', 'thula')}
                      {renderChartCell('కన్య', 'kanya')}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-center font-title-lg text-title-lg text-tertiary-container mb-4">మూలక వివరాలు</h3>
                <table className="w-full panchangam-table">
                  <tbody className="bg-surface-container-lowest p-4 block border traditional-border">
                    <tr className="border-b border-outline-variant/30 flex py-1 h-8 items-center">
                      <th className="w-1/2">అయనాంశం</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.ayanamsa || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30 flex py-1 h-8 items-center">
                      <th className="w-1/2">కాలమానం</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.kalamanam || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30 flex py-1 h-8 items-center">
                      <th className="w-1/2">దిన సంఖ్య</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.dinaSankhya || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30 flex py-1 h-8 items-center">
                      <th className="w-1/2">జనన నక్షత్ర పాదం</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.janmaNakshatraPada || '\u00A0'}</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30 flex py-1 h-8 items-center">
                      <th className="w-1/2">జనన రాశి శేషాంశం</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.janmaRasiSeshamsa || '\u00A0'}</td>
                    </tr>
                    <tr className="flex py-1 h-8 items-center">
                      <th className="w-1/2">చంద్ర రాశి</th>
                      <td className="w-4">:</td>
                      <td className="w-1/2 font-medium min-h-[24px]">{jatakaData.chandraRasi || '\u00A0'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden px-4 bg-primary dark:bg-primary border-t border-secondary shadow-lg">
        <button className="flex flex-col items-center justify-center text-on-primary hover:opacity-80 scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-sm text-label-sm">హోమ్</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary-fixed bg-primary-container rounded-full p-2 hover:opacity-80 scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          <span className="font-label-sm text-label-sm">పంచాంగం</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-primary hover:opacity-80 scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span className="font-label-sm text-label-sm">జాతకం</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-primary hover:opacity-80 scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin</span>
          <span className="font-label-sm text-label-sm">ప్రొఫైల్</span>
        </button>
      </nav>

      <footer className="w-full py-8 flex flex-col items-center gap-4 mt-section-gap bg-transparent border-t-[1.5px] border-[#B8860B] mb-16 md:mb-0">
        <div className="flex gap-4 mb-2 no-print">
          <button onClick={downloadAsImage} className="flex items-center gap-2 px-4 py-2 text-[#B8860B] border border-[#B8860B] hover:bg-[#B8860B]/10 rounded-md transition-colors" title="Download Image">
            <span className="material-symbols-outlined">image</span>
            <span className="font-medium">Download Image</span>
          </button>
          <button onClick={downloadAsPDF} className="flex items-center gap-2 px-4 py-2 text-[#B8860B] border border-[#B8860B] hover:bg-[#B8860B]/10 rounded-md transition-colors" title="Download PDF">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            <span className="font-medium">Download PDF</span>
          </button>
        </div>
        <p className="font-label-sm text-label-sm text-white">© 2025 శ్రీ భవానీ శంకర జ్యోతిష్యాలయం | సర్వ హక్కులు రక్షించబడినవి</p>
      </footer>
    </div>
  );
}
