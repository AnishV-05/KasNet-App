export const REGEX_VALIDATORS = {
  alphanumeric: /^[^<>$#=*!"/+?¿|]+$/i,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/,
  number: /^[0-9]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+.\-~><?={},:;])(?=.{8,})/,
  user: /^[a-zA-ZñÑ0-9]+$/,
  onlyNumbers: /[^0-9]/g,
}

export function inputFormValidation(validation: string) {
  let expression: RegExp
  switch (validation) {
    case 'number':
      return (expression = /[A-Za-zÑÁÉÍÓÚñáéíóú`~!¡@#$%^&*()_|+\-=?;:'",.<>°]/g)
    case 'alpha':
      return (expression = /[0-9`~!¡@#$%^&*()_|+\-=?;:'",.<>°]/g)
    case 'alphanumeric':
      return (expression = /[`~!¡@#$%^&*()_|+\-=?;:'",.<>°]/g)
    case 'text':
      return (expression = /[0-9`~!¡@#$%^&*()_|+\-=?;:'",.<>°]/g)
    default:
      return (expression = /[]/g)
  }
}
