export type Station = {
  id: string;
  name: string;
  line: string;

  x: number;
  y: number;

  aliases: string[];

  connectsTo: {
    stationId: string; // 🔑 핵심
    travelTime?: number;
  }[];

  frCode?: string;
  stationCode?: string;
  labelX?: number;
  labelY?: number;
  dwellTime?: number;
};
