// ==UserScript==
// @name         Hộp Tải Truyện từ banxia.cc
// @namespace    https://github.com/LuongVu2112
// @version      1.1
// @description  Tải toàn bộ truyện từ banxia.cc thành file .txt với giao diện đơn giản
// @author       LuongVu
// @match        https://www.banxia.cc/book/*
// @icon         https://www.banxia.cc/favicon.ico
// @license      MIT
// @homepage     https://github.com/LuongVu2112
// @supportURL   https://github.com/LuongVu2112/issues
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    function createUI() {
        const box = document.createElement('div');
        box.id = 'downloader-box';
        box.innerHTML = `
            <div style="position:fixed;top:100px;right:20px;z-index:9999;padding:15px;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.2);font-family:sans-serif;width:250px">
                <h4 style="margin-top:0;margin-bottom:10px;font-size:16px;color:#28a745">📘 Tải truyện</h4>
                <button id="startDownload" style="width:100%;padding:8px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer">Tải toàn bộ (.txt)</button>
                <p id="status" style="font-size:13px;color:#555;margin-top:10px">⏳ Sẵn sàng để tải</p>
            </div>
        `;
        document.body.appendChild(box);
    }

    async function downloadChapters() {
        const links = Array.from(document.querySelectorAll('.chapterlist a'))
            .map(a => ({ url: a.href, title: a.textContent.trim() }));

        if (links.length === 0) {
            document.getElementById('status').textContent = '❌ Không tìm thấy chương!';
            return;
        }

        let fullText = '';
        for (let i = 0; i < links.length; i++) {
            const { url, title } = links[i];
            document.getElementById('status').textContent = `📖 Đang tải: ${i + 1}/${links.length} - ${title}`;

            try {
                const res = await fetch(url);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const contentNode = doc.querySelector('.content') || doc.querySelector('#htmlContent') || doc.querySelector('.read-content');
                const content = contentNode ? contentNode.innerText.trim().replace(/\n{2,}/g, '\n') : '[Không lấy được nội dung]';

                fullText += `\n\n${title}\n\n${content}`;
            } catch (err) {
                fullText += `\n\n${title}\n\n[Không thể tải chương này]`;
            }

            await sleep(500); // nghỉ để tránh bị chặn IP
        }

        const blob = new Blob([fullText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = document.title.replace(/\s*\|\s*.*$/, '') + '.txt';
        link.click();

        document.getElementById('status').textContent = '✅ Đã tải xong!';
    }

    // Gắn sự kiện sau khi trang tải xong
    window.addEventListener('load', () => {
        createUI();
        document.getElementById('startDownload').addEventListener('click', () => {
            document.getElementById('status').textContent = '🔄 Đang xử lý...';
            downloadChapters();
        });
    });
})();

Add initial script
