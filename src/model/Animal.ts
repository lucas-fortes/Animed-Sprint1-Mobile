export type EspecieAnimal = 'Canina' | 'Felina' | 'Outra';

export type Animal = {
  id: number;
  nome: string;
  especie: EspecieAnimal;
  raca: string;
  idade: string;
  peso: string;
  cpfTutor: string;
  nomeTutor: string;
  criadoEm: string;
};