const bodyElement = document.querySelector("body");

export const handleBodyOverflow = overflowed => {
  const method = overflowed ? "add" : "remove";
  bodyElement.classList[method]("overflow-hidden");
};
