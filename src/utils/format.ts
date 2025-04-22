// 2進数を4桁ごとに区切るためのやつ
export const formatBinary = (binary: string): string => {
  const paddedBinary = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");
  return paddedBinary.match(/.{1,4}/g)?.join(" ") || "";
};