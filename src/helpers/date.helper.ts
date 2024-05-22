export const reviveDate = (dateStr: string | undefined) => {
  if (!dateStr) {
    return dateStr;
  }
  return new Date(dateStr);
}

export const toLocaleDateString = (dateStr: string | undefined) => {
  const date = reviveDate(dateStr);
  if (!date) {
    return '';
  }
  return date.toLocaleString();
}