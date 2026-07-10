// tabs/crescimento/who_data.js

// L = Box-Cox power (Assimetria)
// M = Median (Mediana)
// S = Coefficient of variation (Coeficiente de Variação)

export const WHO_DATA = {
  // === DADOS MASCULINOS (0 - 228 meses) ===
  M: {
    peso: {
      0: { l: 0.3487, m: 3.3464, s: 0.14602 },
      1: { l: 0.0838, m: 4.4700, s: 0.13395 },
      6: { l: -0.1661, m: 7.9333, s: 0.10658 },
      12: { l: -0.1627, m: 9.6432, s: 0.10864 },
      // ... Adicionar meses 2 ao 228
    },
    estatura: {
      0: { l: 1, m: 49.8842, s: 0.03795 },
      1: { l: 1, m: 54.7244, s: 0.03557 },
      6: { l: 1, m: 67.6133, s: 0.03544 },
      12: { l: 1, m: 75.7404, s: 0.03606 },
      // Estatura adulto (19 anos / 228 meses) para Alvo Parental
      228: { l: 1, m: 176.1000, s: 0.03960 }
    },
    pc: {
      0: { l: 1, m: 34.4618, s: 0.03666 },
      1: { l: 1, m: 37.3005, s: 0.03212 },
      6: { l: 1, m: 43.3275, s: 0.03058 },
      12: { l: 1, m: 46.0734, s: 0.03046 }
    }
  },

  // === DADOS FEMININOS (0 - 228 meses) ===
  F: {
    peso: {
      0: { l: 0.3809, m: 3.2322, s: 0.14171 },
      1: { l: 0.1256, m: 4.1956, s: 0.12948 },
      6: { l: -0.1559, m: 7.3278, s: 0.10757 },
      12: { l: -0.1601, m: 8.9481, s: 0.11303 },
      // ... Adicionar meses 2 ao 228
    },
    estatura: {
      0: { l: 1, m: 49.1477, s: 0.03790 },
      1: { l: 1, m: 53.6872, s: 0.03572 },
      6: { l: 1, m: 65.7337, s: 0.03541 },
      12: { l: 1, m: 74.0201, s: 0.03657 },
      // Estatura adulto (19 anos / 228 meses) para Alvo Parental
      228: { l: 1, m: 163.2000, s: 0.03980 } 
    },
    pc: {
      0: { l: 1, m: 33.8761, s: 0.03613 },
      1: { l: 1, m: 36.4714, s: 0.03222 },
      6: { l: 1, m: 42.1643, s: 0.03126 },
      12: { l: 1, m: 44.8211, s: 0.03123 }
    }
  }
};
