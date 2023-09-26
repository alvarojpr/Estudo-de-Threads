import Semaphore from "semaphore-async-await";

const semaforoTabaco = new Semaphore(0);
const semaforoPapel = new Semaphore(0);
const semaforoFósforo = new Semaphore(0);
const semaforoVendedor = new Semaphore(1);

async function fumanteComTabaco() {
  while (true) {
    await semaforoTabaco.acquire();
    await semaforoVendedor.acquire();
    console.log("Fumante com tabaco pegou papel e fósforos");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Fumante com tabaco terminou de fumar");
    semaforoVendedor.release();
  }
}

async function fumanteComPapel() {
  while (true) {
    await semaforoPapel.acquire();
    await semaforoVendedor.acquire();
    console.log("Fumante com papel pegou tabaco e fósforos");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Fumante com papel terminou de fumar");
    semaforoVendedor.release();
  }
}

async function fumanteComFósforo() {
  while (true) {
    await semaforoFósforo.acquire();
    await semaforoVendedor.acquire();
    console.log("Fumante com fósforos pegou tabaco e papel");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Fumante com fósforos terminou de fumar");
    semaforoVendedor.release();
  }
}

async function vendedor() {
  while (true) {
    const ingredientes = Math.floor(Math.random() * 3);
    switch (ingredientes) {
      case 0:
        await semaforoVendedor.acquire();
        console.log("Vendedor colocou tabaco e papel na mesa");
        semaforoFósforo.release();
        break;
      case 1:
        await semaforoVendedor.acquire();
        console.log("Vendedor colocou tabaco e fósforos na mesa");
        semaforoPapel.release();
        break;
      case 2:
        await semaforoVendedor.acquire();
        console.log("Vendedor colocou papel e fósforos na mesa");
        semaforoTabaco.release();
        break;
    }
    semaforoVendedor.release();
  }
}

async function main() {
  const fumantes = [fumanteComTabaco, fumanteComPapel, fumanteComFósforo];
  const promessas = fumantes.map((fumante) => fumante());
  promessas.push(vendedor());
  await Promise.all(promessas); // esperar que todas as threads terminem a execução
}

main();
