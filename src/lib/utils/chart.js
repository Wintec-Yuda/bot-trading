export const formatInterval = (interval) => {
  if (interval === "D") return "D";
  if (interval === "W") return "W";
  if (interval === "M") return "M";

  const num = parseInt(interval, 10);
  if (num == 60) return `${num / 60}H`;
  if (num == 120) return `${num / 60}H`;
  if (num == 240) return `${num / 60}H`;
  if (num == 360) return `${num / 60}H`;
  if (num == 720) return `${num / 60}H`;
  return `${num}M`;
};
