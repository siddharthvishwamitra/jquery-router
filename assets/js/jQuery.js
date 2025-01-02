$(document).ready(function() {
  const pages = {
    home: '/jqp/home',
    about: '/jqp/about',
    contact: '/jqp/contact',
  };

  const loadPage = (linkId, href) => {
    if (pages[linkId] || Object.values(pages).includes(href)) {
      $('#content').load(href || pages[linkId]);
      $('a').removeClass('active');
      if (linkId) $(`#${linkId}`).addClass('active');
    }
  };

  const loadPageFromUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const linkId = queryParams.keys().next().value || 'home';
    const page = pages[linkId] || pages['home'];

    $('#content').load(page);
    $('a').removeClass('active');
    $(`#${linkId}`).addClass('active');
  };

  loadPageFromUrl();

  $(document).on('click', 'a', function(e) {
    e.preventDefault();
    const href = $(this).attr('href');
    const linkId = $(this).attr('id') || Object.keys(pages).find(key => pages[key] === href);

    if (href) {
      history.pushState({ page: linkId || href }, '', `?${linkId || href}`);
      loadPage(linkId, href);
    }
  });

  window.onpopstate = loadPageFromUrl;
});