import axios from "axios";
import md5 from 'md5';
require("dotenv").config()
export function QueryCorosAccessToken(): Promise<string> {
  // @ts-ignore
  const pwd = md5(process.env.COROS_PASSWORD);
  const account = process.env.COROS_ACCOUNT;
  return new Promise((resolve, reject) => {
    axios.post('https://teamcnapi.coros.com/account/login', {
      account,
      pwd,
      accountType: 2
    }).then((response) => {
      if (response.data && response.data.data) {
        resolve(response.data.data.accessToken);
      } else {
        reject(new Error(response.data?.message))
      }
    }).catch((error: Error) => {
      console.error('Get Coros accessToken fail: ' + error.message);
      process.exit(1);
    })
  });
}

function QuerySportDataList(accessToken: string, size: number, pageNumber: number): Promise<any> {
  return new Promise((resolve, reject) => {
    axios.get(`https://teamcnapi.coros.com/activity/query?size=${size}&pageNumber=${pageNumber}`, {
      headers: {
        'Accesstoken': accessToken,
      }
    }).then((response) => {
      if (response.data && response.data.data?.dataList) {
        resolve(response.data.data);
      } else {
        reject(new Error('Query sport data fail!'));
      }
    }).catch((error: Error) => {
      console.error(error.message);
      process.exit(1);
    });
  })
}

export async function QuerySportData(accessToken: string) {
  const sportDataList = [];
  let totalPage = 1;
  for (let i = 0; i < totalPage; i++) {
    const data = await QuerySportDataList(accessToken, 50, i + 1);
    if (data && data.dataList) {
      sportDataList.push(...data.dataList);
    } else {
      break;
    }
    if (i === 0) {
      totalPage = data?.totolPage ?? totalPage;
    }
  }
  return sportDataList;
}

export function GetSportNameByType(type: number | string) {
  // form coros web
  // "-100": "Category_Run",
  // "-104": "Category_Walk",
  // "-105": "Category_Climb",
  // "-200": "Category_Bike",
  // "-300": "Category_Swim",
  // "-400": "Category_Cardio",
  // "-402": "Category_Strength",
  // "-500": "Category_Ski",
  // "-10000": "Category_GroupSport",
  // "-700": "Category_Aquatics",
  // 0: "All",
  // 100: "Run",
  // 101: "Indoor_Run",
  // 102: "Trail_Run",
  // 103: "Track_Run",
  // 104: "Hike",
  // 105: "Mtn_Climb",
  // 200: "Bike",
  // 299: "Helmet_Bike",
  // 201: "Indoor_Bike",
  // 300: "Pool_Swim",
  // 301: "Open_Water",
  // 1e4: "Triathlon",
  // 402: "Strength",
  // 400: "Gym_Cardio",
  // 401: "GPS_Cardio",
  // 500: "Ski",
  // 501: "Snowboard",
  // 502: "XC_Ski",
  // 503: "Ski_Touring",
  // 10002: "Ski_Touring_Old",
  // 10001: "Multi_Sport",
  // 706: "Speedsurfing",
  // 705: "Windsurfing",
  // 700: "Row",
  // 701: "Indoor_Row",
  // 702: "Whitewater",
  // 704: "Flatwater",
  // 10003: "Multi_Pitch",
  // 106: "Climb",
  // 900: "Walk",
  // 901: "Jump_Rope"
    switch (type) {
      case 100: {
        return 'Run';
      }
      case 101: {
        return 'Indoor_Run';
      }
      case 102: {
        return 'Trail_Run'
      }
      case 200: {
        return 'Bike'
      }
      case 201: {
        return 'Indoor_Bike'
      }
      case 299: {
        return 'Helmet_Bike'
      }
      default: {
        return 'Other';
      }
    }
  }