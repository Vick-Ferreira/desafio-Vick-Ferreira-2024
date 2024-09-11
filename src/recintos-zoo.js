class RecintosZoo {
    constructor(animais, recintos) {
        this.animais = animais;
        this.recintos = recintos;
    }
    analisaRecintos(animal, quantidade) {
        const animalInformado = this.animais[animal.toLowerCase()];//EX: MACACO = animalInformado.bioma = ['savana', 'floresta']

        let recintosViaveis = [];

        if (!animalInformado) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) { //SE TRUE, VIRA FALSE
            return { erro: "Quantidade inválida" };
        }

        for (let numeroRecinto in this.recintos) {//captura a chave de um elemento no objeto recintos e a armazena na variável numeroRecinto, código processa um recinto por vez
            const recinto = this.recintos[numeroRecinto];
            
            // Verificar bioma do recinto, leva em concideração  que é uma string composta 'x e y'
            const biomasRecinto = recinto.bioma.includes(' e ') ? recinto.bioma.split(' e ') : [recinto.bioma];
        
            let biomaValido;
            if (Array.isArray(animalInformado.bioma)) {//EX: MACACO , SE animalInformado.bioma = ['savana', 'floresta']  (quando bioma é ARRAY)

                biomaValido = animalInformado.bioma.some(b => biomasRecinto.includes(b));
            } else {
                biomaValido = biomasRecinto.includes(animalInformado.bioma);//se não é array conpara com a string
            }

            if (!biomaValido) {//diferente que
                continue;// Se o bioma do recinto não for válido para o animal, pula para a proximo
            }

            const espacoOcupado = this.calculaEspacoOcupado(recinto.animaisPresentes);// Calcula o espaço ocupado e o valor livre no recinto
            let valorlivre = recinto.valortotal - espacoOcupado;//let = valor altera a cada loop

            
            const outrasEspecies = recinto.animaisPresentes.filter(// filtra para ver se tem outras espécies no recinto
                (item) => !item.toLowerCase().includes(animal.toLowerCase())////se for diferente do animal que foi informado item será incluído na lista outrasEspecies
            );
            const espacoExtra = outrasEspecies.length > 0 ? 1 : 0;// se o a lista de espacoExtra for > que 0, retorna verdadeiro : 1 logo,  false: 0
            valorlivre += espacoExtra; // Adiciona o espaço extra ao valor livre

            const espacoNecessario = quantidade * animalInformado.espaco;
            const espacoDisponivel = valorlivre - espacoNecessario;

            if (espacoDisponivel < 0) {
                continue; // Pula para o próximo recinto se não houver espaço suficiente
            }

            // Verificar condições adicionais para carnívoros e hipopótamos
            if (recinto.animaisPresentes.length > 0) {
                const recintosViaveisCarnivoros = this.recintosAnimaisCarnivoros(recinto.animaisPresentes, animal.toLowerCase());

                if (animal.toLowerCase() === "hipopotamo") {
                    const recintoViavelHipopotamo = this.recintoViaveisHipopotamo(recinto, quantidade);
                    if (recintoViavelHipopotamo.erro) {
                        continue;// pula se não for viável
                    }
                }

                if (animalInformado.carnivoro && recintosViaveisCarnivoros.erro) {
                    continue;
                }

            } else if (animal.toLowerCase() === "macaco") { //se for macaco
                // Verifica se o recinto está vazio e se a quantidade de macacos a ser adicionada é 1
                if (quantidade === 1 && recinto.animaisPresentes.length === 0) {
                    continue; // Não adiciona o macaco em um recinto vazio
                }
            }
            // Verifica se o recinto já contém carnívoros e se o animal sendo adicionado não é carnívoro
            if (recinto.animaisPresentes.some(animal => this.animais[animal.split(' ')[1].toLowerCase()].carnivoro) && !animalInformado.carnivoro) {//carnivoros de especies diferentes não devem ficar juntas
                continue; 
            }

            recintosViaveis.push(`Recinto ${numeroRecinto} (espaço livre: ${valorlivre - espacoNecessario} total: ${recinto.valortotal})`);
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
        return { recintosViaveis };
    }
    
    
    calculaEspacoOcupado(animaisPresentes) {
        let espacoOcupado = 0;
    
        // Processa cada animal presente no recinto
        animaisPresentes.forEach(animal => {
            
            const [quantidadeAnimal, ...tipoAnimalArray] = animal.split(' ');// Separa a string com base nos espaços
            const quantidade = parseInt(quantidadeAnimal, 10); // Converte a quantidade para número inteiro
            const tipoAnimal = tipoAnimalArray.join(' ').trim().toLowerCase(); // Junta o nome do animal e converte para minúsculas
    
            const animalNoRecinto = this.animais[tipoAnimal];
            if (animalNoRecinto) {
                espacoOcupado += quantidade * animalNoRecinto.espaco;
            }
        });
    
        return espacoOcupado;
    }

    
    recintosAnimaisCarnivoros(animaisPresentes, animalInformado) {
        const tipoAnimalInformado = animalInformado.toLowerCase().trim();// Obtém os dados do animal informado
        const dadosAnimalInformado = this.animais[tipoAnimalInformado];//vai ate o obj para ver os dados do animal que foi informado : leao: { espaco: 3, bioma: 'savana', 

        for (const animal of animaisPresentes) {// animais ja no recinto, cada loop me tras qauntidade e tipo
            const partesString = animal.split(' ');//divide 'quantidade tipo'
            const quantidade = parseInt(partesString[0], 10);// Obtém a quantidade do animal
            const tipoAnimalPresenteRecinto = partesString.slice(1).join(' ').trim().toLowerCase();// Reconstroi o tipo do animal  'leao'
            const dadosAnimalPresenteRecinto = this.animais[tipoAnimalPresenteRecinto];// Obtém os dados do animal presente :  leao: { espaco: 3, bioma: 'savana', carnivoro: true }


            if (dadosAnimalPresenteRecinto.carnivoro || dadosAnimalInformado.carnivoro) {///se o animal presente OU o informado forem carniforos, entra
                if (tipoAnimalPresenteRecinto !== tipoAnimalInformado) {
                    return { erro: "Animais carnívoros devem habitar somente com a própria espécie" };
                }
            }
        }
        return { sucesso: true };
    }

    recintoViaveisHipopotamo(recinto, quantidade) {
        const bioma = recinto.bioma;
        const animaisPresentes = recinto.animaisPresentes;

        const espacoOcupado = this.calculaEspacoOcupado(animaisPresentes);
        const valorlivre = recinto.valortotal - espacoOcupado; 
        const espacoNecessario = quantidade * this.animais['hipopotamo'].espaco;
    
        if (espacoNecessario > valorlivre) {
            return { erro: 'Espaço insuficiente para a quantidade de hipopótamos solicitada.' };
        }
    
        if (bioma === 'savana' || bioma === 'rio') {// Se o bioma for "savana" ou "rio"
            if (animaisPresentes.length > 0) {  // e Se houver animais presentes que não são hipopotamos, o recinto não é viável
                return { erro: 'Recinto não viável - Hipopótamo deve estar sozinho em "savana" ou "rio"' };
            }
            return { recintoViavel: true };//caso contrario , de estart vazio é viável
        }
       // Se o bioma for "savana e rio", o recinto é viável mesmo com outras espécies
        if (bioma === 'savana e rio') {
            return { recintoViavel: true };
        }
    
        return { erro: 'Recinto não viável - Bioma incompatível' };
    }

}
const animais = {
    leao: { espaco: 3, bioma: 'savana', carnivoro: true },
    leopardo: { espaco: 2, bioma: 'savana', carnivoro: true },
    crocodilo: { espaco: 3, bioma: 'rio', carnivoro: true },
    macaco: { espaco: 1, bioma: ['savana', 'floresta'], carnivoro: false },
    gazela: { espaco: 2, bioma: 'savana', carnivoro: false },
    hipopotamo: { espaco: 4, bioma: ['savana', 'rio'], carnivoro: false },
};

const recintos = {
    1: { bioma: 'savana', valortotal: 10, animaisPresentes: ['3 macaco'] },
    2: { bioma: 'floresta', valortotal: 5, animaisPresentes: [] },
    3: { bioma: 'savana e rio', valortotal: 7, animaisPresentes: ['1 gazela'] },
    4: { bioma: 'rio', valortotal: 8, animaisPresentes: [] },
    5: { bioma: 'savana', valortotal: 9, animaisPresentes: ['1 leao'] },
}


export { RecintosZoo as RecintosZoo };
