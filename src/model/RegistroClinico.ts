export type NivelUrgencia = 'Baixa' | 'Média' | 'Alta' | 'Emergência';

export type RegistroClinico = {
  id: number;

  cpfTutor: string;
  nomeTutor: string;
  telefoneTutor: string;

  nomeAnimal: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;

  urgencia: NivelUrgencia | string;
  dataRetorno: string;
  observacoes: string;

  criadoEm: string;
};