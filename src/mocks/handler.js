import { rest } from 'msw';

const userInfo = [
  {
    id: '657019133',
    name: '방성원',
    totalAsset: '3920000',
    stake: [
      'UCOmHUn--16B90oW2L6FRR3A,',
      'UClRNDVO8093rmRTtLe4GEPw,',
      'UCdtRAcd3L_UpV4tMXCw63NQ,',
      // 'UCOmHUn--16B90oW2L6FRR3A,',
      // 'UClRNDVO8093rmRTtLe4GEPw,',
    ],
  },
];

const getMonthlyDataByCustomUrl = rest.get('/youtube/monthly/:customUrl', (req, res, ctx) => {
  const { customUrl } = req.params;
  const mockMonthlyData = {
    '@blackpink': {
      view: {
        '2022-01': 572209594,
        '2022-02': 491366500,
        '2022-03': 474456359,
        '2022-04': 392095217,
        '2022-05': 361466924,
        '2022-06': 366466801,
        '2022-07': 343629481,
        '2022-08': 376897594,
        '2022-09': 1285277063,
        '2022-10': 1207354048,
        '2022-11': 557163020,
        '2022-12': 463243220,
      },
      subscriber: {
        '2022-01': 71100000,
        '2022-02': 71900000,
        '2022-03': 72600000,
        '2022-04': 73300000,
        '2022-05': 73900000,
        '2022-06': 74500000,
        '2022-07': 75100000,
        '2022-08': 76000000,
        '2022-09': 79700000,
        '2022-10': 82000000,
        '2022-11': 82800000,
        '2022-12': 83300000,
      },
    },
    '@jbkwak': {
      view: {
        '2022-01': 10927717,
        '2022-02': 7716693,
        '2022-03': 8774392,
        '2022-04': 9872139,
        '2022-05': 6907662,
        '2022-06': 6746392,
        '2022-07': 7170506,
        '2022-08': 11812970,
        '2022-09': 8453220,
        '2022-10': 17237510,
        '2022-11': 20404449,
        '2022-12': 12978751,
      },
      subscriber: {
        '2022-01': 971500,
        '2022-02': 974200,
        '2022-03': 977600,
        '2022-04': 981000,
        '2022-05': 983000,
        '2022-06': 984700,
        '2022-07': 986800,
        '2022-08': 990400,
        '2022-09': 993100,
        '2022-10': 1010000,
        '2022-11': 1120000,
        '2022-12': 1150000,
      },
    },
    '@physicalgallery_official': {
      view: {
        '2022-01': 11150250,
        '2022-02': 20458433,
        '2022-03': 20123638,
        '2022-04': 12293963,
        '2022-05': 15725463,
        '2022-06': 14214530,
        '2022-07': 11960968,
        '2022-08': 36133418,
        '2022-09': 26657156,
        '2022-10': 18632525,
        '2022-11': 16249640,
        '2022-12': 16828188,
      },
      subscriber: {
        '2022-01': 3060000,
        '2022-02': 3060000,
        '2022-03': 3060000,
        '2022-04': 3070000,
        '2022-05': 3060000,
        '2022-06': 3060000,
        '2022-07': 3070000,
        '2022-08': 3070000,
        '2022-09': 3090000,
        '2022-10': 3100000,
        '2022-11': 3090000,
        '2022-12': 3090000,
      },
    },
  };
  return res(ctx.status(200), ctx.json({ data: mockMonthlyData[customUrl] }));
});

export const handlers = [
  getMonthlyDataByCustomUrl,
  rest.get('/userInfo', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: userInfo }));
  }),
  rest.post('/userInfo', (req, res, ctx) => {
    userInfo.push(req.body);
    return res(ctx.status(201));
  }),
];
