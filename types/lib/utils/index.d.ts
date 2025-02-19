/**
 * Sorts an array of objects based on the `order` property in ascending order.
 *
 * @param {Array<{ order: number }>} list - The array of objects to sort.
 * @returns {Array<{ order: number }>} The sorted array.
 */
export function sortBlocks(
  list: Array<{
    order: number;
  }>,
): Array<{
  order: number;
}>;
export function getCircularReplacer(): (key: string, value: any) => any;
