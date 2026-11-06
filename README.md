# Carona FATEC

Protótipo de site para mobilidade compartilhada entre alunos da Fatec Araçatuba.

## Visão geral

O projeto simula um fluxo de experiência de usuário para encontrar e solicitar caronas até a FATEC, com foco em:

- busca por bairro e horário
- visualização de opções disponíveis
- confirmação simulada da solicitação
- design responsivo para uso em celular

## Funcionalidades

- Busca de carona por origem
- Destino fixo: FATEC Araçatuba
- Seleção de data e horário aproximado
- Listagem de caronas disponíveis
- Solicitação de vaga com protocolo simulada
- Simulação de aceite do motorista
- Navegação entre etapas do fluxo

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- GitHub Pages

## Estrutura do projeto

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── .github/
│   └── workflows/
│       └── jekyll-gh-pages.yml
├── README.md
└── LICENSE (opcional)
```

## Como executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/AlineGuirotto2/meu-siteFatecCar.git
cd meu-siteFatecCar
```

2. Abra o arquivo `index.html` em um navegador, ou use um servidor local simples:

```bash
python -m http.server 8000
```

3. Acesse:

```text
http://localhost:8000
```

## Publicação no GitHub Pages

O repositório já está configurado com um workflow em `.github/workflows/jekyll-gh-pages.yml` para publicar a página por meio do GitHub Actions.

Importante:

- a branch ativa do projeto é `meu-siteFatecCarmain`
- o GitHub Pages deve estar configurado com a opção "GitHub Actions"
- o workflow dispara em push na branch principal do projeto

## Observação sobre o protótipo

Os dados exibidos no site são fictícios e simulados, com objetivo acadêmico e demonstrativo.

## Status

- layout responsivo: concluído
- fluxo de busca e confirmação: concluído
- deploy do GitHub Pages: configurado
- refinamento visual: finalizado

## Créditos

Projeto acadêmico de mobilidade urbana para a comunidade da Fatec Araçatuba.
