const routes = {
  home: '/pages/home',
  about: '/pages/about',
  contact: '/pages/contact',
  services: '/pages/services',
  blog: '/pages/blog',
  team: '/pages/team'
};

const titles = {
  home: 'Home',
  about: 'About',
  contact: 'Contact',
  services: 'Our Services',
  blog: 'Blog',
  team: 'Our Team'
};

const contentDiv = document.getElementById('content');
let currentPage = '';

// Function to set cookies for caching page content
function setCookie(page, content) {
  document.cookie = `${page}=${encodeURIComponent(content)}; path=/; max-age=3600`; // 1 hour expiry
}

// Function to get cached page content from cookies
function getCookie(page) {
  const name = `${page}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

// Function to load content, either from cache or from the server
function loadContent(page) {
  const cachedContent = getCookie(page);
  if (cachedContent) {
    contentDiv.innerHTML = cachedContent; // Load from cache if available
    bindDynamicLinks();
    updateTitle(page);
    currentPage = page;
    return;
  }

  const file = `${routes[page]}`;
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Content not found');
      return response.text();
    })
    .then(html => {
      contentDiv.innerHTML = html;
      setCookie(page, html); // Cache content for future use
      bindDynamicLinks();
      updateTitle(page);
      currentPage = page;
    })
    .catch(() => contentDiv.innerHTML = '<p>Error loading content.</p>');
}

// Function to update the URL
function updateURL(page) {
  if (page === 'home') {
    history.pushState({ page: page }, titles[page], '/');
  } else {
    history.pushState({ page: page }, titles[page], `/?${page}`);
  }
}

// Function to update the page title
function updateTitle(page) {
  document.title = titles[page] || 'Page Not Found';
}

// Function to handle route changes
function handleRoute(route) {
  if (routes[route]) {
    loadContent(route);
    updateURL(route);
  } else {
    loadContent('home');
  }
}

// Function to bind dynamic links inside the content
function bindDynamicLinks() {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.getAttribute('data-link');
      handleRoute(page);
    });
  });
}

// Initial load based on URL parameters
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = Array.from(urlParams.keys()).find(key => routes[key]) || 'home';
  handleRoute(page);
});

// Handle back navigation (popstate) and load the correct content
window.addEventListener('popstate', (event) => {
  const page = event.state?.page || 'home';
  loadContent(page); // Load content based on the history state
  updateTitle(page); // Update the title based on the page
});