(function(){
  var VISIBLE_COUNT = 8;
  var grid = document.getElementById('blogGrid');
  var cards = grid ? Array.from(grid.querySelectorAll('.blog-card')) : [];
  var filters = document.getElementById('blogFilters');
  var search = document.getElementById('blogSearch');
  var empty = document.getElementById('blogEmpty');
  var loadMore = document.getElementById('blogLoadMore');
  var loadBtn = document.getElementById('blogLoadBtn');
  var activeFilter = 'all';
  var shown = VISIBLE_COUNT;

  function applyFilters(){
    var query = (search ? search.value : '').toLowerCase().trim();
    var visible = 0;
    shown = VISIBLE_COUNT;

    cards.forEach(function(card){
      var cat = card.getAttribute('data-category') || '';
      var text = card.getAttribute('data-title') || '';
      var matchFilter = activeFilter === 'all' || cat === activeFilter;
      var matchSearch = !query || text.indexOf(query) !== -1;
      if(matchFilter && matchSearch){
        visible++;
        card.classList.toggle('is-hidden', visible > shown);
      } else {
        card.classList.add('is-hidden');
      }
    });

    if(empty) empty.style.display = visible === 0 ? 'block' : 'none';
    if(loadMore) loadMore.style.display = visible > shown ? 'flex' : 'none';
  }

  if(filters){
    filters.addEventListener('click', function(e){
      if(!e.target.classList.contains('blog-filter')) return;
      filters.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      applyFilters();
    });
  }

  if(search){
    search.addEventListener('input', applyFilters);
  }

  if(loadBtn){
    loadBtn.addEventListener('click', function(){
      shown += VISIBLE_COUNT;
      applyFilters();
    });
  }

  applyFilters();
})();
