export default function validateName(name: string) {
  const namePattern = /^[A-Za-z]+$/;
  return namePattern.test(name);
}
