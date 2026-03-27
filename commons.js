const audio = document.getElementById("bg-music");
        const overlay = document.getElementById("welcome-overlay");
        const openBtn = document.getElementById("openBtn");
        const content = document.getElementById("main-content");
        const musicIcon = document.getElementById("music-icon");
        const musicControl = document.getElementById("music-control");
        let isPlaying = false;

        openBtn.addEventListener('click', function() {
            audio.play().then(() => {
                isPlaying = true;
                musicIcon.className = "fas fa-pause text-[#c5a059]";
                musicControl.classList.add("playing");
            }).catch(e => console.log("Audio falló", e));

            overlay.style.opacity = "0";
            overlay.style.transform = "scale(1.1)";
            
            setTimeout(() => {
                overlay.style.display = "none";
                content.style.display = "block";
                document.body.style.overflow = "auto";
                setTimeout(() => {
                    content.style.opacity = "1";
                    musicControl.style.display = "flex";
                    setTimeout(() => musicControl.style.opacity = "1", 50);
                }, 50);
            }, 800);
        });

        musicControl.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                musicIcon.className = "fas fa-play text-[#c5a059]";
                musicControl.classList.remove("playing");
            } else {
                audio.play();
                musicIcon.className = "fas fa-pause text-[#c5a059]";
                musicControl.classList.add("playing");
            }
            isPlaying = !isPlaying;
        });

        var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdoaxZpswrzf3jd5kVXBZmuY660NQxfxKBFHeie3VsKnmf_tDStK4QNsCMvO67Mc5f/exec";

        function saveToSheet() {
            var nameInput = document.getElementById('guestName');
            var guestsInput = document.getElementById('guestCount');
            var btn = document.getElementById('submit-btn');
            var status = document.getElementById('status-msg');

            var name = nameInput.value.trim();
            var guests = guestsInput.value.trim();

            if (!name || !guests) {
                status.innerText = "⚠️ Por favor completa los campos obligatorios.";
                status.className = "block bg-red-50 text-red-600 text-sm mt-6 font-bold p-4 rounded-xl";
                status.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerText = "GUARDANDO...";
            status.classList.add('hidden');

            var payload = JSON.stringify({ name: name, guests: guests });

            var xhr = new XMLHttpRequest();
            xhr.open("POST", SCRIPT_URL, true);
            xhr.setRequestHeader("Content-Type", "text/plain");

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    status.innerText = "✅ ¡Registrado! Abriendo WhatsApp...";
                    status.className = "block bg-green-50 text-green-600 text-sm mt-6 font-bold p-4 rounded-xl";
                    status.classList.remove('hidden');
                    
                    setTimeout(function() {
                        var message = '¡Hola Aylen! Confirmo mi asistencia.\n\nNombre: ' + name + '\nInvitados: ' + guests + '\n\n(Ya quedó anotado en la lista ✨)';
                        window.location.href = "https://wa.me/5492932502726?text=" + encodeURIComponent(message);
                    }, 1500);
                }
            };

            xhr.onerror = function() {
                window.location.href = "https://wa.me/5492932502726?text=" + encodeURIComponent("Hola! Intento confirmar pero hubo un error. Somos " + name + " (" + guests + " pers).");
            };

            xhr.send(payload);
        }

        const eventDate = new Date(2026, 9, 10, 21, 0, 0).getTime();
        setInterval(function() {
            const now = new Date().getTime();
            const distance = eventDate - now;
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById("days").innerText = d < 10 ? "0" + d : d;
            document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
            document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
            document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
        }, 1000);