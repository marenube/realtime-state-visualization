export interface SubwayLine {
  id: string; // 노선명 (예: '3호선')
  name: string;
  color: string;
  subwayId: string;
}

export const subwayLines: SubwayLine[] = [
  { id: '1호선', name: '01호선', color: '#0052A4', subwayId: '1001' },
  { id: '2호선', name: '02호선', color: '#009D3E', subwayId: '1002' },
  { id: '3호선', name: '03호선', color: '#EF843D', subwayId: '1003' },
  { id: '4호선', name: '04호선', color: '#00A5DE', subwayId: '1004' },
  { id: '5호선', name: '05호선', color: '#996CAC', subwayId: '1005' },
  { id: '6호선', name: '06호선', color: '#BA6E39', subwayId: '1006' },
  { id: '7호선', name: '07호선', color: '#747F00', subwayId: '1007' },
  { id: '8호선', name: '08호선', color: '#E6186C', subwayId: '1008' },
  { id: '9호선', name: '09호선', color: '#BDB092', subwayId: '1009' },
  { id: 'GTX-A', name: 'GTX-A', color: '#9A6292', subwayId: '1032' },
  { id: '경강선', name: '경강선', color: '#0054A6', subwayId: '1081' },
  { id: '경의중앙선', name: '경의선', color: '#77C4A3', subwayId: '1063' },
  { id: '경춘선', name: '경춘선', color: '#0C8E72', subwayId: '1067' },
  { id: '공항철도', name: '공항철도', color: '#0090D2', subwayId: '1065' },
  {
    id: '김포도시철도',
    name: '김포도시철도',
    color: '#A17800',
    subwayId: '1088', // ?? 정보없음
  },
  { id: '서해선', name: '서해선', color: '#8FC31F', subwayId: '1093' },
  { id: '수인분당선', name: '수인분당선', color: '#FDA600', subwayId: '1075' },
  { id: '신림선', name: '신림선', color: '#6789CA', subwayId: '1094' },
  { id: '신분당선', name: '신분당선', color: '#D4003B', subwayId: '1077' },
  { id: '용인경전철', name: '용인경전철', color: '#6FB245', subwayId: '1091' }, // ?? 정보없음
  {
    id: '우이신설선',
    name: '우이신설경전철',
    color: '#B7C452',
    subwayId: '1092',
  },
  {
    id: '의정부경전철',
    name: '의정부경전철',
    color: '#FDA600',
    subwayId: '1089',
  },
  { id: '인천2호선', name: '인천2호선', color: '#ED8B00', subwayId: '1098' },
  { id: '인천선', name: '인천선', color: '#7CA8D5', subwayId: '1097' },
];

export const subwayLineColorMap = new Map(subwayLines.map(line => [line.name, line.color]));
