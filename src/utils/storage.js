// 存储数据
export const setItem = (key, value) => {
  // 将数组对象类型的数据转换成字符串的格式，再进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }

  window.localStorage.setItem(key, value)
}

// 获取数据

export const getItem = key => {
  //  先拿到本地的数据，进行try catch
  const data = window.localStorage.getItem(key)

  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除数据

export const removeItem = key => {
  window.localStorage.removeItem(key)
}
