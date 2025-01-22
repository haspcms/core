export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}
