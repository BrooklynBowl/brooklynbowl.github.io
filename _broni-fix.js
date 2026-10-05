/* BB-BRONI: подъём плавающей кнопки брони broni на мобильных (над нижней
   панелью), общий файл для всех 7 городов — подключается на каждой
   странице после скрипта виджета broni (widget.js). */
(function () {
    function moveBroniButton() {
        const host = document.getElementById('brn-host');
        if (!host || !host.shadowRoot) {
            setTimeout(moveBroniButton, 100);
            return;
        }
        const shadow = host.shadowRoot;
        if (shadow.getElementById('brn-mobile-position-fix')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'brn-mobile-position-fix';
        style.textContent = `
            @media screen and (max-width: 980px) {
                #brn-fab {
                    bottom: calc(
                        94px + env(safe-area-inset-bottom, 0px)
                    ) !important;
                }
            }
        `;
        shadow.appendChild(style);
    }
    moveBroniButton();
    window.addEventListener('load', moveBroniButton);
    setTimeout(moveBroniButton, 500);
    setTimeout(moveBroniButton, 1500);
    setTimeout(moveBroniButton, 3000);
})();
