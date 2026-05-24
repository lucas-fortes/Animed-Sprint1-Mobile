import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import { RegistroClinico } from '../model/RegistroClinico';

type Tutor = {
  cpf: string;
  nome: string;
  telefone: string;
};

const CHAVE_REGISTROS = '@animed:registrosClinicos';

const TUTORES: Tutor[] = [
  {
    cpf: '123.456.789-95',
    nome: 'Ana Silva',
    telefone: '(11) 99999-1000',
  },
  {
    cpf: '987.654.321-00',
    nome: 'Carlos Mendes',
    telefone: '(11) 99999-2000',
  },
  {
    cpf: '456.789.123-88',
    nome: 'Mariana Costa',
    telefone: '(11) 99999-3000',
  },
];

export default function RegistroClinicoScreen(): React.ReactElement {
  const [cpfTutor, setCpfTutor] = useState<string>('');
  const [tutorSelecionado, setTutorSelecionado] = useState<Tutor | null>(null);

  const [nomeAnimal, setNomeAnimal] = useState<string>('');
  const [especie, setEspecie] = useState<string>('Canina');
  const [raca, setRaca] = useState<string>('');
  const [idade, setIdade] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [urgencia, setUrgencia] = useState<string>('Baixa');
  const [dataRetorno, setDataRetorno] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  const cores = {
    fundo: '#07111F',
    card: '#172232',
    campo: '#171A22',
    borda: '#23415A',
    texto: '#FFFFFF',
    textoSecundario: '#8A96A8',
    destaque: '#008B7A',
    destaqueClaro: '#00C2A8',
    perigo: '#D62828',
    alerta: '#D99000',
  };

  function formatarCpf(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 3) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return numeros.slice(0, 3) + '.' + numeros.slice(3);
    }

    if (numeros.length <= 9) {
      return (
        numeros.slice(0, 3) +
        '.' +
        numeros.slice(3, 6) +
        '.' +
        numeros.slice(6)
      );
    }

    return (
      numeros.slice(0, 3) +
      '.' +
      numeros.slice(3, 6) +
      '.' +
      numeros.slice(6, 9) +
      '-' +
      numeros.slice(9, 11)
    );
  }

  function alterarCpfTutor(valor: string): void {
    const contemCaracterInvalido = /[^0-9.-]/.test(valor);

    if (contemCaracterInvalido) {
      Alert.alert(
        'Atenção',
        'Digite somente números no formato 000.000.000-00.'
      );
    }

    setCpfTutor(formatarCpf(valor));
    setTutorSelecionado(null);
  }

  function buscarTutor(): void {
    const cpfNumerico = cpfTutor.replace(/\D/g, '');

    if (cpfNumerico.length !== 11) {
      Alert.alert('Atenção', 'Digite um CPF válido para pesquisar o tutor.');
      return;
    }

    const tutorEncontrado = TUTORES.find(
      (tutor) => tutor.cpf.replace(/\D/g, '') === cpfNumerico
    );

    if (tutorEncontrado === undefined) {
      Alert.alert(
        'Tutor não encontrado',
        'Nenhum tutor foi encontrado com o CPF informado.'
      );
      setTutorSelecionado(null);
      return;
    }

    setTutorSelecionado(tutorEncontrado);

    Alert.alert(
      'Tutor encontrado',
      tutorEncontrado.nome + ' foi vinculado ao registro clínico.'
    );
  }

  function alterarIdade(valor: string): void {
    const contemCaracterInvalido = /\D/.test(valor);

    if (contemCaracterInvalido) {
      Alert.alert('Atenção', 'Digite somente números no campo idade.');
    }

    setIdade(valor.replace(/\D/g, '').slice(0, 3));
  }

  function alterarPeso(valor: string): void {
    const textoLimpo = valor.replace(',', '.');
    const contemCaracterInvalido = /[^0-9.]/.test(textoLimpo);

    if (contemCaracterInvalido) {
      Alert.alert('Atenção', 'Digite somente números no campo peso.');
    }

    setPeso(textoLimpo.replace(/[^0-9.]/g, '').slice(0, 6));
  }

  function alterarDataRetorno(valor: string): void {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);

    if (numeros.length <= 2) {
      setDataRetorno(numeros);
      return;
    }

    if (numeros.length <= 4) {
      setDataRetorno(numeros.slice(0, 2) + '/' + numeros.slice(2));
      return;
    }

    setDataRetorno(
      numeros.slice(0, 2) +
        '/' +
        numeros.slice(2, 4) +
        '/' +
        numeros.slice(4, 8)
    );
  }

  function validarRegistro(): boolean {
    if (tutorSelecionado === null) {
      Alert.alert('Atenção', 'Pesquise e vincule um tutor antes de salvar.');
      return false;
    }

    if (nomeAnimal.trim() === '') {
      Alert.alert('Atenção', 'Informe o nome do animal.');
      return false;
    }

    if (especie.trim() === '') {
      Alert.alert('Atenção', 'Informe a espécie do animal.');
      return false;
    }

    if (idade.trim() === '') {
      Alert.alert('Atenção', 'Informe a idade do animal.');
      return false;
    }

    if (peso.trim() === '') {
      Alert.alert('Atenção', 'Informe o peso do animal.');
      return false;
    }

    if (dataRetorno.trim() === '') {
      Alert.alert('Atenção', 'Informe a data de retorno.');
      return false;
    }

    if (dataRetorno.length !== 10) {
      Alert.alert('Atenção', 'Digite a data no formato dd/mm/aaaa.');
      return false;
    }

    if (observacoes.trim() === '') {
      Alert.alert('Atenção', 'Informe as observações clínicas.');
      return false;
    }

    return true;
  }

  async function salvarRegistro(): Promise<void> {
    if (validarRegistro() === false) {
      return;
    }

    try {
      const novoRegistro: RegistroClinico = {
        id: new Date().getTime(),
        cpfTutor: cpfTutor,
        nomeTutor: tutorSelecionado?.nome || '',
        telefoneTutor: tutorSelecionado?.telefone || '',
        nomeAnimal: nomeAnimal,
        especie: especie,
        raca: raca,
        idade: idade,
        peso: peso,
        urgencia: urgencia,
        dataRetorno: dataRetorno,
        observacoes: observacoes,
        criadoEm: new Date().toISOString(),
      };

      const dadosSalvos = await AsyncStorage.getItem(CHAVE_REGISTROS);

      let registros: RegistroClinico[] = [];

      if (dadosSalvos !== null) {
        registros = JSON.parse(dadosSalvos);
      }

      registros.push(novoRegistro);

      await AsyncStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registros));

      Alert.alert(
        'Registro Clínico',
        'Registro salvo com sucesso.\n\nAnimal: ' +
          nomeAnimal +
          '\nTutor: ' +
          tutorSelecionado?.nome +
          '\nUrgência: ' +
          urgencia +
          '\nRetorno: ' +
          dataRetorno
      );

      limparFormulario();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar o registro clínico no dispositivo.'
      );
    }
  }

  function limparFormulario(): void {
    setCpfTutor('');
    setTutorSelecionado(null);
    setNomeAnimal('');
    setEspecie('Canina');
    setRaca('');
    setIdade('');
    setPeso('');
    setUrgencia('Baixa');
    setDataRetorno('');
    setObservacoes('');
  }

  function corUrgencia(valor: string): string {
    if (valor === 'Alta') {
      return cores.perigo;
    }

    if (valor === 'Média') {
      return cores.alerta;
    }

    if (valor === 'Emergência') {
      return '#8B0000';
    }

    return cores.destaque;
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.titulo, { color: cores.texto }]}>
        Registro Clínico
      </Text>

      <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
        Cadastre o atendimento e vincule o tutor ao paciente.
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Dados do Tutor
        </Text>

        <Text style={[styles.label, { color: cores.texto }]}>
          CPF do tutor
        </Text>

        <View style={styles.linhaBusca}>
          <TextInput
            style={[
              styles.inputBusca,
              {
                backgroundColor: cores.campo,
                borderColor: cores.borda,
                color: cores.texto,
              },
            ]}
            placeholder="000.000.000-00"
            placeholderTextColor={cores.textoSecundario}
            value={cpfTutor}
            onChangeText={alterarCpfTutor}
            keyboardType="default"
            maxLength={14}
          />

          <TouchableHighlight
            style={[
              styles.botaoBuscar,
              { backgroundColor: cores.destaque },
            ]}
            underlayColor="#006F62"
            onPress={buscarTutor}
          >
            <Text style={styles.textoBotaoBuscar}>🔎</Text>
          </TouchableHighlight>
        </View>

        {tutorSelecionado !== null ? (
          <View
            style={[
              styles.cardTutor,
              {
                backgroundColor: cores.campo,
                borderColor: cores.destaqueClaro,
              },
            ]}
          >
            <Text style={[styles.nomeTutor, { color: cores.texto }]}>
              {tutorSelecionado.nome}
            </Text>

            <Text style={[styles.infoTutor, { color: cores.textoSecundario }]}>
              CPF: {tutorSelecionado.cpf}
            </Text>

            <Text style={[styles.infoTutor, { color: cores.textoSecundario }]}>
              Telefone: {tutorSelecionado.telefone}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Dados do Animal
        </Text>

        <Text style={[styles.label, { color: cores.texto }]}>
          Nome do animal
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Ex: Rex"
          placeholderTextColor={cores.textoSecundario}
          value={nomeAnimal}
          onChangeText={setNomeAnimal}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Espécie
        </Text>

        <View style={styles.linhaOpcoes}>
          <TouchableHighlight
            style={[
              styles.botaoOpcao,
              {
                backgroundColor:
                  especie === 'Canina' ? cores.destaque : cores.campo,
                borderColor:
                  especie === 'Canina' ? cores.destaqueClaro : cores.borda,
              },
            ]}
            underlayColor={cores.destaque}
            onPress={() => setEspecie('Canina')}
          >
            <Text style={[styles.textoOpcao, { color: cores.texto }]}>
              Canina
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[
              styles.botaoOpcao,
              {
                backgroundColor:
                  especie === 'Felina' ? cores.destaque : cores.campo,
                borderColor:
                  especie === 'Felina' ? cores.destaqueClaro : cores.borda,
              },
            ]}
            underlayColor={cores.destaque}
            onPress={() => setEspecie('Felina')}
          >
            <Text style={[styles.textoOpcao, { color: cores.texto }]}>
              Felina
            </Text>
          </TouchableHighlight>
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>Raça</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Opcional"
          placeholderTextColor={cores.textoSecundario}
          value={raca}
          onChangeText={setRaca}
        />

        <View style={styles.linhaDoisCampos}>
          <View style={styles.campoMetade}>
            <Text style={[styles.label, { color: cores.texto }]}>
              Idade
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cores.campo,
                  borderColor: cores.borda,
                  color: cores.texto,
                },
              ]}
              placeholder="0"
              placeholderTextColor={cores.textoSecundario}
              value={idade}
              onChangeText={alterarIdade}
              keyboardType="default"
              maxLength={3}
            />
          </View>

          <View style={styles.campoMetade}>
            <Text style={[styles.label, { color: cores.texto }]}>
              Peso kg
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cores.campo,
                  borderColor: cores.borda,
                  color: cores.texto,
                },
              ]}
              placeholder="0.0"
              placeholderTextColor={cores.textoSecundario}
              value={peso}
              onChangeText={alterarPeso}
              keyboardType="default"
              maxLength={6}
            />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Informações Clínicas
        </Text>

        <Text style={[styles.label, { color: cores.texto }]}>
          Nível de urgência
        </Text>

        <View style={styles.gridUrgencia}>
          {['Baixa', 'Média', 'Alta', 'Emergência'].map((item) => (
            <TouchableHighlight
              key={item}
              style={[
                styles.botaoUrgencia,
                {
                  backgroundColor:
                    urgencia === item ? corUrgencia(item) : cores.campo,
                  borderColor:
                    urgencia === item ? corUrgencia(item) : cores.borda,
                },
              ]}
              underlayColor={corUrgencia(item)}
              onPress={() => setUrgencia(item)}
            >
              <Text style={styles.textoUrgencia}>{item}</Text>
            </TouchableHighlight>
          ))}
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>
          Data do retorno
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="dd/mm/aaaa"
          placeholderTextColor={cores.textoSecundario}
          value={dataRetorno}
          onChangeText={alterarDataRetorno}
          keyboardType="default"
          maxLength={10}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Observações clínicas
        </Text>

        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Descreva sintomas, diagnóstico, tratamento etc."
          placeholderTextColor={cores.textoSecundario}
          value={observacoes}
          onChangeText={setObservacoes}
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      <TouchableHighlight
        style={[styles.botaoSalvar, { backgroundColor: cores.destaque }]}
        underlayColor="#006F62"
        onPress={salvarRegistro}
      >
        <Text style={styles.textoBotaoSalvar}>Salvar Registro</Text>
      </TouchableHighlight>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 58,
    paddingBottom: 120,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 22,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  linhaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBusca: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 14,
    marginRight: 10,
  },
  botaoBuscar: {
    width: 54,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoBuscar: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTutor: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  nomeTutor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoTutor: {
    fontSize: 13,
    marginTop: 2,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 8,
  },
  linhaOpcoes: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  botaoOpcao: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textoOpcao: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  linhaDoisCampos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campoMetade: {
    width: '48%',
  },
  gridUrgencia: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  botaoUrgencia: {
    width: '48%',
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textoUrgencia: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
  },
  botaoSalvar: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});