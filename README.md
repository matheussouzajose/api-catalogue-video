# Projeto NestJS com Elasticsearch e Testcontainers  

Este projeto utiliza o framework **NestJS**, integrando o **Elasticsearch** como motor de busca e utilizando o **Testcontainers** para testes.  

## 🛠️ Tecnologias Utilizadas  
- **NestJS**: Framework para construção de aplicações Node.js.  
- **Elasticsearch**: Solução de busca distribuída.  
- **Testcontainers**: Biblioteca para criar e gerenciar containers Docker em testes de integração.  

## 🚀 Funcionalidades  
- Integração com Elasticsearch para operações de operações básicas.  
- Testes de integração com Testcontainers para garantir confiabilidade.

## O que é Testcontainers?

O Testcontainers é uma biblioteca que utiliza containers Docker para executar testes de integração, garantindo que os testes sejam executados em um ambiente isolado e controlado. Ele é especialmente útil para testes com dependências externas, como bancos de dados e serviços, como o Elasticsearch.

Benefícios do Testcontainers:
- **Isolamento:** Cada teste roda em um ambiente isolado, evitando interferências externas.
- **Reprodutibilidade:** Os testes podem ser executados de maneira consistente em qualquer máquina ou pipeline CI/CD.
- **Automação:** Elimina a necessidade de configurar serviços manualmente

## Como Rodar os Testes

1. Subir o ambiente de teste
- Execute o seguinte comando para inicializar o ambiente de teste:
```bash
docker-compose -f docker-compose.test.yml up -d
```

2. Acessar o container da aplicação
- Entre no container da aplicação para executar os testes:
```bash
docker-compose -f docker-compose.test.yml exec -it api-catalogue-video bash
```

3. Executar os testes de integração
- Dentro do container, rode os testes com o comando:
```bash
yarn test infra
```

## **Observações:** Esse aqui é um repositório para estudos