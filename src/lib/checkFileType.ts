export const isImageByType = (type: string) => {
  return type.startsWith('image/')
}

export const isImageByName = (name: string) => {
  const ext = name.split('.').pop()
  if (ext === undefined) {
    return false
  }
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'avif'].includes(ext)
}
