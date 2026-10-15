import test from 'node:test';import assert from 'node:assert/strict';import {feePreview} from '../src/config/feePreview';
const input={enabled:true,tournamentFee:100,divisionFees:[250,350],discount:100,taxPercent:10,extraCharge:20,donation:10};
test('fee breakdown keeps once-only charges and donation outside tax',()=>assert.deepEqual(feePreview(input),{base:10000,divisions:60000,discount:10000,extra:2000,tax:6200,donation:1000,total:69200}));
test('disabled collection zeroes every amount',()=>assert.equal(feePreview({...input,enabled:false}).total,0));
test('discount capped; finite and negative values sanitized; currency rounded',()=>{assert.equal(feePreview({...input,tournamentFee:-1,divisionFees:[1.235,NaN],discount:900,extraCharge:0,donation:0}).total,0);assert.equal(feePreview({...input,tournamentFee:0,divisionFees:[1.235],discount:0,taxPercent:0,extraCharge:0,donation:0}).total,124)});
