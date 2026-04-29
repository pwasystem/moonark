# 🌑 MoonArk | Memória do Projeto

Este documento serve como o repositório central de conhecimento sobre a evolução, arquitetura e decisões técnicas do projeto **MoonArk**.

---

## 🚀 Visão Geral
A MoonArk é uma plataforma de arquivamento de dados interestelar e IA cognitiva, projetada para preservar o conhecimento humano fora da Terra. O site foi desenvolvido com foco em estética premium, performance e resiliência.

---

## 🛠 Stack Tecnológica
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
- **Backend/Serviços**:
    - **Firebase Hosting**: Hospedagem global com URLs limpas.
    - **Firebase Auth**: Autenticação robusta (Google e E-mail/Senha).
    - **Firebase Firestore**: Armazenamento de dados em tempo real (Newsletter).
    - **Google Apps Script (GAS)**: Proxy de e-mail para formulário de contato.
    - **GitHub**: Controle de versão e repositório público.

---

## 🏛 Arquitetura e Estrutura de Arquivos

### Organização de Pastas
- `/public`: Diretório raiz do site (HTML e Ativos).
- `/docs`: Documentação técnica e memórias do projeto.

### Arquivos Principais (`/public`)
- `index.html`: Página inicial (Missão) e ponto de entrada.
- `tech.html`: Infraestrutura tecnológica e IA.
- `partner.html`: Ecossistema de parceiros.
- `invest.html`: Portal para investidores.

### Configurações e Backend
- `firebase.json`: Configurações de Hosting e Firestore.
- `firestore.rules`: Regras de segurança (Newsletter pública, demais protegidos).
- `Código.js`: Backend GAS para processamento de e-mails de contato.
- `appsscript.json`: Configuração de scopes e deployment do GAS.
- `.gitignore`: Proteção de segredos e arquivos temporários.

---

## ✅ Conquistas e Implementações

### 1. Design & UI
- **Widget de Contato**: Implementação de um botão flutuante premium com formulário integrado em todas as páginas.
- **Navegação Inteligente**: Links de "Contato" no rodapé agora acionam o widget em vez de redirecionar o usuário.
- **Limpeza Visual**: Remoção de links externos desnecessários (LinkedIn) para foco total na marca MoonArk.

### 2. Infraestrutura & Backend
- **Newsletter 2.0**: Migração do Google Groups para **Firebase Firestore**. Cadastros são instantâneos, invisíveis e seguros.
- **Envio de E-mail via GAS**: Lógica de contato que envia mensagens diretamente para o proprietário (`spiderpoison@gmail.com`) via proxy de script.
- **Segurança de Dados**: Configuração de regras do Firestore para permitir inscrições públicas na newsletter mantendo o restante do banco protegido.

### 3. DevOps & Publicação
- **Reestruturação**: Organização profissional dos arquivos em pastas separadas para site e documentos.
- **Git/GitHub**: Projeto versionado e publicado em [pwasystem/moonark](https://github.com/pwasystem/moonark).

---

## 🔗 Links Essenciais
- **Site Live**: [https://moonark-project.web.app](https://moonark-project.web.app)
- **Repositório GitHub**: [https://github.com/pwasystem/moonark](https://github.com/pwasystem/moonark)
- **Console Firebase**: [https://console.firebase.google.com/project/moonark-project/](https://console.firebase.google.com/project/moonark-project/)

---

## 📅 Histórico de Mudanças Recentes
- **2026-04-29**: Arquitetura do módulo de Autenticação Firebase v11 refatorada para Native ES Modules (Custo Zero, Alta Resiliência).
- **2026-04-29**: Criação da infraestrutura inicial protegida do Terminal (`terminal.html` e `terminal.js`).
- **2026-04-27**: Reestruturação total de pastas (`/public` e `/docs`).
- **2026-04-27**: Implementação do sistema de Newsletter via Firestore e Regras de Segurança.
- **2026-04-27**: Lançamento do Widget de Contato Flutuante integrado ao Google Apps Script.
- **2026-04-27**: Publicação do código-fonte no GitHub.

---

## 🔮 Próximos Passos Sugeridos
- [x] Implementar o painel real do "Terminal" após o login. *(Base inicial protegida implementada)*
- [ ] Configurar um domínio personalizado (`moonark.ai`).
- [ ] Adicionar internacionalização (Inglês/Português).
- [ ] Criar dashboard administrativo para visualizar inscritos da newsletter no Terminal.

---
*Última atualização: 29 de Abril de 2026 (Versão 2.1)*
