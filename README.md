# Animed - Mobile App Development

Projeto mobile desenvolvido em **React Native com Expo e TypeScript** para a disciplina de **Mobile App Development**, dentro do contexto do Challenge FIAP 2026 - CLYVO VET.

O aplicativo Animed tem como objetivo simular uma solução mobile para apoio ao acompanhamento clínico veterinário, permitindo o registro de atendimentos, visualização dos agendamentos do dia, consulta de histórico clínico, edição de perfil profissional e gerenciamento de dados locais.

---

## Integrantes

- Erick Bernardes Bradaschia - RM 565733
- Gabriel Santos Claudino - RM 564054
- Kaiky de Oliveira Silva - RM 566067
- Lucas Fortes de Lima - RM 559523
- Jonathan Moreira Gomes - RM 565060

---

## Contexto do Projeto

O Challenge CLYVO VET propõe soluções digitais relacionadas à continuidade do cuidado e ao engajamento na jornada de saúde do pet.

Dentro desse contexto, o Animed foi desenvolvido como um protótipo funcional mobile voltado ao profissional veterinário, com foco em:

- cadastro e acompanhamento de registros clínicos;
- vinculação de tutor ao atendimento;
- organização dos atendimentos do dia;
- consulta de histórico clínico;
- armazenamento local dos dados;
- experiência mobile com navegação entre telas.

Esta versão funciona em **modo demonstrativo**, utilizando persistência local com `AsyncStorage`, sem integração com API externa ou banco de dados remoto nesta etapa.

---

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Vector Icons

---

## Principais Conceitos Aplicados

O projeto utiliza os principais conceitos abordados nas aulas de Mobile App Development:

### Componentes React Native

Foram utilizados componentes nativos como:

- `View`
- `Text`
- `TextInput`
- `Image`
- `ScrollView`
- `Modal`
- `Switch`
- `Alert`
- `TouchableHighlight`
- `KeyboardAvoidingView`

### TypeScript

O projeto utiliza TypeScript para tipagem de dados, props e estruturas principais da aplicação.

Exemplos de tipos utilizados:

- `RegistroClinico`
- `Tutor`
- `Atendimento`
- `PerfilUsuario`
- `ConfiguracoesApp`

### Hooks

Foram utilizados hooks para controle de estado e carregamento de dados:

- `useState`
- `useEffect`
- `useFocusEffect`

### TextInput Controlado

Os campos de formulário utilizam o padrão de componente controlado, com:

- `value`
- `onChangeText`
- estado local com `useState`

Esse padrão foi aplicado nas telas de login, cadastro, recuperação de senha, registro clínico, histórico e perfil.

### Navegação

A navegação principal do aplicativo é feita com React Navigation, utilizando navegação por abas inferiores.

Telas principais:

- Início / Dashboard
- Registro
- Histórico
- Perfil
- Configurações

Também existe um menu lateral global acessado pelo botão sanduíche.

### Persistência Local

O aplicativo utiliza `AsyncStorage` para persistir dados localmente no dispositivo.

Dados armazenados:

- registros clínicos;
- perfil do usuário;
- configurações do aplicativo.

---

## Funcionalidades Implementadas

### Login

Tela inicial de autenticação em modo demonstrativo.

Funcionalidades:

- seleção entre CPF e CRMV;
- campo de senha;
- validação de campos obrigatórios;
- navegação para cadastro;
- navegação para recuperação de senha;
- alternância de tema claro/escuro local.

Observação: nesta versão, o login não realiza autenticação em servidor. O acesso é validado apenas em modo demonstrativo.

---

### Cadastro

Tela para criação de conta profissional em modo demonstrativo.

Funcionalidades:

- seleção entre CPF e CRMV;
- seleção de UF para CRMV;
- preenchimento de e-mail dividido em usuário, domínio e sufixo;
- seleção de sufixo `.com` ou `.com.br`;
- validação mínima de e-mail;
- cadastro de senha e confirmação;
- retorno para a tela de login após cadastro.

