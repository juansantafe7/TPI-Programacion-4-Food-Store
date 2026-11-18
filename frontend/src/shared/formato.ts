const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })
const fechaCorta = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" })

export const dinero = (importe: number) => pesos.format(importe)
export const fecha = (valor: string) => fechaCorta.format(new Date(valor.endsWith("Z") || /[+-]\d\d:\d\d$/.test(valor) ? valor : `${valor}Z`))
