export function normalDistribution(mean: number, stdDev: number): number {
    let u1, u2;
    do {
      u1 = Math.random();
      u2 = Math.random();
    } while (u1 <= Number.EPSILON);
  
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z1 * stdDev + mean;
  }
  