const isToday = ({date}: any) => {
  // Create date from input value
  const inputDate = new Date(date);

  // Get today's date
  const todaysDate = new Date();

  // call setHours to take the time out of the comparison
  if(inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) 
    return true;
    else return false;
}

module.exports = { isToday };