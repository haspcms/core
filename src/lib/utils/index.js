/**
 * Sorts an array of blocks based on their order property
 * @param {Array} list - Array of objects containing an order property
 * @returns {Array} Sorted array of blocks
 */
export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}

/**
 * Creates a replacer function for JSON.stringify to handle circular references
 * @returns {Function} A replacer function that converts circular references to "[Circular]"
 * @example
 * const obj = { a: 1 };
 * obj.self = obj;
 * JSON.stringify(obj, getCircularReplacer());
 */
export function getCircularReplacer() {
  const seen = new WeakSet();
  return function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  };
}
