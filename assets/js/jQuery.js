$(document).ready(function() {
  const pages = {
    home: '/jqp/home',
    about: '/jqp/about',
    contact: '/jqp/contact',
  };

  const loadPage = (linkId, href) => {
    if (linkId && href && pages[linkId] === href) {
      $('#content').load(href);
      $('a').removeClass('active');
      $(`#${linkId}`).addClass('active');
    }
  };

  const loadPageFromUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const linkId = queryParams.keys().next().value || 'home'; // Default to 'home'
    const page = pages[linkId] || pages['home']; // Fallback to 'home' if linkId doesn't exist

    $('#content').load(page); // Load the default or specific page
    $('a').removeClass('active');
    $(`#${linkId}`).addClass('active');
  };

  loadPageFromUrl(); // Load the appropriate page on initial load

  $(document).on('click', 'a', function(e) {
    const href = $(this).attr('href');
    const linkId = $(this).attr('id');

    if (linkId && href && pages[linkId]) {
      e.preventDefault(); // Prevent default navigation
      history.pushState({ page: linkId }, '', `?${linkId}`);
      loadPage(linkId, href); // Load content dynamically
    }
    // Let links without id behave normally
  });

  window.onpopstate = loadPageFromUrl; // Handle browser back/forward buttons
});