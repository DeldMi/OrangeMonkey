// Configuração3
const nameOfButton = 'Print';
const idButton = 'buttonPrint';
const classNameButton = 'print-button';
const cssPrint = 'https://raw.githubusercontent.com/DeldMi/DeldMi/refs/heads/main/print.css';
const cssButton = 'https://raw.githubusercontent.com/DeldMi/DeldMi/refs/heads/main/main.css';

(function() {
    'use strict';
  
    const link = document.createElement('link'); 
    link.rel = 'stylesheet';
    link.href = cssButton; 
    document.head.appendChild(link);

    // Função para abrir o artigo em uma nova janela e imprimir
    function printArticle() {
        const article = document.querySelector('article.article');
        if (article) {
            const printWindow = window.open('', '', 'width=800,height=600');
            const articleTitle = article.querySelector('h2') ? article.querySelector('h2').innerText : 'Article';
            
            const styles = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                    } catch (e) {
                        console.warn('Could not load CSS rules from sheet: ', sheet.href);
                        return '';
                    }
                })
                .join('');

            printWindow.document.write(`
                <html>
                <head>
                    <title>${articleTitle}</title>
                    <style>${styles}</style>
                    <link rel="stylesheet" href="${cssPrint}">
                </head>
                <body>
                    ${article.outerHTML}
                </body>
                	<script>
                    	window.onload = function() {
                          const link = document.createElement('link'); 
                          link.rel = 'stylesheet';
                          link.href = cssPrint; 
                          document.head.appendChild(link);
                        }
                    </script>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();
            printWindow.onload = function() {
                printWindow.print();
            };
        } else {
            console.warn('Article element not found.');
        }
    }

    // Função para criar o botão de impressão
    function createPrintButton() {
        if (document.getElementById(idButton)) {
            return; // Evita criar o botão mais de uma vez
        }

        const article = document.querySelector('article.article');
        if (article) {
            // Criação do botão
            const button = document.createElement('button');
            button.id = idButton;
            button.innerText = nameOfButton;
            button.className = classNameButton;

            // Estilo básico do botão
            button.style.position = 'fixed';
            button.style.bottom = '7rem';
            button.style.right = '7rem';
            button.style.zIndex = '1';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            // Adiciona o evento de clique para chamar a função de impressão
            button.addEventListener('click', printArticle);

            // Adiciona o botão ao corpo do documento
            document.body.appendChild(button);
        }
    }

    // Observa mudanças no DOM para garantir que o botão seja adicionado quando o artigo for carregado
    const observer = new MutationObserver((mutations) => {
        const article = document.querySelector('article.article');
        if (article && !document.getElementById(idButton)) {
            createPrintButton();
        }
    });

    // Inicia a observação do corpo do documento
    observer.observe(document.body, { childList: true, subtree: true });
})();
