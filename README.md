# Brooklyn Barbearia — Site

Site institucional desenvolvido como Projeto Integrador Extensionista — UNIVALI 2026.

## Estrutura de arquivos

```
brooklyn-barbearia/
├── index.html          ← página principal (edite aqui o conteúdo)
├── css/
│   └── style.css       ← estilos (não precisa mexer)
├── js/
│   └── main.js         ← comportamentos (não precisa mexer)
└── images/             ← coloque as fotos aqui
    └── (suas fotos aqui)
```

## Como adicionar as fotos

1. Salve suas fotos na pasta `images/` com nomes simples, sem espaços.
   Exemplo: `foto1.jpg`, `foto2.jpg`, `henri.jpg`, `espaco.jpg`

2. Abra o `index.html` em um editor de texto (ex: VS Code, Bloco de Notas).

3. Procure os trechos com o comentário `INSTRUÇÃO:` e substitua pelo código indicado.

### Galeria (3 fotos)
Substitua cada bloco de `<div class="gallery-item">` com placeholder por:
```html
<div class="gallery-item">
  <img src="images/foto1.jpg" alt="Trabalho realizado na Brooklyn Barbearia" loading="lazy" />
</div>
```

### Foto da seção Sobre
Substitua o `<div class="about-photo-placeholder">` por:
```html
<img src="images/henri.jpg" alt="Henri Ribeiro Garcia, fundador da Brooklyn Barbearia" />
```

### Logo na navbar
Descomente a linha do `<img>` na navbar e apague a linha do `<div class="barber-pole">` logo abaixo.
```html
<img src="images/logo.png" alt="Brooklyn Barbearia" class="nav-logo" />
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (pode ser público ou privado).
2. Faça upload de todos os arquivos deste projeto para o repositório.
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione `main branch` e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará disponível em:
   `https://seuusuario.github.io/nome-do-repositorio/`

## Para atualizar conteúdo no futuro

Basta editar o arquivo `index.html` diretamente no GitHub (clique no arquivo, depois no lápis ✏️).
Não precisa saber programar para trocar textos, preços ou links.

---
Desenvolvido por: Guilherme, Júlio, Mayra e João — UNIVALI 2026
