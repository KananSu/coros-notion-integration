import { QueryCorosAccessToken, QuerySportData } from "./coros";
import { QueryExistPageLabelId, UploadSportData } from "./notion";

async function main() {
  const accessToken = await QueryCorosAccessToken();
  const sportDataList = await QuerySportData(accessToken);
  const existLabelId = await QueryExistPageLabelId();
  await UploadSportData(sportDataList, existLabelId);
}
main();