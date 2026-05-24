import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const ESTADOS_BRASIL: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export default function RecuperarSenhaScreen(props: any): React.ReactElement {
    const [tipoAcesso, setTipoAcesso] = useState<string>('CPF');
    const [documento, setDocumento] = useState<string>('');
    const [ufCrmv, setUfCrmv] = useState<string>('SP');

    const [emailUsuario, setEmailUsuario] = useState<string>('');
    const [emailDominio, setEmailDominio] = useState<string>('');
    const [emailSufixo, setEmailSufixo] = useState<string>('.com');

    const [temaEscuro, setTemaEscuro] = useState<boolean>(true);
    const [modalEstadoVisivel, setModalEstadoVisivel] = useState<boolean>(false);
    const [modalSufixoVisivel, setModalSufixoVisivel] = useState<boolean>(false);

    const cores = temaEscuro
        ? {
            fundo: '#07111F',
            fundoCampo: '#171A22',
            fundoModal: '#111820',
            borda: '#23415A',
            texto: '#FFFFFF',
            textoSecundario: '#8A96A8',
            destaque: '#008B7A',
            destaqueBorda: '#00C2A8',
            link: '#00C2FF',
            overlay: 'rgba(0, 0, 0, 0.60)',
        }
        : {
            fundo: '#F2F6FA',
            fundoCampo: '#FFFFFF',
            fundoModal: '#FFFFFF',
            borda: '#B8C6D6',
            texto: '#102033',
            textoSecundario: '#6B7A8C',
            destaque: '#008B7A',
            destaqueBorda: '#00A693',
            link: '#0077CC',
            overlay: 'rgba(0, 0, 0, 0.35)',
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

    function alterarDocumento(valor: string): void {
        if (tipoAcesso === 'CPF') {
            const contemCaracterInvalido = /[^0-9.-]/.test(valor);

            if (contemCaracterInvalido) {
                Alert.alert(
                    'Atenção',
                    'Digite somente números no formato 000.000.000-00.'
                );
            }

            setDocumento(formatarCpf(valor));
        } else {
            const contemCaracterInvalido = /\D/.test(valor);

            if (contemCaracterInvalido) {
                Alert.alert('Atenção', 'Digite somente números no campo CRMV.');
            }

            setDocumento(valor.replace(/\D/g, '').slice(0, 10));
        }
    }

    function alterarEmailUsuario(valor: string): void {
        const possuiCaracterInvalido = /[^a-zA-Z0-9._-]/.test(valor);

        if (possuiCaracterInvalido) {
            Alert.alert(
                'Atenção',
                'Digite somente letras, números, ponto, hífen ou underline antes do @.'
            );
        }

        const textoLimpo = valor.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40);

        setEmailUsuario(textoLimpo);
    }

    function alterarEmailDominio(valor: string): void {
        const possuiCaracterInvalido = /[^a-zA-Z0-9-]/.test(valor);

        if (possuiCaracterInvalido) {
            Alert.alert(
                'Atenção',
                'Digite somente letras, números ou hífen no domínio do e-mail.'
            );
        }

        const textoLimpo = valor.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 30);

        setEmailDominio(textoLimpo);
    }

    function alterarTipoAcesso(tipo: string): void {
        setTipoAcesso(tipo);
        setDocumento('');
    }

    function selecionarEstado(uf: string): void {
        setUfCrmv(uf);
        setModalEstadoVisivel(false);
    }

    function selecionarSufixoEmail(sufixo: string): void {
        setEmailSufixo(sufixo);
        setModalSufixoVisivel(false);
    }

    function alternarTema(): void {
        setTemaEscuro(!temaEscuro);
    }

    function validarDados(): boolean {
        const documentoNumerico = documento.replace(/\D/g, '');

        if (emailUsuario.trim() === '') {
            Alert.alert('Atenção', 'Informe a primeira parte do e-mail.');
            return false;
        }

        if (emailUsuario.trim().length < 3) {
            Alert.alert(
                'Atenção',
                'O e-mail deve ter pelo menos 3 caracteres antes do @.'
            );
            return false;
        }

        if (emailDominio.trim() === '') {
            Alert.alert('Atenção', 'Informe o domínio do e-mail.');
            return false;
        }

        if (emailDominio.trim().length < 5) {
            Alert.alert(
                'Atenção',
                'O domínio do e-mail deve ter pelo menos 5 caracteres depois do @.'
            );
            return false;
        }

        if (documento.trim() === '') {
            Alert.alert('Atenção', 'Informe seu CPF ou CRMV.');
            return false;
        }

        if (tipoAcesso === 'CPF' && documentoNumerico.length !== 11) {
            Alert.alert('Atenção', 'Digite um CPF válido no formato 000.000.000-00.');
            return false;
        }

        if (tipoAcesso === 'CRMV' && documentoNumerico.length < 4) {
            Alert.alert('Atenção', 'Digite um número de CRMV válido.');
            return false;
        }

        return true;
    }

    function enviarRedefinicao(): void {
        if (validarDados() === false) {
            return;
        }

        const emailCompleto = emailUsuario + '@' + emailDominio + emailSufixo;

        Alert.alert(
            'Redefinição de senha',
            'Um e-mail de redefinição será enviado para ' + emailCompleto + '.',
            [
                {
                    text: 'OK',
                    onPress: () => props.onVoltarLogin(),
                },
            ]
        );
    }

    function voltarLogin(): void {
        props.onVoltarLogin();
    }

    return (
        <KeyboardAvoidingView
            style={[
                styles.keyboardContainer,
                { backgroundColor: cores.fundo },
            ]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={{ backgroundColor: cores.fundo }}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: cores.fundo },
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <TouchableHighlight
                    style={[
                        styles.botaoTema,
                        {
                            backgroundColor: temaEscuro ? '#0E1726' : '#EAF2F7',
                            borderColor: temaEscuro ? '#1E3A4F' : '#B8C6D6',
                        },
                    ]}
                    underlayColor={cores.destaque}
                    onPress={alternarTema}
                >
                    <Text
                        style={[
                            styles.iconeTema,
                            { color: temaEscuro ? '#00C2A8' : '#008B7A' },
                        ]}
                    >
                        {temaEscuro ? '☾' : '☀'}
                    </Text>
                </TouchableHighlight>

                <View style={styles.areaLogo}>
                    <Image
                        source={require('../../assets/Animed_Logo.png')}
                        style={styles.logo}
                    />

                    <Text style={[styles.nomeApp, { color: cores.texto }]}>
                        Recuperar Senha
                    </Text>

                    <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
                        Informe seus dados para receber o link de redefinição.
                    </Text>
                </View>

                <Text style={[styles.label, { color: cores.texto }]}>E-mail</Text>

                <View style={styles.linhaEmail}>
                    <TextInput
                        style={[
                            styles.inputEmailUsuario,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                                color: cores.texto,
                            },
                        ]}
                        placeholder="usuario"
                        placeholderTextColor={cores.textoSecundario}
                        value={emailUsuario}
                        onChangeText={alterarEmailUsuario}
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                    />

                    <Text style={[styles.arrobaEmail, { color: cores.texto }]}>@</Text>

                    <TextInput
                        style={[
                            styles.inputEmailDominio,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                                color: cores.texto,
                            },
                        ]}
                        placeholder="dominio"
                        placeholderTextColor={cores.textoSecundario}
                        value={emailDominio}
                        onChangeText={alterarEmailDominio}
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                    />

                    <TouchableHighlight
                        style={[
                            styles.botaoSufixoEmail,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                            },
                        ]}
                        underlayColor={cores.destaque}
                        onPress={() => setModalSufixoVisivel(true)}
                    >
                        <Text style={[styles.textoSufixoEmail, { color: cores.texto }]}>
                            {emailSufixo} ▼
                        </Text>
                    </TouchableHighlight>
                </View>

                <Text style={[styles.label, { color: cores.texto }]}>
                    Tipo de acesso
                </Text>

                <View style={styles.linhaTipos}>
                    <TouchableHighlight
                        style={[
                            styles.botaoTipo,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                            },
                            tipoAcesso === 'CPF'
                                ? {
                                    backgroundColor: cores.destaque,
                                    borderColor: cores.destaqueBorda,
                                }
                                : null,
                        ]}
                        underlayColor={cores.destaque}
                        onPress={() => alterarTipoAcesso('CPF')}
                    >
                        <Text
                            style={[
                                styles.textoBotaoTipo,
                                { color: tipoAcesso === 'CPF' ? '#FFFFFF' : cores.texto },
                            ]}
                        >
                            CPF
                        </Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[
                            styles.botaoTipo,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                            },
                            tipoAcesso === 'CRMV'
                                ? {
                                    backgroundColor: cores.destaque,
                                    borderColor: cores.destaqueBorda,
                                }
                                : null,
                        ]}
                        underlayColor={cores.destaque}
                        onPress={() => alterarTipoAcesso('CRMV')}
                    >
                        <Text
                            style={[
                                styles.textoBotaoTipo,
                                { color: tipoAcesso === 'CRMV' ? '#FFFFFF' : cores.texto },
                            ]}
                        >
                            CRMV
                        </Text>
                    </TouchableHighlight>
                </View>

                <Text style={[styles.label, { color: cores.texto }]}>
                    {tipoAcesso === 'CPF' ? 'CPF' : 'Número do CRMV'}
                </Text>

                {tipoAcesso === 'CPF' ? (
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: cores.fundoCampo,
                                borderColor: cores.borda,
                                color: cores.texto,
                            },
                        ]}
                        placeholder="000.000.000-00"
                        placeholderTextColor={cores.textoSecundario}
                        value={documento}
                        onChangeText={alterarDocumento}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={14}
                    />
                ) : (
                    <View style={styles.linhaCrmv}>
                        <TextInput
                            style={[
                                styles.inputCrmv,
                                {
                                    backgroundColor: cores.fundoCampo,
                                    borderColor: cores.borda,
                                    color: cores.texto,
                                },
                            ]}
                            placeholder="Digite seu CRMV"
                            placeholderTextColor={cores.textoSecundario}
                            value={documento}
                            onChangeText={alterarDocumento}
                            keyboardType="number-pad"
                            inputMode="numeric"
                            maxLength={10}
                        />

                        <TouchableHighlight
                            style={[
                                styles.botaoUf,
                                {
                                    backgroundColor: cores.fundoCampo,
                                    borderColor: cores.borda,
                                },
                            ]}
                            underlayColor={cores.destaque}
                            onPress={() => setModalEstadoVisivel(true)}
                        >
                            <Text style={[styles.textoUf, { color: cores.texto }]}>
                                {ufCrmv} ▼
                            </Text>
                        </TouchableHighlight>
                    </View>
                )}

                <TouchableHighlight
                    style={[styles.botaoPrincipal, { backgroundColor: cores.destaque }]}
                    underlayColor="#006F62"
                    onPress={enviarRedefinicao}
                >
                    <Text style={styles.textoBotaoPrincipal}>Enviar redefinição</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.botaoLink}
                    underlayColor="transparent"
                    onPress={voltarLogin}
                >
                    <Text style={[styles.textoLink, { color: cores.link }]}>
                        Voltar para login
                    </Text>
                </TouchableHighlight>

                <Modal
                    visible={modalSufixoVisivel}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalSufixoVisivel(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalSufixoVisivel(false)}>
                        <View
                            style={[styles.modalOverlay, { backgroundColor: cores.overlay }]}
                        >
                            <View
                                style={[
                                    styles.modalCardSufixo,
                                    {
                                        backgroundColor: cores.fundoModal,
                                        borderColor: cores.borda,
                                    },
                                ]}
                                onStartShouldSetResponder={() => true}
                            >
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitulo, { color: cores.texto }]}>
                                        Final do e-mail
                                    </Text>

                                    <TouchableHighlight
                                        style={[
                                            styles.botaoFecharX,
                                            {
                                                backgroundColor: cores.fundoCampo,
                                                borderColor: cores.borda,
                                            },
                                        ]}
                                        underlayColor={cores.destaque}
                                        onPress={() => setModalSufixoVisivel(false)}
                                    >
                                        <Text style={[styles.textoFecharX, { color: cores.texto }]}>
                                            ×
                                        </Text>
                                    </TouchableHighlight>
                                </View>

                                <TouchableHighlight
                                    style={[
                                        styles.itemModal,
                                        {
                                            backgroundColor:
                                                emailSufixo === '.com' ? cores.destaque : cores.fundoCampo,
                                            borderColor:
                                                emailSufixo === '.com' ? cores.destaqueBorda : cores.borda,
                                        },
                                    ]}
                                    underlayColor={cores.destaque}
                                    onPress={() => selecionarSufixoEmail('.com')}
                                >
                                    <Text
                                        style={[
                                            styles.textoItemModal,
                                            { color: emailSufixo === '.com' ? '#FFFFFF' : cores.texto },
                                        ]}
                                    >
                                        .com
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={[
                                        styles.itemModal,
                                        {
                                            backgroundColor:
                                                emailSufixo === '.com.br'
                                                    ? cores.destaque
                                                    : cores.fundoCampo,
                                            borderColor:
                                                emailSufixo === '.com.br'
                                                    ? cores.destaqueBorda
                                                    : cores.borda,
                                        },
                                    ]}
                                    underlayColor={cores.destaque}
                                    onPress={() => selecionarSufixoEmail('.com.br')}
                                >
                                    <Text
                                        style={[
                                            styles.textoItemModal,
                                            {
                                                color:
                                                    emailSufixo === '.com.br' ? '#FFFFFF' : cores.texto,
                                            },
                                        ]}
                                    >
                                        .com.br
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Modal
                    visible={modalEstadoVisivel}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalEstadoVisivel(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalEstadoVisivel(false)}>
                        <View
                            style={[styles.modalOverlay, { backgroundColor: cores.overlay }]}
                        >
                            <View
                                style={[
                                    styles.modalCardEstados,
                                    {
                                        backgroundColor: cores.fundoModal,
                                        borderColor: cores.borda,
                                    },
                                ]}
                                onStartShouldSetResponder={() => true}
                            >
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitulo, { color: cores.texto }]}>
                                        Selecione o Estado
                                    </Text>

                                    <TouchableHighlight
                                        style={[
                                            styles.botaoFecharX,
                                            {
                                                backgroundColor: cores.fundoCampo,
                                                borderColor: cores.borda,
                                            },
                                        ]}
                                        underlayColor={cores.destaque}
                                        onPress={() => setModalEstadoVisivel(false)}
                                    >
                                        <Text style={[styles.textoFecharX, { color: cores.texto }]}>
                                            ×
                                        </Text>
                                    </TouchableHighlight>
                                </View>

                                <ScrollView style={styles.listaEstados}>
                                    {ESTADOS_BRASIL.map((uf) => (
                                        <TouchableHighlight
                                            key={uf}
                                            style={[
                                                styles.itemModal,
                                                {
                                                    backgroundColor:
                                                        ufCrmv === uf ? cores.destaque : cores.fundoCampo,
                                                    borderColor:
                                                        ufCrmv === uf ? cores.destaqueBorda : cores.borda,
                                                },
                                            ]}
                                            underlayColor={cores.destaque}
                                            onPress={() => selecionarEstado(uf)}
                                        >
                                            <Text
                                                style={[
                                                    styles.textoItemModal,
                                                    { color: ufCrmv === uf ? '#FFFFFF' : cores.texto },
                                                ]}
                                            >
                                                {uf}
                                            </Text>
                                        </TouchableHighlight>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 110,
        paddingBottom: 160,
        justifyContent: 'flex-start',
    },
    botaoTema: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconeTema: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    areaLogo: {
        alignItems: 'center',
        marginBottom: 28,
        marginTop: 10,
    },
    logo: {
        width: 124,
        height: 92,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    nomeApp: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    label: {
        width: '100%',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 12,
    },
    linhaEmail: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputEmailUsuario: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingLeft: 12,
        paddingRight: 12,
    },
    arrobaEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 6,
        marginRight: 6,
    },
    inputEmailDominio: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingLeft: 12,
        paddingRight: 12,
    },
    botaoSufixoEmail: {
        width: 92,
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    textoSufixoEmail: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    linhaTipos: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    botaoTipo: {
        flex: 1,
        height: 46,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    textoBotaoTipo: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    input: {
        width: '100%',
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 8,
    },
    linhaCrmv: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputCrmv: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingLeft: 16,
        paddingRight: 16,
        marginRight: 8,
    },
    botaoUf: {
        width: 82,
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoUf: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    botaoPrincipal: {
        width: '100%',
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 22,
        marginBottom: 18,
    },
    textoBotaoPrincipal: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botaoLink: {
        padding: 8,
        alignSelf: 'center',
    },
    textoLink: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    modalCardSufixo: {
        width: '85%',
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    modalCardEstados: {
        width: '90%',
        maxHeight: '70%',
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    modalTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botaoFecharX: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoFecharX: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    listaEstados: {
        marginBottom: 12,
    },
    itemModal: {
        height: 46,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    textoItemModal: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});