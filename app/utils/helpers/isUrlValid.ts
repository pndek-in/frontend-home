const isUrlValid = (url: string): boolean => {
  const urlWithoutQuery = url.split("?")[0]
  const pattern = new RegExp(
    /^((ftp|http|https):\/\/)?(www\.)?(?!.*(ftp|http|https|www\.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#-]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/
  )

  return pattern.test(urlWithoutQuery)
}

export default isUrlValid