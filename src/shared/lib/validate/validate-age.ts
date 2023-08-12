export default function validateAge(): string {
  const currentDate = new Date();
  const maxAgeDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
  return maxAgeDate.toISOString().split('T')[0];
}
