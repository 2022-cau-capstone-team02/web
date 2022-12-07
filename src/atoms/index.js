import { atom } from 'recoil';
import { UPPERCASE_COIN_MINIMAL_DENOM } from '../constants';

// userAsset은 value의 단위가 key
export const userAssetAtom = atom({
  key: 'userAsset',
  default: {
    [UPPERCASE_COIN_MINIMAL_DENOM]: 0,
  },
});

// userAsset은 value의 단위가 base
export const userFundingAtom = atom({
  key: 'userFunding',
  default: {},
});
