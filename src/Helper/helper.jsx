export  const catchError = (e) => {
  let message = 'Unknown error';
  if (typeof e === 'string') message = e;
  if (Object.prototype.hasOwnProperty.call(e, 'message') && typeof e.message === 'string') ({ message } = e);
  if (Object.prototype.hasOwnProperty.call(e, 'error') && typeof e.error === 'string') ({ error: message } = e);
  if (Object.prototype.hasOwnProperty.call(e, 'msg') && typeof e.msg === 'string') ({ msg: message } = e);
  return message;
};

export const CapitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export const GenerateString = (length) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';

  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}