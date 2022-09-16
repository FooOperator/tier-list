import * as trpc from '@trpc/server';
import * as z from 'zod';

type TemplateGetSchema = {
  name?: string;
  // tags?: string[];
}



export const router = trpc
  .router()
  .query('hi', {
    input: z.string(),
    async resolve(req) {
      return { message: 'this is what you sent me', content: req.input }
    }
  })
  .query('template.get', {
    input: z.object({
      name: z.string().optional(),
      tags: z.array(z.string()).optional()
    }).optional(),
    async resolve(req) {

      if (!req.input) return { message: "Not even an object :(" }

      const { name, tags } = req.input!;
      return {
        message: "I should get the following.",
        content: `${name ? (`Templates matching name ${name}`) : "All Templates"}${tags ? (` with tags ${tags}`) : ""}.`
      }
    }
  })

export type AppRouter = typeof router;