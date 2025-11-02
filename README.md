# FateQuiz

Este é um projeto Next.js que utiliza a API Gemini para gerar quizzes sobre qualquer tópico.

## 🚀 Começando

Para rodar este projeto localmente, siga os passos abaixo:

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### 2. Instalação

Primeiro, clone o repositório para sua máquina local:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_SEU_PROJETO>
```

Em seguida, instale as dependências do projeto:

```bash
npm install
```

### 3. Configuração do Ambiente

O projeto precisa de uma chave de API do Google Gemini para funcionar.

1.  Crie uma cópia do arquivo `.env.example` e renomeie para `.env`:

    ```bash
    cp .env.example .env
    ```

2.  Abra o arquivo `.env` que você acabou de criar.

3.  Obtenha sua própria chave de API gratuita no [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  Cole a chave no arquivo `.env`:

    ```
    GEMINI_API_KEY="SUA_CHAVE_DE_API_AQUI"
    ```

### 4. Rodando o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:9002](http://localhost:9002) no seu navegador para ver o aplicativo em ação!
