# ROADMAP — Projeto Operatto

Este roadmap define **a ordem oficial de execução** do projeto Operatto, seguindo um fluxo profissional de engenharia de software. Ele foi pensado para garantir **estabilidade, segurança, clareza arquitetural e valor de portfólio**, evitando retrabalho.

> ⚠️ Regra principal: **não pular fases**. Cada etapa só avança quando a anterior estiver estável.

---

## 🔹 FASE 1 — Transição completa para TypeScript (ATUAL)

**Objetivo:** Backend previsível, tipado e com comportamento consistente em DEV e PROD.

### Tarefas

* [ ] Migrar **models** restantes de JS → TS (ordem por dependência)
* [ ] Garantir imports TS **sem extensões `.js`**
* [ ] Padronizar `export default` vs `named exports`
* [ ] Revisar `services` para remover dependências de JS legado
* [ ] Garantir que `npm run dev` funcione sem acessar `dist/`
* [ ] Garantir que `npm run build && npm run start` funcionem sempre
* [ ] Remover arquivos JS obsoletos **somente após validação**

### Critério de conclusão

* Projeto roda estável em **DEV** e **PROD**
* Nenhum erro de importação ou resolução de módulo
* Estrutura clara: `models → services → controllers → routes`

---

## 🔹 FASE 2 — Estrutura mínima para produção teste

**Objetivo:** Simular produção real de forma controlada.

### Tarefas

* [ ] Consolidar `index.ts` como entrypoint único
* [ ] Ajustar variáveis de ambiente (`.env.example`)
* [ ] Garantir logs mínimos de inicialização
* [ ] Validar build em ambiente limpo (`node_modules` + `dist` apagados)
* [ ] Revisar scripts do `package.json`

### Critério de conclusão

* Projeto sobe do zero com:

  ```bash
  npm install
  npm run build
  npm run start
  ```

---

## 🔹 FASE 3 — Produção teste + testes de serviço (inclui VM)

**Objetivo:** Garantir confiança funcional e operacional.

### Tarefas

* [ ] Subir o backend em uma VM Linux
* [ ] Testar rotas críticas em ambiente remoto
* [ ] Validar comportamento com banco ativo/inativo
* [ ] Revisar performance básica
* [ ] Executar testes de serviço e integração

### Critério de conclusão

* Backend responde corretamente fora do ambiente local
* Nenhuma dependência implícita de ambiente local

---

## 🔹 FASE 4 — Finalização completa do backend

**Objetivo:** Backend fechado, consistente e defendável tecnicamente.

### Tarefas

* [ ] Revisar regras de negócio em `services`
* [ ] Garantir tratamento consistente de erros
* [ ] Revisar códigos HTTP e mensagens
* [ ] Ajustar e validar Swagger
* [ ] Garantir que não existem rotas incompletas

### Critério de conclusão

* Backend pronto para consumo por frontend
* Código claro para revisão técnica

---

## 🔹 FASE 5 — Planejamento do frontend

**Objetivo:** Construir frontend sem retrabalho.

### Tarefas

* [ ] Congelar contrato da API
* [ ] Mapear telas a partir das rotas existentes
* [ ] Definir stack de frontend
* [ ] Planejar estrutura de pastas e estados

### Critério de conclusão

* Planejamento completo antes de codar frontend

---

## 🔹 FASE 6 — Incrementos de cibersegurança no backend

**Objetivo:** Garantir funcionamento seguro e confiável.

### Tarefas

* [ ] Validação rigorosa de entrada
* [ ] Fortalecer tratamento de erros
* [ ] Evitar vazamento de informações sensíveis
* [ ] Preparar base para autenticação/autorização
* [ ] Revisão básica de threat model

### Critério de conclusão

* Backend preparado para uso real com riscos mitigados

---

## 🔹 FASE 7 — Portfólio (GitHub, LinkedIn, apresentação)

**Objetivo:** Transformar o Operatto em vitrine profissional.

### Tarefas

* [ ] Organizar commits e branches
* [ ] Criar README técnico e claro
* [ ] Documentar decisões arquiteturais
* [ ] Preparar narrativa para LinkedIn
* [ ] Destacar aprendizados e desafios reais

### Critério de conclusão

* Projeto apresentável para recrutadores e técnicos
* Clareza de valor e maturidade técnica

---

## 📌 Observação final

Este roadmap é **intencionalmente incremental**.
Qualquer refatoração grande deve respeitar a fase atual para evitar retrabalho.

> Quando retomarmos o projeto, basta conferir este arquivo e continuar a partir da fase atual.
