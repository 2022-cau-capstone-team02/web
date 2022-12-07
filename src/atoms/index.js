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
      icoContractAddress: 'ysip149ltwdnpxrhx9al42s359glcjnsuc6x3dalz28f04dsxhlu7jhmq5qphhz',
      tokenAddress: '',
      poolAddress: '',
    },
    {
      id: 1,
      name: 'Channel B',
      src: 'https://yt3.ggpht.com/ytc/AMLnZu83-5or1HaIln7R1dxZ3te2xGAoRwhS6cAdsDzCtw=s176-c-k-c0x00ffffff-no-rj',
      ticker: 'CHB',
      icoContractAddress: 'ysip13h9k5rsrgveg6sdtzg34qg499ns0e5kku74kapnskegtwyfspf6qtyjav2',
      tokenAddress: '',
      poolAddress: '',
    },
    {
      id: 2,
      name: 'Channel C',
      src: 'https://yt3.ggpht.com/ytc/AMLnZu8td4l9aiJVroGuuXWhv8FNayQXpKqykx3ihfyk=s88-c-k-c0x00ffffff-no-rj',
      ticker: 'CHC',
      icoContractAddress: 'ysip172v738ut05le2272gm6akv9hw2jqfwfkm7ej7ndy53skxq757s5shlmuz8',
      tokenAddress: '',
      poolAddress: '',
    },
    {
      id: 3,
      name: 'Channel D',
      src: 'https://yt3.ggpht.com/P5HXQNMuTDRWwudWf7SyRX47GmPQvgo3hfpEniFCAA6vhSFBjU8oEVqHStEErz2PjJXMhuK3nw=s68-c-k-c0x00ffffff-no-rj',
      ticker: 'CHD',
      icoContractAddress: 'ysip1q6zlut7gtkzknkk773jecujwsdkgq882zxj6hh0hv7my9qwfn90q0elvvd',
      tokenAddress: '',
      poolAddress: '',
    },
    {
      id: 4,
      name: 'Channel E',
      src: 'https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj',
      ticker: 'CHE',
      icoContractAddress: 'ysip1ujx2uxgzh3sqy6fs5m0zetrdglapyfvter3l6urz60y2rlmkdd0q2st4ha',
      tokenAddress: '',
      poolAddress: '',
    },
    // {
    //   id: 5,
    //   name: 'Channel F',
    //   src: 'https://yt3.ggpht.com/ytc/AMLnZu9NaXMe8tiBBVF3N608TFvJSihHF2Ez8yPIqkTl1g=s176-c-k-c0x00ffffff-no-rj',
    //   ticker: 'CHF',
    //   icoContractAddress: 'ysip1axw5he6ktvz8rgacec3ldxmegy0urn0xevsysl7e0hx6dx90er6qf406rq',
    //   tokenAddress: 'ysip1m4ns69zvkk2zv0946mw298tlky5ckvu08rtxggtg29p784kc5sxqfec72j',
    //   poolAddress: 'ysip18vq6emxwq0s77wpt0f5e4zujdjfndcs0kqlr7u8nn2uwv03nef8qeucjgw',
    // },
    // {
    //   id: 6,
    //   name: 'Channel G',
    //   src: 'https://yt3.ggpht.com/ytc/AMLnZu9NaXMe8tiBBVF3N608TFvJSihHF2Ez8yPIqkTl1g=s176-c-k-c0x00ffffff-no-rj',
    //   ticker: 'CHG',
    //   icoContractAddress: 'ysip1phczxfyh2jmymd3qn0u0unlazytqnrtasp8cdy20j6w6y323q8fswxass8',
    //   tokenAddress: 'ysip14sa4u42n2a8kmlvj3qcergjhy6g9ps06rzeth94f2y6grlat6u6st567us',
    //   poolAddress: 'ysip1nc84knc0n7td5xqplwy0luh97zd8hv5mhvm9cdempc05xk0xvxyqxprw5j',
    // },
  ],
});
