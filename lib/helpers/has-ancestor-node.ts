/**
 * Returns true if the node given as the second parameter exists in ancestor
 * chain of the node given as the first parameter, or the nodes are equal.
 */
export function hasAncestorNode(node: Node, needle: Node | null): boolean {
  if (!needle) return false;
  let ancestor: Node | null = node;
  do {
    if (ancestor === needle) return true;
    ancestor = ancestor.parentNode;
  } while (ancestor);
  return false;
}
