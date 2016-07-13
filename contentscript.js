$(document).ready(function() {
  var spotifyApi = new SpotifyWebApi(),
      currentPathName = window.location.pathname,
      currentSong = $('.stationSlides.clearfix .slide')[1];

  console.log('loading Pandora extension!');
  var container = $('#mainContentContainer');
  var table = '<table><thead><tr><th></th><th>Track</th><th>Popularity</th></tr></thead><tbody></tbody></table>';
  var header = '<h2 id="album-name"></h2><h4 id="artist"></h4><h4 id="album-date"></h4><div id="album-popularity"></div>';
  $('#topnav').after('<div id="my-content"><div id="contain"><div id="img"></div><div id="info">'+header+table+'</div></div></div>');
  // $('#my-content').after(container);
  $('#my-content').after($('.stationContent'));
  $('.skinContainer').hide();
  $('body').append('<img class="spotify" width="300" height="300" src="" crossOrigin="anonymous" style="display: inline;">');
  $('body').append('<div id="blocks"></div>');
  $('#user_menu_dd ul').append('<li><a href="/feed">Music Feed</a></li>');
  $('#user_menu_dd ul').append('<li><a id="current-station" href="'+currentPathName+'">Current Station</a></li>');
  $('#my-content #img').html($(currentSong).find('img.art'));
  $('#')

  // $(window).on('resize', function(){
  //   $('#mainContentContainer').width($(window).width()+190);
  // });

  $('.stationContent').prepend('<div class="show-arrow"></div>');
  $('.show-arrow').click(function(){
    if($(this).hasClass('show')){
      $(this).removeClass('show');
      // $('.stationContent').removeClass('show', 1000);
      $('.stationContent').animate({ "left": "-=190px" }, "fast" );
    } else {
      $(this).addClass('show');
      // $('.stationContent').addClass('show', 1000);
      $('.stationContent').animate({ "left": "+=190px" }, "fast" );
    }
  });

  function pairIt(match){
    console.log('MATCH', match);
    albumImageUrl = match.images[0]['url'];

    spotifyApi.getAlbum(match.id).then(function(album){
      $('#album-popularity').html(album.popularity);
      $('#album-date').html(album.release_date);
    });

    spotifyApi.getAlbumTracks(match.id).then(function(data){
      var trackIds = [];
      $.each(data.items, function(i, item){
        // console.log(item);
        // $('#my-content #info tbody').append('<tr><td>'+item.track_number+'</td><td>'+item.name+'</td><td>'+item.name+'</td></tr>');
        trackIds.push(item.id);
      });
      spotifyApi.getTracks(trackIds).then(function(data){
        console.log(data);
        $.each(data.tracks, function(i, track){
          console.log(track);
          $('#my-content #info tbody').append('<tr><td>'+track.track_number+'</td><td>'+track.name+'</td><td>'+track.popularity+'</td></tr>');
        })
      });
    });

    $('img.spotify').attr('src', albumImageUrl);
    $('img.spotify').load(function(){
      $('#blocks').empty();
      var colorThief = new ColorThief();
      var myImage = $('img.spotify')[0];
      var colors = colorThief.getPalette(myImage, 4);
      var colorArr = [];
      console.log(colors);
      $.each(colors, function(idx, color){
        console.log(color);
        var rgbColor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
        colorArr.push(rgbColor);
        $('#blocks').append('<div style="width: 20px; height: 20px; margin:5px; background-color: '+rgbColor+';"></div>');
      });
      console.log(colorArr.join(', '));
      // currentSong = $('.stationSlides.clearfix .slide')[1];
      $('#my-content #img').html($('img.spotify'));
      $('body').attr('style', 'background: linear-gradient(270deg, '+colorArr.join(', ')+');');
    });
  }

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function(mutations, observer) {
    currentPathName = window.location.pathname;
    $('#current-station').attr('href', currentPathName);
    $('#my-content #info tbody').empty();

    var albumName = $('.trackData .albumTitle').text();
    var artist = $('.info .playerBarArtist').text().split(' &')[0];
    console.log(artist);
    var count = 0,
        albumImageUrl = '';

    if(count === 0){
      spotifyApi.searchArtists(artist)
        .then(function(data) {
          // console.log(artist, data.artists.items);
          $.each(data.artists.items, function(i, artist){
            if(count === 0){
            // console.log('artist', artist);
              spotifyApi.getArtistAlbums(artist.id, {limit: 50}).then(function(data){
                console.log('albums', data.items);
                var nAlbumName = albumName.toLowerCase().replace('\'', '');
                // map each data items so that they don't inclue the parens either
                $.each(data.items, function(i, item){
                  // console.log(item);
                  item.name = item.name.toLowerCase().replace('\'', '');
                });
                // console.log(nAlbumName, data.items, _.findWhere(data.items, {name: nAlbumName}));
                var match = _.findWhere(data.items, {name: nAlbumName});
                if(match && count === 0){
                  count += 1;
                  $('#artist').html('<a href="'+artist.external_urls.spotify+'" target="_blank">'+artist.name+'</a>');
                  $('#album-name').html('<a href="'+match.external_urls.spotify+'" target="_blank">'+albumName+'</a>');
                  pairIt(match);
                  return;
                } else {
                  nAlbumName = albumName.toLowerCase().replace('\'', '').split(' (')[0];
                  nAlbumName = nAlbumName.split(' -')[0];
                  // map each data items so that they don't inclue the parens either
                  $.each(data.items, function(i, item){
                    // console.log(item);
                    thing = item.name.toLowerCase().replace('\'', '').split(' (')[0];
                    item.name = thing.split(' -')[0];
                  });
                  console.log('else', nAlbumName);
                  // console.log(nAlbumName, data.items, _.findWhere(data.items, {name: nAlbumName}));
                  var match = _.findWhere(data.items, {name: nAlbumName});
                  if(match && count === 0){
                    count += 1;
                    $('#artist').html('<a href="'+artist.external_urls.spotify+'" target="_blank">'+artist.name+'</a>');
                    $('#album-name').html('<a href="'+match.external_urls.spotify+'" target="_blank">'+albumName+'</a>');
                    pairIt(match);
                    return;
                  }
                }
              });
            }
          });
        });
      }
      }, function(err) {
        console.error(err);
    });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe($('.nowplaying')[0], {
    subtree: true,
    childList: true
  });

});
