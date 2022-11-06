import { rest } from 'msw';

const userInfo = [
  {
    id: '657019133',
    name: '방성원',
    totalAsset: '3920000',
    stake: [
      'UCSLrpBAzr-ROVGHQ5EmxnUg,',
      'UCaO6VoaYJv4kS-TQO_M-N_g,',
      'UC-lHJZR3Gqxm24_Vd_AJ5Yw,',
      'UCOmHUn--16B90oW2L6FRR3A,',
      'UClRNDVO8093rmRTtLe4GEPw,',
    ],
  },
];

export const handlers = [
  rest.get('/userInfo', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: userInfo }));
  }),
  rest.post('/userInfo', (req, res, ctx) => {
    userInfo.push(req.body);
    return res(ctx.status(201));
  }),
];
