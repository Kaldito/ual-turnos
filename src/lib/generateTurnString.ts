export function generarStringAleatorio() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  let resultado = '';

  // Agregar dos letras aleatorias
  for (let i = 0; i < 2; i++) {
    const indiceAleatorio = Math.floor(Math.random() * letras.length);
    resultado += letras.charAt(indiceAleatorio);
  }

  // Agregar un número aleatorio al final
  const indiceNumeroAleatorio = Math.floor(Math.random() * numeros.length);
  resultado += numeros.charAt(indiceNumeroAleatorio);

  return resultado;
}
