const routes = {
  home: '/pages/home',
  about: '/pages/about',
  contact: '/pages/contact',
  services: '/pages/services',
  blog: '/pages/blog',
  team: '/pages/team'
};

const titles = {
  home: 'Home Page',
  about: 'About',
  contact: 'Contact',
  services: 'Our Services',
  blog: 'Blog',
  team: 'Our Team'
};

const contentDiv = document.getElementById('content');
let currentPage = '';

function loadContent(page) {
  if (page === currentPage) return;
  const file = routes[page] || '/pages/home';
  fetch(file)
    .then(response => response.ok ? response.text() : Promise.reject())
    .then(html => {
      contentDiv.innerHTML = html;
      bindDynamicLinks();
      updateTitle(page);
      currentPage = page;
    })
    .catch(() => contentDiv.innerHTML = '<p>Error loading content.</p>');
}

function updateURL(page) {
  const newUrl = (page === 'home') ? '/' : `/?${page}`;
  if (window.location.pathname !== newUrl) {
    history.pushState({ page }, titles[page], newUrl);
  }
}

function updateTitle(page) {
  document.title = titles[page] || 'Page Not Found';
}

function handleRoute(route) {
  if (routes[route]) {
    loadContent(route);
    updateURL(route);
  } else {
    loadContent('home');
    updateURL('home');
  }
}

function bindDynamicLinks() {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      handleRoute(link.getAttribute('data-link'));
    });
  });

  document.querySelectorAll('span').forEach(el => {
    const route = el.textContent.match(/{(.+?)}/)?.[1];
    if (route) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => handleRoute(route));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new URLSearchParams(window.location.search).get('urlname') || 'home';
  handleRoute(page);
});

window.addEventListener('popstate', (event) => {
  const page = event.state?.page || 'home';
  loadContent(page);
  currentPage = page;
});