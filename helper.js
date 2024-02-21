const formatDateDifference = (startDate, endDate) => {
   // Calculate the total difference in milliseconds
   let totalDiff = endDate.getTime() - startDate.getTime();

   // Calculate days, hours, minutes, and seconds
   const days = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
   totalDiff -= days * (1000 * 60 * 60 * 24);

   const hours = Math.floor(totalDiff / (1000 * 60 * 60));
   totalDiff -= hours * (1000 * 60 * 60);

   const minutes = Math.floor(totalDiff / (1000 * 60));
   totalDiff -= minutes * (1000 * 60);

   const seconds = Math.floor(totalDiff / 1000);

   // Format the string
   return `${days} days ${hours} hours ${minutes} mins ${seconds} secs`;
}

// Example usage
// const startDate = new Date("Tue Feb 20 2024 22:27:33 GMT+0000 (Coordinated Universal Time)"); // Example start date
// const endDate = new Date("2024-02-22T15:30:45Z"); // Example end date

// console.log(formatDateDifference(startDate, endDate));

module.exports = {
   formatDateDifference
}