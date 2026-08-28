import { AppState } from "./types";

export const initialAppState: AppState = {
  birthDetails: {
    name: "",
    gender: "",
    date: "",
    time: { hh: "", mm: "", meridian: "" }
  },
  locationDetails: {
    country: "",
    state: "",
    district: "",
    city: "",
    latitude: "",
    longitude: ""
  },
  panchangaData: {
    dateGregorian: "",
    dayOfWeek: "",
    tithi: "",
    nakshatra: "",
    yoga: "",
    karana: "",
    sunrise: "",
    sunset: ""
  },
  planetaryPositions: [
    { planet: "సూర్య", icon: "circle", colorClass: "text-tertiary-container", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "చంద్ర", icon: "nightlight", colorClass: "", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "కుజ", icon: "change_history", colorClass: "text-tertiary-container", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "బుధ", icon: "fiber_manual_record", colorClass: "text-primary", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "గురు", icon: "stars", colorClass: "text-secondary", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "శుక్ర", icon: "lens", colorClass: "", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "శని", icon: "radio_button_unchecked", colorClass: "", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "రాహు", icon: "trip_origin", colorClass: "", rashi: "", degree: "", nakshatra: "", pada: "" },
    { planet: "కేతు", icon: "radio_button_checked", colorClass: "", rashi: "", degree: "", nakshatra: "", pada: "" }
  ],
  lagnaData: {
    lagnaName: "",
    lagnaDegree: "",
    chart: {
      meenam: [],
      mesham: [],
      vrushabham: [],
      mithunam: [],
      kumbham: [],
      karkatakam: [],
      makaram: [],
      simham: [],
      dhanussu: [],
      vruschikam: [],
      thula: [],
      kanya: []
    }
  },
  jatakaData: {
    ayanamsa: "",
    kalamanam: "",
    dinaSankhya: "",
    janmaNakshatraPada: "",
    janmaRasiSeshamsa: "",
    chandraRasi: ""
  }
};
