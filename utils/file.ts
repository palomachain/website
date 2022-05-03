export const isImageFile = (file) => {
  if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
    return true
  }

  return  false
}

export const getFileExtension = (fileName) => fileName.split(".").pop();

export const b64toBlob = (b64Data, contentType, sliceSize) => {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
