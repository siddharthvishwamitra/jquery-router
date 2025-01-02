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
  about: 'About Us',
  contact: 'Contact Us',
  services: 'Our Services',
  blog: 'Blog',
  team: 'Our Team'
};

const contentDiv = document.getElementById('content');
let currentPage = '';
let historyStack = []; // Track history stack for back navigation

function loadContent(page) {
  if (page === currentPage) return;
  const file = `${routes[page]}`;
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Content not found');
      return response.text();
    })
    .then(html => {
      contentDiv.innerHTML = html;
      bindDynamicLinks(); // Bind dynamic links after content is loaded
      updateTitle(page);
      currentPage = page;
    })
    .catch(() => contentDiv.innerHTML = '<p>Error loading content.</p>');
}

function updateURL(page) {
  // Push the page to history stack for back navigation
  if (page === 'home') {
    history.pushState({ page: page }, titles[page], '/');
  } else {
    history.pushState({ page: page }, titles[page], `/?${page}`);
  }
}

function updateTitle(page) {
  document.title = titles[page] || 'Page Not Found';
}

function handleRoute(route) {
  if (routes[route]) {
    loadContent(route);
    historyStack.push(route); // Add the route to the history stack
    updateURL(route);
  } else {
    loadContent('home');
  }
}

function bindDynamicLinks() {
  // Bind links for both main navigation and dynamically loaded content
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.getAttribute('data-link');
      handleRoute(page); // Load the page content into the content div
    });
  });

  // Handle dynamic span-based links, like {about}
  document.querySelectorAll('span').forEach(el => {
    if (el.textContent.match(/{(.+?)}/)) {
      const route = el.textContent.match(/{(.+?)}/)[1];
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        handleRoute(route);
      });
    }
  });
}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('home') ? 'home' :
    urlParams.get('about') ? 'about' :
    urlParams.get('contact') ? 'contact' :
    urlParams.get('services') ? 'services' :
    urlParams.get('blog') ? 'blog' :
    urlParams.get('team') ? 'team' : 'home';
  handleRoute(page);
});

window.addEventListener('popstate', (event) => {
  const page = event.state?.page || 'home';
  if (page !== currentPage) {
    loadContent(page);
    currentPage = page;
  }
});