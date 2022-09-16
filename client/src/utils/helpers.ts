type DatasetType = { [key: string]: string };
type RefsCollection = React.RefObject<HTMLElement>[];

/**
 * !!!MUTATES REF!!!
 * 
 * @param dataset 
 * @param refs 
 */

export const applyDatasetToRefs = (
  dataset: DatasetType,
  refs: RefsCollection
) => {
  const newRefs = [...refs];

  newRefs.forEach((ref) => {
    Object.keys(dataset).forEach((key) => {
      ref.current!.dataset[key] = dataset[key];
    });
  });
};

