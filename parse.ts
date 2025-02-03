const parse = (stroke: string) => {
  const onGlide = stroke[0] === "S";
  if (onGlide) stroke = stroke.substring(1);
};