Observação: o cadastro ainda não persiste usuários em banco externo. O fluxo foi implementado para simular a criação de conta dentro do escopo mobile.

---

### Recuperar Senha

Tela de recuperação de senha em modo demonstrativo.

Funcionalidades:

- preenchimento de e-mail;
- seleção entre CPF e CRMV;
- seleção de UF para CRMV;
- validação dos dados informados;
- simulação do envio de link de redefinição.

Observação: não há envio real de e-mail nesta versão.

---

### Dashboard

Tela inicial após o login.

Funcionalidades:

- exibição de resumo das atividades diárias;
- contagem de atendimentos cadastrados para o dia atual;
- listagem dos atendimentos do dia;
- visualização dos detalhes de cada atendimento;
- atualização automática ao retornar para a tela;
- abertura do menu lateral global.

Os dados exibidos no Dashboard são carregados a partir dos registros clínicos salvos localmente no `AsyncStorage`.

---

### Registro Clínico

Tela responsável pelo cadastro de atendimentos clínicos.

Funcionalidades:

- busca de tutor por CPF;
- cadastro/vinculação de novo tutor quando não encontrado;
- cadastro de dados do animal;
- seleção de espécie;
- preenchimento de raça, idade e peso;
- seleção de nível de urgência;
- cadastro de data de retorno;
- preenchimento de observações clínicas;
- salvamento do registro no `AsyncStorage`.

Os registros salvos nesta tela alimentam o Dashboard e o Histórico Clínico.

---

### Histórico Clínico

Tela para consulta dos últimos atendimentos anteriores ao dia atual.

Funcionalidades:

- exibição das últimas consultas realizadas;
- filtro por CPF do tutor;
- filtro por data da consulta;
- aviso quando tutor não é encontrado;
- aviso quando não há consultas para a data pesquisada;
- separação entre atendimentos do dia atual e histórico anterior.

Observação: os atendimentos do dia atual aparecem no Dashboard. O Histórico exibe apenas consultas anteriores.

---

### Perfil

Tela de dados do profissional logado.

Funcionalidades:

- visualização dos dados do profissional;
- edição de nome, documento, e-mail, telefone, clínica e especialidade;
- alteração entre CPF e CRMV;
- salvamento dos dados no `AsyncStorage`;
- restauração do perfil padrão.

---

### Configurações

Tela de preferências e gerenciamento local.

Funcionalidades:

- alternância de tema claro/escuro global;
- controle visual de notificações em modo demonstrativo;
- controle visual de modo demonstrativo;
- visualização da quantidade de registros clínicos salvos;
- atualização do resumo local;
- limpeza dos registros clínicos;
- restauração do perfil;
- limpeza de todos os dados locais.

---

## Estrutura de Pastas

A estrutura principal do projeto segue a organização abaixo:

