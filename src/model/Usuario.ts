export type TipoAcessoUsuario = 'CPF' | 'CRMV';

export type Usuario = {
  id: number;
  nome: string;
  tipoAcesso: TipoAcessoUsuario;
  documento: string;
  ufCrmv: string;
  email: string;
  telefone: string;
  clinica: string;
  especialidade: string;
  criadoEm: string;
};