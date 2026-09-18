# Portfólio de Rafael Antunes Vieira

Site estático (HTML/CSS/JS puro, sem build) com versão em PDF gerada a partir do próprio site.

## Estrutura

```
index.html        conteúdo em PT-BR (cada trecho traduzível tem data-i18n)
css/style.css     tema dark/light, layout responsivo e regras de impressão (@media print)
js/i18n.js        dicionário EN (a tradução PT é o próprio HTML)
js/main.js        toggle de tema, toggle PT/EN, menu mobile, scroll-spy, animações
assets/           foto, favicon, currículo e os PDFs do portfólio
build-pdf.ps1     gera assets/Portfolio-Rafael-Antunes-{PT,EN}.pdf com o Edge headless
```

## Rodar localmente

```powershell
python -m http.server 8765
```

Abra <http://localhost:8765>. Use `?lang=en` na URL para forçar o inglês.

## Atualizar o conteúdo

1. Edite o texto em PT no `index.html`.
2. Se o trecho tiver `data-i18n="chave"`, atualize a mesma chave em `js/i18n.js`.
3. Regere os PDFs:

```powershell
.\build-pdf.ps1
```

## Publicar no GitHub Pages

1. Crie um repositório chamado `rav98.github.io` (site ficará em `https://rav98.github.io`)
   ou qualquer outro nome (site ficará em `https://rav98.github.io/<nome>`).
2. Envie o conteúdo desta pasta para a branch `main`.
3. No GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
