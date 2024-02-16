const formatNumber = (num: number, separator?: string) => {
  {
    let suffix = ""

    if (num > 999999) {
      suffix = "M"
      num = Math.ceil(num / 1000000)
    } else {
      if (num > 999) {
        suffix = "K"
        num = Math.ceil(num / 1000)
      }
    }

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || '.') + suffix
  }
}

export default {
  formatNumber
}