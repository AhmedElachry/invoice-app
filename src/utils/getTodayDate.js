import moment from "moment";

function getTodayDate() {
  return moment().format("YYYY-MM-DD");
}

export default getTodayDate;
