// FILE: brixCalc.js
export const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.map((start, index) =>
    Math.round(start + factor * (endColor[index] - start))
  );
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

export const getDynamicColor = (score) => {
  const colors = [
    { range: [1, 5], start: [168, 208, 141], end: [210, 225, 136] },
    { range: [5, 10], start: [210, 225, 136], end: [255, 235, 132] },
    { range: [10, 15], start: [255, 235, 132], end: [255, 212, 100] },
    { range: [15, 20], start: [255, 212, 100], end: [244, 187, 68] },
    { range: [20, 25], start: [244, 187, 68], end: [255, 152, 0] },
    { range: [25, 30], start: [255, 152, 0], end: [255, 120, 85] },
    { range: [30, 35], start: [255, 120, 85], end: [255, 87, 51] },
    { range: [35, 40], start: [255, 87, 51], end: [255, 69, 0] },
    { range: [40, 45], start: [255, 69, 0], end: [235, 35, 0] },
    { range: [45, 50], start: [235, 35, 0], end: [255, 0, 0] },
  ];

  for (const color of colors) {
    const [min, max] = color.range;
    if (score >= min && score <= max) {
      const factor = (score - min) / (max - min);
      return interpolateColor(color.start, color.end, factor);
    }
  }

  return "rgb(255, 0, 0)";
};
