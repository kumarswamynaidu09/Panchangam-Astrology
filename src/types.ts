export interface BirthDetails {
  name: string;
  gender: string;
  date: string;
  time: {
    hh: string;
    mm: string;
    meridian: string;
  };
}

export interface LocationDetails {
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: string;
  longitude: string;
}

export interface PanchangaData {
  dateGregorian: string;
  dayOfWeek: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  lagna?: string;
  rashi?: string;
}

export interface PlanetaryPosition {
  planet: string;
  icon: string;
  iconType?: string;
  colorClass?: string;
  rashi: string;
  degree: string;
  nakshatra: string;
  pada: string;
}

export interface LagnaData {
  lagnaName: string;
  lagnaDegree: string;
  chart: Record<string, string[]>;
}

export interface JatakaData {
  ayanamsa: string;
  kalamanam: string;
  dinaSankhya: string;
  samvatsaram?: string;
  rutuvu?: string;
  masam?: string;
  paksham?: string;
  dasaBalance?: string;
  janmaNakshatraPada?: string;
  janmaRasiSeshamsa?: string;
  chandraRasi?: string;
}

export interface AppState {
  birthDetails: BirthDetails;
  locationDetails: LocationDetails;
  panchangaData: PanchangaData;
  planetaryPositions: PlanetaryPosition[];
  lagnaData: LagnaData;
  jatakaData: JatakaData;
}
