const sliceText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const getText = ($element: JQuery): {
  text: string
  parentText: string
} => {
  const maxLength = 100
  const text = $element.text() || $element.attr('title') || $element.attr('aria-label')
  const parentText =
    $element
      .find('[aria-label]')
      .not('a')
      .not('button')
      .eq(0)
      .attr('aria-label') ||
    $element
      .find('[title]')
      .not('a')
      .not('button')
      .eq(0)
      .attr('title') ||
    $element.siblings().text() || $element.parent().text() || $element.parent().parent().text()

  return {
    text: sliceText(text ?? '', maxLength),
    parentText: sliceText(parentText ?? '', maxLength),
  }
}

export default getText