// export default function validateAge(date: string): boolean {
//   const currentDate = new Date();
//   const maxAgeDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
//   console.log(maxAgeDate.toISOString().split('T')[0]);
//   console.log(date);
//   return maxAgeDate.toISOString().split('T')[0] === date;
// }

export default function validateAge(birthDate: string): boolean {
  const currentDate = new Date();
  const userBirthDate = new Date(birthDate);
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(currentDate.getFullYear() - 13);

  return userBirthDate <= thirteenYearsAgo;
}
