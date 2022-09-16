import express from 'express';
import config from './config';
import { router } from './trpcRouter';
import * as trpcExpress from '@trpc/server/adapters/express';
import trpc from '@trpc/server';
const { PORT } = config;
import cors from 'cors';

const app = express();
app.use(cors())
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({

});

type Context = trpc.inferAsyncReturnType<typeof createContext>
app.use(cors({

}))
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router,
  createContext
}));

app.listen(PORT, () => {
  console.log('listening at: ', PORT);
});

