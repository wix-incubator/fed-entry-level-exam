export const getElementsByText = async (textOptions, page) => {
  let query = `//*[contains(text(), '${textOptions[0]}')`
  textOptions.splice(1).forEach(option => {
    query += ` or contains(text(), '${option}')`
  })
  query += `]`;

  let elements = await page.$x(query);
  elements = elements.filter(p => p._remoteObject.className !== 'HTMLStyleElement')

  return elements
}
