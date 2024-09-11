import { RecintosZoo } from "./recintos-zoo.js";

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
// Cria uma instância da classe RecintosZoo 
const zoo = new RecintosZoo(animais, recintos);

// Executa o método analisaRecintos
const resultado = zoo.analisaRecintos('UNICORNIO', 1);
const resultado0 = zoo.analisaRecintos('MACACO', 1);
const resultado1 = zoo.analisaRecintos('MACACO', 2);
const resultado2 = zoo.analisaRecintos('MACACO', 10);
const resultado3 = zoo.analisaRecintos('LEAO', 1);
const resultado4 = zoo.analisaRecintos('LEOPARDO', 1);
const resultado5 = zoo.analisaRecintos('CROCODILO', 1);
const resultado6 = zoo.analisaRecintos('HIPOPOTAMO', 1);
const resultadO7 = zoo.analisaRecintos('GAZELA', 1);

// Exibe o resultado
console.log('Caso de animal inválido: 1 UNICORNIO', resultado);
console.log('Recintos viáveis para 1 MACACO:', resultado0);
console.log('Recintos viáveis para 2 MACACO:', resultado1);
console.log('Recintos viáveis para 10 MACACO:', resultado2);
console.log('Recintos viáveis para 1 LEAO:', resultado3);
console.log('Recintos viáveis para 1 LEOPARDO:', resultado4);
console.log('Recintos viáveis para 1 CROCODILO:', resultado5);
console.log('Recintos viáveis para 1 HIPOPOTAMO:', resultado6);
console.log('Recintos viáveis para 1 GAZELA:', resultadO7);

describe('Recintos do Zoologico', () => {

    test('Deve rejeitar animal inválido', () => {
            const resultado = new RecintosZoo(animais, recintos).analisaRecintos('UNICORNIO', 1);
            expect(resultado.erro).toBe("Animal inválido");
            expect(resultado.recintosViaveis).toBeFalsy();
        });

    test('Deve rejeitar quantidade inválida', () => {
            const resultado = new RecintosZoo(animais, recintos).analisaRecintos('MACACO', 0);
            expect(resultado.erro).toBe("Quantidade inválida");
            expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
            const resultado = new RecintosZoo(animais, recintos).analisaRecintos('MACACO', 10);
            expect(resultado.erro).toBe("Não há recinto viável");
            expect(resultado.recintosViaveis).toBeFalsy();
        });


   

    // Novos Testes
    //(+ de 1 especie, + 1 espaço extra )
    //MACACO NÃO FICA SOZINHO
    //CARNIVORO FICA COM CARNIVORO E MESMA ESPECIE
    //HIPOPOTAMOS SO FICA COM OUTRA ESPECIE SE FOR NO BIOMA 'SAVANA E RIO'

    test('Deve encontrar recintos para 1 macacos ( MACACO NÃO FICA EM RECINTOS SOZINHO)', () => {
        let resultado = new RecintosZoo(animais, recintos).analisaRecintos('MACACO', 1);
        expect(resultado.erro).toBeFalsy();
    
        expect(resultado.recintosViaveis).toContain('Recinto 1 (espaço livre: 6 total: 10)'); 
        expect(resultado.recintosViaveis).toContain('Recinto 3 (espaço livre: 5 total: 7)'); 
        expect(resultado.recintosViaveis.length).toBeGreaterThan(0);
    
    });
    test('Deve encontrar recintos para 2 macacos ( +  DE 1 MACACO NO RECINTO)', () => {

        const resultado = new RecintosZoo(animais, recintos).analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 4 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });
    test('Animais carnívoros devem habitar somente com a própria espécie - leao', () => {
        // Testa hipopótamo sozinho
        let resultado = new RecintosZoo(animais, recintos).analisaRecintos('LEAO', 1);
        expect(resultado.erro).toBeFalsy();
        // Espera recintos com savana ou rio quando o hipopótamo está sozinho
        expect(resultado.recintosViaveis).toContain('Recinto 5 (espaço livre: 3 total: 9)'); 
        expect(resultado.recintosViaveis.length).toBeGreaterThan(0);
    
    });
    test('Animais carnívoros devem habitar somente com a própria espécie - leopardo', () => {
        const resultado = new RecintosZoo(animais, recintos).analisaRecintos('LEOPARDO', 10);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });
    test('Animais carnívoros devem habitar somente com a própria espécie - crocodilo', () => {
        // Testa hipopótamo sozinho
        let resultado = new RecintosZoo(animais, recintos).analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        // Espera recintos com savana ou rio quando o hipopótamo está sozinho
        expect(resultado.recintosViaveis).toContain('Recinto 4 (espaço livre: 5 total: 8)'); 
        expect(resultado.recintosViaveis.length).toBeGreaterThan(0);
    
    });
    
    test('Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio. ', () => {
        // Testa hipopótamo sozinho
        let resultado = new RecintosZoo(animais, recintos).analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        // Espera recintos com savana ou rio quando o hipopótamo está sozinho
        expect(resultado.recintosViaveis).toContain('Recinto 4 (espaço livre: 4 total: 8)'); // Rio
        expect(resultado.recintosViaveis).toContain('Recinto 3 (espaço livre: 2 total: 7)'); // Savana e Rio
        expect(resultado.recintosViaveis.length).toBeGreaterThan(0);
    
    });

    test('Deve encontrar recintos para 1 gazela,', () => {
        let resultado = new RecintosZoo(animais, recintos).analisaRecintos('GAZELA', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toContain('Recinto 1 (espaço livre: 6 total: 10)'); 
        expect(resultado.recintosViaveis).toContain('Recinto 3 (espaço livre: 3 total: 7)'); 
        expect(resultado.recintosViaveis.length).toBeGreaterThan(0);
    
    });



});

