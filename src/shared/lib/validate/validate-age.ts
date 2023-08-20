export default function validateAge(date: string): boolean {
  const currentDate = new Date();
  const maxAgeDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
  console.log(maxAgeDate.toISOString().split('T')[0]);
  console.log(date);
  return maxAgeDate.toISOString().split('T')[0] === date;
}
