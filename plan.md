# 📘 Criador de Documentação - Estilo Notion

Ferramenta de documentação interativa com blocos, arrastar e soltar, exportação em Markdown, HTML e JS. Sem uso de banco de dados (localStorage).

---

## 1. 🔧 Estrutura Inicial do Projeto

- [ ] Criar o projeto com Next.js
  - `npx create-next-app doc-builder`
- [ ] Adicionar suporte a SCSS
  - `npm install sass`
- [ ] Estruturar layout base com páginas e componentes
- [ ] Criar pasta de componentes (`/components`)
- [ ] Criar pasta de estilos (`/styles`)

---

## 2. 🧱 Blocos de Conteúdo

### Tipos de blocos:
- [ ] Texto
- [ ] Lista
- [ ] Código
- [ ] Imagem (opcional)

### Cada bloco deve:
- Ser um componente React isolado
- Ter capacidade de edição inline
- Ter suporte a estilização com SCSS
- Ser identificável por `id` único

---

## 3. 🧩 Sistema de Drag and Drop

- [ ] Escolher biblioteca:
  - `react-beautiful-dnd` (mais fácil e documentado)
- [ ] Implementar contexto de drag (`DragDropContext`)
- [ ] Criar lista de blocos com `Droppable`
- [ ] Torna cada bloco um `Draggable`
- [ ] Atualizar a ordem de blocos ao mover

---

## 4. 💾 Armazenamento Local (localStorage)

- [ ] Salvar os blocos e sua ordem em `localStorage`
- [ ] Recuperar os blocos ao abrir a página
- [ ] Utilizar `useEffect` para salvar automaticamente em cada alteração
- [ ] Opcional: botão "Salvar Manualmente"

---

## 5. 📤 Exportação de Documentação

### 5.1 Markdown
- [ ] Converter os blocos para sintaxe Markdown
- [ ] Criar botão de exportação `.md`
- [ ] Gerar Blob e baixar com FileSaver ou `a.download`

### 5.2 HTML Estático
- [ ] Criar template base em HTML
- [ ] Inserir os blocos dentro de uma estrutura HTML
- [ ] Baixar como `.html` com os estilos inline ou linkados

### 5.3 Arquivo JS Buildado
- [ ] Criar uma função que gera um componente React renderizável a partir dos blocos
- [ ] Exportar como `.js` que possa ser importado e usado diretamente em outro projeto

---

## 6. 🖼️ Interface do Usuário

- [ ] Layout fluido e responsivo com SCSS
- [ ] Sidebar com opções:
  - Adicionar bloco
  - Reordenar
  - Exportar
- [ ] Estilo limpo inspirado no Notion
- [ ] Indicação visual ao arrastar blocos

---

## 7. 🧪 Extras e Testes (Futuros)

- [ ] Suporte a atalhos de teclado
- [ ] Preview ao vivo do Markdown/HTML
- [ ] Suporte a temas claro/escuro
- [ ] Upload de imagens (salvas como base64)

---

## ✅ Considerações Finais

- Projeto sem backend: toda persistência local
- Modular: fácil de estender e adaptar
- Exportação permite levar o conteúdo para outras plataformas
- Ideal para uso pessoal, portfólios, ou como ferramenta leve de documentação offline

