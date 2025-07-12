export function checkEmail(input: string): boolean {
  const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
  return emailRegex.test(input);
}
