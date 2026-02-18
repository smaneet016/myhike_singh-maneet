class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Footer: single source of truth -->
            <footer class="py-3 my-4 border-top text-center bg-light">
            <img src="/heart.gif" alt="Logo" width="40" class="mb-2">
            <p class="mb-0 text-muted">&copy; 2026 Maneet Singh BCIT COMP1800</p>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
