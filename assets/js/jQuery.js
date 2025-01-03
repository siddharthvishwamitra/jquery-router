$(document).ready(function() {
  const pages = {
    home: '/jqp/home',
    about: '/jqp/about',
    contact: '/jqp/contact',
  };

  const pageTitles = {
    home: 'jQuery Router',
    about: 'About',
    contact: 'Contact',
  };

  const loadPage = (linkId) => {
    if (pages[linkId]) {
      $('#content').load(pages[linkId]);
      $('a').removeClass('active');
      $(`#${linkId}`).addClass('active');
      document.title = pageTitles[linkId] || 'Default Title';
    }
  };

  const loadPageFromUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const linkId = queryParams.keys().next().value || 'home';
    loadPage(linkId);
  };

  loadPageFromUrl();

  $(document).on('click', 'a', function(e) {
    const linkId = $(this).attr('id');
    if (linkId && pages[linkId]) {
      e.preventDefault();
      history.pushState({ page: linkId }, '', `?${linkId}`);
      loadPage(linkId);
    }
  });

  window.onpopstate = loadPageFromUrl;
});