// ITTF playing surface in centimetres. The net crosses the width at half length.
export const TABLE_LENGTH_CM = 274;
export const TABLE_WIDTH_CM = 152.5;
export const TABLE_HEIGHT_CM = 76;
export const NET_HEIGHT_CM = 15.25;
const scale = 1.65;
export function projectTable(length: number, width: number, height = 0): [number, number] {
  return [155 + (length + width) * scale, 465 + (-length + width) * scale * .5 - height * scale];
}
export function tablePath(points: [number, number, number?][], closed = false) {
  return points.map(([l,w,h], i) => `${i ? 'L' : 'M'}${projectTable(l,w,h).join(' ')}`).join(' ') + (closed ? 'Z' : '');
}
