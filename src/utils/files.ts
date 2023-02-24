export const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Unable to read file as base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}