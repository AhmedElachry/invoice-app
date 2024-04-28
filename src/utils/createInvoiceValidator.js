export function validateItemName(itemName) {
  if (!itemName.trim()) {
    return false;
  }
  return true;
}
export function validateItemPrice(itemPrice) {
  if (itemPrice <= 0) {
    return false;
  }
  return true;
}
export function validateItemCount(itemCount) {
  if (itemCount <= 0) {
    return false;
  }
  return true;
}
