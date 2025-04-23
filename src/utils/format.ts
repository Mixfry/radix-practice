// 2進数を4桁ごとに区切るためのやつ
export const formatBinary = (binary: string): string => {
  const paddedBinary = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");
  return paddedBinary.match(/.{1,4}/g)?.join(" ") || "";
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${milliseconds}`;
};