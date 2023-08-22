export default function validateAge(birthDate: string): boolean {
  const currentDate = new Date();
  const userBirthDate = new Date(birthDate);
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(currentDate.getFullYear() - 13);

  return userBirthDate <= thirteenYearsAgo;
}
