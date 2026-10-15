import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TABLE_LENGTH_CM as L, TABLE_WIDTH_CM as W, projectTable } from '../src/tableGeometry.js';
test('table projects regulation length and width with equal axis scales', () => {
  const a = projectTable(0,0), b = projectTable(L,0), d = projectTable(0,W);
  const length = Math.hypot(b[0]-a[0],b[1]-a[1]);
  const width = Math.hypot(d[0]-a[0],d[1]-a[1]);
  assert(Math.abs(length/width - 274/152.5) < 1e-10);
  assert(length > width * 1.79);
});
test('net crosses the width at the midpoint of the long sides', () => {
  const n1=projectTable(L/2,0), n2=projectTable(L/2,W);
  const a=projectTable(0,0), b=projectTable(L,0);
  assert.equal(n1[0],(a[0]+b[0])/2);
  assert.equal(n1[1],(a[1]+b[1])/2);
  const d=projectTable(0,W);
  assert(Math.abs((n2[0]-n1[0])-(d[0]-a[0]))<1e-10);
  assert(Math.abs((n2[1]-n1[1])-(d[1]-a[1]))<1e-10);
});
