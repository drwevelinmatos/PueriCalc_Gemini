// tabs/cardio/sbp_data.js
export const SBP_DATA = {
    "M": {
        // Idade: { P_Estatura: {pas90, pas95, pad90, pad95} }
        1: { 5: { pas90: 98, pas95: 102, pad90: 52, pad95: 54 }, 50: { pas90: 100, pas95: 103, pad90: 53, pad95: 55 } },
        2: { 5: { pas90: 100, pas95: 104, pad90: 55, pad95: 57 }, 50: { pas90: 102, pas95: 106, pad90: 56, pad95: 58 } },
        // ... adicione as outras idades conforme o seu CSV ...
    },
    "F": {
        1: { 5: { pas90: 98, pas95: 101, pad90: 54, pad95: 59 }, 50: { pas90: 100, pas95: 103, pad90: 56, pad95: 60 } },
        2: { 5: { pas90: 101, pas95: 104, pad90: 58, pad95: 62 }, 50: { pas90: 103, pas95: 106, pad90: 60, pad95: 64 } }
    }
};
