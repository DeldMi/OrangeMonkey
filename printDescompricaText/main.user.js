// ==UserScript==
// @name         Imprimir texto da aula da Descomplica
// @namespace    http://andre.a3gs.com.br
// @homepage     http://andre.a3gs.com.br
// @version      1.13
// @date         2024-09-30
// @author       André Felipe
// @description  Add print button to open article in a new window with CSS for printing, using MutationObserver.
// @match        *://aulas.descomplica.com.br/*
// @icon         https://aulas.descomplica.com.br/graduacao/img/Logo_D.svg
// @homepageURL  https://raw.githubusercontent.com/DeldMi/OrangeMonkey/refs/heads/main/printDescompricaText/main.user.js
// @updateURL    https://raw.githubusercontent.com/DeldMi/OrangeMonkey/refs/heads/main/printDescompricaText/tampermonkey/print-article.meta.js
// @downloadURL  https://raw.githubusercontent.com/DeldMi/OrangeMonkey/refs/heads/main/printDescompricaText/tampermonkey/print-article.user.js
// @include     http://*
// @include     https://*
// @run-at      document-end
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_notification
// @grant       GM_evalFunction
// @grant       GM_download
// @grant       GM.info
// @grant       GM.listValues
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.openInTab
// @grant       GM.setClipboard
// @grant       GM.xmlHttpRequest
// @connect     aulas.descomplica.com.br
// @connect     descomplica.com.br
// ==/UserScript==

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
