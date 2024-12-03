export const handleKeyPress = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  const { key } = event;
  const forbiddenChars = [
    "!",
    "#",
    "$",
    "%",
    "&",
    "*",
    "(",
    ")",
    "+",
    "@",
    "^",
    "_",
    "/"
  ];
  if (forbiddenChars.includes(key)) {
    event.preventDefault();
  }
};
