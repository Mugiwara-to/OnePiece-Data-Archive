import fs from "fs";
import path from "path";

const __dirname = path.resolve();

function generateReportTags(data) {
  const status =
    data.startTime && data.endTime && data.skipId && data.episodeLength
      ? "Has all data"
      : data.startTime
      ? "Has only startTime"
      : data.endTime
      ? "Has only endTime"
      : data.episodeLength
      ? "Has only episodeLength"
      : data.startTime && data.endTime
      ? "Has only startTime, endTime"
      : "Has no data";
  return status;
}

export default async function generateReport(jsonFilePath) {
  const existingData = fs.readFileSync(jsonFilePath);
  const episodeSkipData = JSON.parse(existingData);

  const report = episodeSkipData.map((episodeObj) => {
    const opSkipData = episodeObj.opSkip;
    const edSkipData = episodeObj.edSkip;
    const recapSkipData = episodeObj.recapSkip;

    const opStatus = generateReportTags(opSkipData);
    const edStatus = generateReportTags(edSkipData);
    const recapStatus = generateReportTags(recapSkipData);

    const reportObj = {
      episodeNo: episodeObj.episodeNo,
      opSkip: opStatus,
      edSkip: edStatus,
      recapSkip: recapStatus,
    };
    return reportObj;
  });

  const reportFilePath = path.join(__dirname, "data", "Skiptime_Report.json");
  fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2));
  console.log(`Report written to ${reportFilePath} successfully.`);
}
