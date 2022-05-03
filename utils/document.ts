export const moveScrollToTop = (target = "#back-to-top-anchor") => {
  const divRef = document.querySelector(target);

  if (divRef) {
    divRef.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
