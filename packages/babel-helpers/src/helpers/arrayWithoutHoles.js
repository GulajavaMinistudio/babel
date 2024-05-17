/* @minVersion 7.0.0-beta.0 */

import arrayLikeToArray from "arrayLikeToArray";

export default function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
