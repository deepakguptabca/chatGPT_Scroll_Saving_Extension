let userMessages = [];
let sidebarCreated = false;
let timeout = null;

function createSidebar() {
    if (sidebarCreated) return;

    const sidebar = document.createElement("div");
    sidebar.id = "chatgpt-nav";
    document.body.appendChild(sidebar);

    sidebarCreated = true;
}

function collectMessages() {
    const messages = document.querySelectorAll('[data-message-author-role="user"]');

    userMessages = [];

    messages.forEach((msg, index) => {
        userMessages.push({
            id: index + 1,
            text: msg.innerText,
            element: msg
        });
    });

    renderSidebar();
}

function renderSidebar() {
    const sidebar = document.getElementById("chatgpt-nav");
    if (!sidebar) return;

    sidebar.innerHTML = "";

    userMessages.forEach(msg => {
        const btn = document.createElement("div");
        btn.className = "nav-item";
        btn.innerText = msg.id;

        // hover show tooltip
        btn.addEventListener("mouseenter", () => {
            showTooltip(btn, msg.text);
        });

        // hide tooltip
        btn.addEventListener("mouseleave", () => {
            hideTooltip();
        });

        // click scroll
        btn.onclick = () => {
            msg.element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        };

        sidebar.appendChild(btn);
    });
}

/* Tooltip functions */

function showTooltip(element, text) {
    let tooltip = document.getElementById("chatgpt-tooltip");

    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "chatgpt-tooltip";
        document.body.appendChild(tooltip);
    }

    tooltip.innerText = text;

    const rect = element.getBoundingClientRect();

    tooltip.style.top = rect.top + "px";
    tooltip.style.left = (rect.left - 340) + "px";

    tooltip.style.display = "block";
}

function hideTooltip() {
    const tooltip = document.getElementById("chatgpt-tooltip");
    if (tooltip) {
        tooltip.style.display = "none";
    }
}

createSidebar();
collectMessages();

const observer = new MutationObserver(() => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        collectMessages();
    }, 800); // slightly faster
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});