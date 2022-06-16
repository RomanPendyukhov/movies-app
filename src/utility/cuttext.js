const cutText = (text) => {
  const size = window.innerWidth > 767 ? 115 : 250;

  if (text.length > size) {
    const changedText = text.split(' ').reduce(
      (acc, item) => {
        if (acc.text.concat(item).join(' ').length < size) acc.text = acc.text.concat(item);
        return acc;
      },
      { text: [] }
    );
    return `${changedText.text.join(' ')}...`;
  }
  return text;
};

export default cutText;
