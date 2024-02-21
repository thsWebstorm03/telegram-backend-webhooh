function formatDateDifference(startDate, endDate) {
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

module.exports = {
   formatDateDifference
}