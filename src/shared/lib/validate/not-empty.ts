export default function notEmpty(value: string): boolean {
  const pattern = /^[a-zA-Z]+$/;
  return pattern.test(value);
}
