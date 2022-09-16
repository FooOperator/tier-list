import { Template } from '@prisma/client';
import { trpcHooks } from '../utils/trpcHooks'

export const useGetTemplates = (params?: { name?: string, tags?: string }) => {
  return trpcHooks.useQuery(['template.get']);
}

type TemplateData = Template;

// export const useInsertTemplate = (data: TemplateData) => {
//   return trpcClient.useQuery(['template.post', data]);
// }

// export const useUpdateTemplate = (data: TemplateData) => {
//   return trpcClient.useMutation(['template.put', data]);
// }

// export const useRemoveTemplate = (id: string) => {
//   return trpcClient.useMutation(['template.delete', id]);
// }