```text
AnimedApp/
├── App.tsx
├── index.tsx
├── package.json
├── tsconfig.json
├── assets/
│   └── Animed_Logo.png
└── src/
    ├── model/
    │   ├── Animal.ts
    │   ├── RegistroClinico.ts
    │   ├── Tutor.ts
    │   └── Usuario.ts
    └── screen/
        ├── LoginScreen.tsx
        ├── CadastroScreen.tsx
        ├── RecuperarSenhaScreen.tsx
        ├── DashboardScreen.tsx
        ├── RegistroClinicoScreen.tsx
        ├── HistoricoClinicoScreen.tsx
        ├── PerfilScreen.tsx
        └── ConfiguracoesScreen.tsx


---

## Armazenamento Local

O app utiliza as seguintes chaves no `AsyncStorage`:

```text
@animed:registrosClinicos
@animed:perfilUsuario
@animed:configuracoesApp
```

### Registros Clínicos

Cada registro clínico contém informações como:

- id;
- CPF do tutor;
- nome do tutor;
- telefone do tutor;
- nome do animal;
- espécie;
- raça;
- idade;
- peso;
- urgência;
- data de retorno;
- observações clínicas;
- data de criação.

---

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Acessar a pasta do projeto

```bash
cd Animed-Sprint1-Mobile/AnimedApp
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Instalar dependências Expo, caso necessário

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @expo/vector-icons
npx expo install react-native-screens react-native-safe-area-context
```

### 5. Executar o projeto

```bash
npx expo start
```

### 6. Abrir no Android

Com o emulador Android aberto, pressione:

```text
a
```

Ou execute diretamente:

```bash
npx expo start --android
```

---

## Fluxo de Teste Sugerido

### Login

1. Abrir o aplicativo.
2. Selecionar CPF.
3. Digitar um CPF no formato:

```text
123.456.789-95
```

4. Digitar uma senha qualquer.
5. Pressionar o botão de entrada.

### Registro Clínico

1. Acessar a aba `Registro`.
2. Digitar o CPF de tutor mockado:

```text
123.456.789-95
```

3. Pressionar o botão de busca.
4. Preencher os dados do animal.
5. Selecionar nível de urgência.
6. Informar uma data de retorno.
7. Informar observações clínicas.
8. Salvar o registro.

### Dashboard

1. Cadastrar um registro com a data de retorno igual à data atual.
2. Voltar para a tela `Início`.
3. Verificar se o atendimento aparece no Dashboard.

### Histórico

1. Cadastrar um registro com data anterior à data atual.
2. Acessar a tela `Histórico`.
3. Verificar se o atendimento aparece na lista.
4. Testar busca por CPF.
5. Testar busca por data.

### Perfil

1. Acessar a aba `Perfil`.
2. Ativar modo de edição.
3. Alterar dados do profissional.
4. Salvar.
5. Fechar e reabrir a tela para validar a persistência local.

### Configurações

1. Acessar a tela `Configurações` pelo menu lateral.
2. Alternar tema claro/escuro.
3. Atualizar resumo local.
4. Testar limpeza dos registros clínicos.
5. Testar restauração do perfil.

---

## Observações Importantes

Este projeto foi desenvolvido para fins acadêmicos e funciona em modo demonstrativo.

Nesta versão:

- não há autenticação real com servidor;
- não há banco de dados remoto;
- não há envio real de e-mail;
- não há API externa integrada;
- os dados são salvos localmente com `AsyncStorage`;
- o foco é demonstrar os conceitos de React Native trabalhados na disciplina.

---

## Limitações Conhecidas

- A validação de CPF considera apenas o tamanho e a formatação, não o cálculo dos dígitos verificadores.
- O CRMV é validado de forma simplificada.
- O envio de redefinição de senha é apenas demonstrativo.
- A tela de login não consulta uma base real de usuários.
- Os tutores iniciais da tela de registro são mockados.
- O modo de notificações é visual/demonstrativo.
- O armazenamento local pode ser apagado pelo usuário nas configurações.

---

## Possíveis Evoluções Futuras

As próximas versões podem incluir:

- integração com API;
- persistência em banco de dados;
- autenticação real;
- cadastro persistente de tutores;
- cadastro persistente de animais;
- agenda com horários reais;
- lembretes de vacinação, retorno e medicação;
- notificações locais;
- relatórios clínicos;
- indicadores para clínicas veterinárias.

Essas evoluções não fazem parte da versão atual do app mobile, mas representam possibilidades de continuidade do projeto.

---

## Comandos Úteis

### Rodar o projeto

```bash
npx expo start
```

### Rodar limpando cache

```bash
npx expo start --clear
```

### Verificar arquivos modificados

```bash
git status
```

### Adicionar alterações

```bash
git add .
```

### Criar commit

```bash
git commit -m "docs: add mobile project readme"
```

### Enviar para o repositório

```bash
git push origin develop
```

---

## Comandos Úteis

### Rodar o projeto

```bash
npx expo start
```

### Rodar limpando cache

```bash
npx expo start --clear
```

### Verificar arquivos modificados

```bash
git status
```

### Adicionar alterações

```bash
git add .
```

### Criar commit

```bash
git commit -m "docs: add mobile project readme"
```

### Enviar para o repositório

```bash
git push origin develop
```