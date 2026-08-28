import React, { useState } from 'react';
import { AppState } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { indiaData } from '../data/india';

interface InputScreenProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
}

export default function InputScreen({ appState, setAppState, onNext }: InputScreenProps) {
  const { birthDetails, locationDetails } = appState;
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [locationMode, setLocationMode] = useState<'manual' | 'search'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  // Initialize birthDate from existing string format YYYY-MM-DD
  const [birthDate, setBirthDate] = useState<Date | null>(() => {
    if (birthDetails.date) {
      return new Date(birthDetails.date);
    }
    return null;
  });

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
    if (date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      handleBirthDetailsChange('date', `${yyyy}-${mm}-${dd}`);
    } else {
      handleBirthDetailsChange('date', '');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=5`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPlace = (place: any) => {
    setSearchResults([]);
    setSearchQuery(place.display_name);
    
    setAppState(prev => ({
      ...prev,
      locationDetails: {
        ...prev.locationDetails,
        country: 'India',
        state: 'Selected from Search',
        district: 'Selected from Search',
        city: place.display_name.split(',')[0],
        latitude: place.lat,
        longitude: place.lon,
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!birthDetails.name.trim()) newErrors.name = true;
    if (!birthDetails.gender) newErrors.gender = true;
    if (!birthDetails.date.trim()) newErrors.date = true;
    if (!birthDetails.time.hh) newErrors.hh = true;
    if (!birthDetails.time.mm) newErrors.mm = true;
    if (!birthDetails.time.meridian) newErrors.meridian = true;

    if (locationMode === 'manual') {
      if (!locationDetails.country) newErrors.country = true;
      if (!locationDetails.state) newErrors.state = true;
      if (!locationDetails.district) newErrors.district = true;
      if (!locationDetails.city.trim()) newErrors.city = true;
      if (!locationDetails.latitude.trim()) newErrors.latitude = true;
      if (!locationDetails.longitude.trim()) newErrors.longitude = true;
    } else {
      if (!locationDetails.latitude || !locationDetails.longitude || !searchQuery.trim()) {
        newErrors.search = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBirthDetailsChange = (field: keyof typeof birthDetails, value: any) => {
    setAppState(prev => ({ ...prev, birthDetails: { ...prev.birthDetails, [field]: value } }));
  };

  const handleTimeChange = (field: keyof typeof birthDetails.time, value: string) => {
    setAppState(prev => ({
      ...prev,
      birthDetails: { ...prev.birthDetails, time: { ...prev.birthDetails.time, [field]: value } }
    }));
  };

  const handleLocationDetailsChange = (field: keyof typeof locationDetails, value: string) => {
    setAppState(prev => ({ ...prev, locationDetails: { ...prev.locationDetails, [field]: value } }));
  };

  return (
    <div className="bg-primary min-h-screen flex flex-col font-body-md text-on-surface">
      <header className="bg-primary dark:bg-primary border-b-2 border-secondary flex flex-col items-center justify-center py-6 px-4 w-full relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMVb7dw-YxXRacDl8Ufn9dpc_hCc8vZMRpr_vbRJ3cnDJ8kUyXBeCrErNXz_-PJUnKfsveAeqlU-4bFEYcPvRieeW5CmG4jwxvHgAj24Tk3fZG32dANXaKZKMa4xB0FmvrxN4Mlmhj4hmKkAb1aPj5RI7902Ffig-LJCvDDnO29F2HT3qgYhtNXUxVGYstY_U-jNAaE2kQEY025DCEiXVEVxv1UJod4hAuRE2HBi8lPu_Lukgj6qyYuA')" }}></div>
        <div className="flex items-center justify-center w-full max-w-5xl mx-auto z-10 relative">
          <div className="flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-fixed mb-2" style={{ lineHeight: '1.4' }}>శ్రీ భవానీ శంకర జ్యోతిష్యాలయం</h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-4 opacity-70" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFJGAgHmsStDJHqP6eVObb40cgtyD2zaJccAPN6PtCoMR01JqlR5QQQrGu115u6saT7iNu1jTswx5jFUaYbgLFcexMjmERbbbqw_Kf6zapRalGbfzVAuKJ9PaJlYG6qrpXOLw7fPgx1vwu1jkYQWf5OviiWJgnoo-3NK2V3rl65R6Oi1Pud0695N5aeBjOj-bc6dYipRDoUMY1-OkeZRe6zGKjzogNvtILpvWdVg5U_B0gOoOXt_kGcQ')" }}></div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 md:py-12 z-0 relative">
        <div className="parchment-bg rounded-xl border border-secondary shadow-2xl overflow-hidden relative">
          <div className="absolute inset-1 border border-secondary/30 rounded-lg pointer-events-none"></div>
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8 pb-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              <h2 className="font-title-lg text-title-lg text-tertiary-container font-bold">జన్మ వివరాలు నమోదు చేయండి</h2>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => { 
              e.preventDefault(); 
              if (validateForm()) {
                onNext(); 
              } else {
                setShowValidationPopup(true);
              }
            }}>
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  <h3 className="font-title-lg text-title-lg text-primary font-semibold">1. వ్యక్తిగత వివరాలు</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">పేరు <span className="text-error">*</span></label>
                    <input 
                      type="text" 
                      className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.name ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                      placeholder="ఉదా: రామకృష్ణ శర్మ"
                      value={birthDetails.name}
                      onChange={(e) => {
                        setErrors(prev => ({ ...prev, name: false }));
                        handleBirthDetailsChange('name', e.target.value);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">లింగం <span className="text-error">*</span></label>
                    <div className="relative">
                      <select 
                        className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 transition-colors cursor-pointer ${errors.gender ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                        value={birthDetails.gender}
                        onChange={(e) => {
                          setErrors(prev => ({ ...prev, gender: false }));
                          handleBirthDetailsChange('gender', e.target.value);
                        }}
                      >
                        <option disabled value="">ఎంపిక చేయండి</option>
                        <option value="male">పురుషుడు</option>
                        <option value="female">స్త్రీ</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                  <h3 className="font-title-lg text-title-lg text-primary font-semibold">2. జనన తేదీ &amp; సమయం</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">జనన తేదీ <span className="text-error">*</span></label>
                    <div className="relative">
                      <DatePicker
                        selected={birthDate}
                        onChange={(date) => {
                          setErrors(prev => ({ ...prev, date: false }));
                          handleDateChange(date);
                        }}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="dd-mm-yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        customInput={
                          <input 
                            className={`w-full bg-surface-container-lowest border rounded pl-4 pr-10 py-2 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.date ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                          />
                        }
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none z-10">calendar_month</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">జనన సమయం <span className="text-error">*</span></label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select 
                          className={`w-full bg-surface-container-lowest border rounded px-3 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.hh ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                          value={birthDetails.time.hh}
                          onChange={(e) => {
                            setErrors(prev => ({ ...prev, hh: false }));
                            handleTimeChange('hh', e.target.value);
                          }}
                        >
                          <option disabled value="">HH</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const val = String(i + 1).padStart(2, '0');
                            return <option key={val} value={val}>{val}</option>;
                          })}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
                      </div>
                      <div className="relative flex-1">
                        <select 
                          className={`w-full bg-surface-container-lowest border rounded px-3 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.mm ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                          value={birthDetails.time.mm}
                          onChange={(e) => {
                            setErrors(prev => ({ ...prev, mm: false }));
                            handleTimeChange('mm', e.target.value);
                          }}
                        >
                          <option disabled value="">MM</option>
                          {Array.from({ length: 60 }, (_, i) => {
                            const val = String(i).padStart(2, '0');
                            return <option key={val} value={val}>{val}</option>;
                          })}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
                      </div>
                      <div className="relative flex-1">
                        <select 
                          className={`w-full bg-surface-container-lowest border rounded px-3 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.meridian ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                          value={birthDetails.time.meridian}
                          onChange={(e) => {
                            setErrors(prev => ({ ...prev, meridian: false }));
                            handleTimeChange('meridian', e.target.value);
                          }}
                        >
                          <option disabled value="">AM/PM</option>
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <h3 className="font-title-lg text-title-lg text-primary font-semibold">3. జనన స్థలం వివరాలు</h3>
                </div>

                <div className="flex border-b border-outline-variant mb-6">
                  <button 
                    type="button"
                    onClick={() => setLocationMode('search')}
                    className={`px-4 py-3 font-label-sm font-semibold transition-colors border-b-2 ${locationMode === 'search' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
                  >
                    స్థలం పేరుతో వెతకండి
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className={`px-4 py-3 font-label-sm font-semibold transition-colors border-b-2 ${locationMode === 'manual' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
                  >
                    మానవీయంగా నమోదు చేయండి
                  </button>
                </div>

                {locationMode === 'search' ? (
                  <div className="space-y-4 relative">
                    <div className="space-y-2">
                      <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">స్థలం పేరు <span className="text-error">*</span></label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.search ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                            placeholder="ఉదా: హైదరాబాద్, తెలంగాణ"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setErrors(prev => ({ ...prev, search: false }));
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2 rounded font-label-sm flex items-center gap-2 transition-colors border border-secondary/50"
                        >
                          <span className="material-symbols-outlined text-sm">{isSearching ? 'hourglass_empty' : 'search'}</span>
                          వెతకండి
                        </button>
                      </div>
                      {errors.search && <p className="text-error text-xs">దయచేసి స్థలాన్ని ఎంచుకోండి</p>}
                    </div>
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                        {searchResults.map((place, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => selectPlace(place)}
                            className="p-3 border-b border-outline-variant/30 hover:bg-surface-variant cursor-pointer transition-colors"
                          >
                            <p className="font-body-md text-on-surface">{place.display_name}</p>
                            <p className="text-xs text-on-surface-variant mt-1">అక్షాంశం: {parseFloat(place.lat).toFixed(4)} | రేఖాంశం: {parseFloat(place.lon).toFixed(4)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {locationDetails.latitude && locationDetails.longitude && searchQuery && searchResults.length === 0 && (
                       <div className="p-4 bg-secondary-fixed/20 border border-secondary-fixed rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                         <div className="flex items-center gap-3">
                           <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                           <p className="font-body-md text-on-surface">స్థలం విజయవంతంగా ఎంపిక చేయబడింది.</p>
                         </div>
                       </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">దేశం <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.country ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                            value={locationDetails.country}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, country: false }));
                              handleLocationDetailsChange('country', e.target.value);
                            }}
                          >
                            <option disabled value="">ఎంపిక చేయండి</option>
                            <option value="India">భారతదేశం (India)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">రాష్ట్రం <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.state ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                            value={locationDetails.state}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, state: false, district: false }));
                              handleLocationDetailsChange('state', e.target.value);
                              handleLocationDetailsChange('district', '');
                            }}
                          >
                            <option disabled value="">ఎంపిక చేయండి</option>
                            {Object.keys(indiaData).map(stateName => (
                              <option key={stateName} value={stateName}>{stateName}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">జిల్లా <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 ${errors.district ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`}
                            value={locationDetails.district}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, district: false }));
                              handleLocationDetailsChange('district', e.target.value);
                            }}
                            disabled={!locationDetails.state || !indiaData[locationDetails.state]}
                          >
                            <option disabled value="">ఎంపిక చేయండి</option>
                            {locationDetails.state && indiaData[locationDetails.state]?.map(districtName => (
                              <option key={districtName} value={districtName}>{districtName}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">స్థలం / పట్టణం <span className="text-error">*</span></label>
                        <input 
                          type="text" 
                          className={`w-full bg-surface-container-lowest border rounded px-4 py-2 font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.city ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                          placeholder="ఉదా: హైదరాబాద్"
                          value={locationDetails.city}
                          onChange={(e) => {
                            setErrors(prev => ({ ...prev, city: false }));
                            handleLocationDetailsChange('city', e.target.value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">అక్షాంశం (Latitude) <span className="text-error">*</span></label>
                        <div className="flex">
                          <input 
                            type="text" 
                            className={`w-full bg-surface-container-lowest border rounded-l px-4 py-2 font-body-md text-on-surface focus:outline-none border-r-0 focus:ring-1 ${errors.latitude ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                            placeholder="ఉదా: 17.3850"
                            value={locationDetails.latitude}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, latitude: false }));
                              handleLocationDetailsChange('latitude', e.target.value);
                            }}
                          />
                          <span className={`bg-surface-variant border rounded-r px-3 py-2 flex items-center justify-center text-on-surface-variant ${errors.latitude ? 'border-error' : 'border-secondary/50'}`}>°</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">రేఖాంశం (Longitude) <span className="text-error">*</span></label>
                        <div className="flex">
                          <input 
                            type="text" 
                            className={`w-full bg-surface-container-lowest border rounded-l px-4 py-2 font-body-md text-on-surface focus:outline-none border-r-0 focus:ring-1 ${errors.longitude ? 'border-error ring-error focus:border-error focus:ring-error' : 'border-secondary/50 focus:border-secondary focus:ring-secondary'}`} 
                            placeholder="ఉదా: 78.4867"
                            value={locationDetails.longitude}
                            onChange={(e) => {
                              setErrors(prev => ({ ...prev, longitude: false }));
                              handleLocationDetailsChange('longitude', e.target.value);
                            }}
                          />
                          <span className={`bg-surface-variant border rounded-r px-3 py-2 flex items-center justify-center text-on-surface-variant ${errors.longitude ? 'border-error' : 'border-secondary/50'}`}>°</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>

              <div className="bg-surface-container-lowest border border-secondary/40 rounded-lg p-6 mt-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-tertiary-container rounded-t-lg"></div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-tertiary-container">temple_hindu</span>
                  <h4 className="font-title-lg text-title-lg text-tertiary-container font-semibold">శ్రీ భవానీ శంకర జ్యోతిష్యాలయం వివరాలు</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24">పేరు</span>
                    <span className="font-body-md text-on-surface font-medium flex-1">: శ్రీ భవానీ శంకర జ్యోతిష్యాలయం</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24">ఆచార్యులు</span>
                    <span className="font-body-md text-on-surface flex-1">: దివ్య శ్రీకాంత్ శర్మ సిద్ధాంతి</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24">చిరునామా</span>
                    <span className="font-body-md text-on-surface flex-1">: H.No: 4-2-18B, Sarmala Lakshmi nagar, Colony, Behind M.B. Dargah, Kowkoor, Secunderabad - 500010.</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24">ఫోన్</span>
                    <span className="font-body-md text-on-surface flex-1">: 98660 54009, 73964 66399</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button type="submit" className="bg-primary hover:bg-primary-container text-on-primary font-title-lg text-title-lg px-12 py-3 rounded border border-secondary flex items-center gap-2 transition-all shadow-md active:scale-95">
                  తరువాతి (Next) <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-primary dark:bg-primary border-t-2 border-secondary w-full py-8 flex flex-col items-center gap-4 mt-section-gap relative z-10">
        <div className="flex gap-4">
          <a href="#" className="font-body-md text-body-md text-on-primary opacity-80 hover:text-secondary-fixed transition-colors">నిబంధనలు</a>
          <span className="text-on-primary opacity-50">|</span>
          <a href="#" className="font-body-md text-body-md text-on-primary opacity-80 hover:text-secondary-fixed transition-colors">గోప్యతా విధానం</a>
        </div>
        <p className="font-label-sm text-label-sm text-on-primary opacity-80">© 2025 శ్రీ భవానీ శంకర జ్యోతిష్యాలయం | సర్వ హక్కులు రక్షించబడినవి</p>
      </footer>

      {showValidationPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="parchment-bg max-w-md w-full rounded-xl border-2 border-secondary p-6 shadow-2xl relative animate-scale-up">
            <div className="absolute inset-1 border border-secondary/30 rounded-lg pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-[#891c1d] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h3 className="font-title-lg text-2xl text-[#891c1d] font-bold mb-3">వివరాలు పూర్తికాలేదు!</h3>
              <p className="font-body-md text-on-surface-variant text-base leading-relaxed mb-6">
                దయచేసి కొనసాగడానికి మీ పేరు, లింగం, జనన తేదీ, సమయం మరియు జనన స్థలం వివరాలను పూర్తిగా నమోదు చేయండి.
              </p>
              
              <button 
                type="button"
                onClick={() => setShowValidationPopup(false)}
                className="bg-primary hover:bg-primary-container text-on-primary font-semibold px-8 py-2.5 rounded border border-secondary transition-all duration-200 cursor-pointer shadow-md active:scale-95"
              >
                సరే (OK)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
