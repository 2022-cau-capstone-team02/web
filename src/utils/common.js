import { COIN_MINIMAL_DENOM_DIGIT } from '../constants';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function digitNumber(numStr) {
  return (numStr / Math.pow(10, COIN_MINIMAL_DENOM_DIGIT)).toFixed(COIN_MINIMAL_DENOM_DIGIT);
}

export const getChannelName = (name) => {
  if (name === '피지컬갤러리') return '피지컬갤러리 (PHY)';
  else if (name === '곽튜브KWAKTUBE') return '곽튜브KWAKTUBE (KWAK)';
  else if (name === 'BLACKPINK') return 'BLACKPINK (BLPI)';
  else return '';
};
