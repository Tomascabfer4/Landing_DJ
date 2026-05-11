export function magneticOffset(clientX, clientY, rect, strength = 0.4) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    x: (clientX - cx) * strength,
    y: (clientY - cy) * strength,
  };
}
