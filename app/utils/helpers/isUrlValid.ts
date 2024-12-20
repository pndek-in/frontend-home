const isUrlValid = (url: string): boolean => {
  const urlWithoutQuery = url.split("?")[0]
  const pattern = new RegExp(
    /^(ftp|http|https):\/\/[^\s/$.?#].[^\s]*$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([/][^\s]*)?$/
  )

  return pattern.test(urlWithoutQuery)
}

export default isUrlValid