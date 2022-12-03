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

export const channelListAtom = atom({
  key: 'channelList',
  default: [
    {
      id: 0,
      name: 'Channel A',
      src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
      ticker: 'CHA',
      icoContractAddress: 'ysip1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqusnwmv',
      tokenAddress: '',
      pairAddress: '',
    },
    {
      id: 1,
      name: 'Channel B',
      src: 'https://yt3.ggpht.com/ytc/AMLnZu83-5or1HaIln7R1dxZ3te2xGAoRwhS6cAdsDzCtw=s176-c-k-c0x00ffffff-no-rj',
      ticker: 'CHB',
      icoContractAddress: 'ysip1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3synt0pz',
      tokenAddress: '',
      pairAddress: '',
    },
    {
      id: 2,
      name: 'Channel C',
      src: 'https://yt3.ggpht.com/ytc/AMLnZu8td4l9aiJVroGuuXWhv8FNayQXpKqykx3ihfyk=s88-c-k-c0x00ffffff-no-rj',
      ticker: 'CHC',
      icoContractAddress: 'ysip1z7asfxkwv0t863rllul570eh5pf2zk07k3d86ag4vtghaue37l5s7demmt',
      tokenAddress: '',
      pairAddress: '',
    },
    {
      id: 3,
      name: 'Channel D',
      src: 'https://yt3.ggpht.com/P5HXQNMuTDRWwudWf7SyRX47GmPQvgo3hfpEniFCAA6vhSFBjU8oEVqHStEErz2PjJXMhuK3nw=s68-c-k-c0x00ffffff-no-rj',
      ticker: 'CHD',
      icoContractAddress: 'ysip182jzjwdyl5fw43yujnlljddgtrkr04dpd30ywp2yn724u7qhtaqspak4n3',
      tokenAddress: '',
      pairAddress: '',
    },
    {
      id: 4,
      name: 'Channel E',
      src: 'https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj',
      ticker: 'CHE',
      icoContractAddress: 'ysip1yrnh5d60cp5tctt8ngv626u7g3ejkmmecc92etjt2wue5ff9wxsqjc942j',
      tokenAddress: '',
      pairAddress: '',
    },
  ],
});
