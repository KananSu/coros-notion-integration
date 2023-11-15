import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { GetSportNameByType } from "../coros";
require("dotenv").config()
const databaseId = process.env.NOTION_DATABASE_ID;
const apiKey = process.env.NOTION_KEY;
const notion = new Client({auth: apiKey});

export async function QueryExistPageLabelId() {
  if (!databaseId) {
    console.error('NOTION_DATABASE_ID is empty');
    return [];
  }
  const existLabelId: Array<string> = [];
  const queryResponse = await notion.databases.query({
    database_id: databaseId,
  })

  for (const page of queryResponse.results) {
    if (!("url" in page)) {
      // Skip partial page objects
      continue
    }
    if (!page.properties) {
      continue;
    }
    const properties = page.properties;
    if (!properties['LabelId']) {
      continue;
    }
    if (properties['LabelId'].type === 'rich_text') {
      const rich_text = properties['LabelId'].rich_text;
      //@ts-ignore
      if (rich_text[0]?.text.content) {
        //@ts-ignore
        existLabelId.push(rich_text[0].text.content);
      }
    }
  }

  return existLabelId;
}

export async function UploadSportData(sportDataList: Array<any>, existLabelId: Array<string>) {
  if (!databaseId) {
    console.error('NOTION_DATABASE_ID is empty');
    return;
  }
  for (let i = 0; i < sportDataList.length; i++) {
    const data = sportDataList[i];
    if (existLabelId.indexOf(data.labelId + '') !== -1) {
      continue;
    }
    const distance = (data.distance / 1000).toFixed(3) + 'km';
    const hour =  Math.floor(data.totalTime / 3600);
    const minute = Math.floor(data.totalTime % 3600 / 60);
    const second = data.totalTime % 60;
    const totalTime = (hour < 10 ? '0' + hour: hour) + ':' + (minute < 10? '0' + minute: minute) + ':' + ((second < 10 ? '0' + second: second))
    const avgMinute = Math.floor(data.avgSpeed / 60);
    const avgSecond = data.avgSpeed % 60;
    const avgSpeed = (avgMinute < 10 ? '0' + avgMinute: avgMinute) + "'" + (avgSecond < 10? '0' + avgSecond: avgSecond) + '"';
    const params: CreatePageParameters =  {
      parent: {
        type: 'database_id',
        database_id: databaseId,
      },
      properties: {
        Name: {
          type: 'title',
          title: [{
            text: {
              content: data.name,
            }
          }]
        },
        Type: {
          type: 'select',
          select: {
            name: GetSportNameByType(data.sportType)
          }
        },
        Date: {
          type: 'date',
          date: {
            start: new Date(data.startTime * 1000).toISOString(),
          }
        },
        Distance: {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: distance,
            }
          }]
        },
        TotalTime: {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: totalTime,
            }
          }]
        },
        AvgSpeed: {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: avgSpeed
            }
          }]
        },
        AvgHR: {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: data.avgHr + 'bpm'
            }
          }]
        },
        TrainingLoad:  {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: data.trainingLoad + ''
            }
          }]
        },
        LabelId: {
          type: 'rich_text',
          rich_text: [{
            text: {
              content: data.labelId + ''
            }
          }]
        }
      }
    }
    await notion.pages.create(params);
  }
}