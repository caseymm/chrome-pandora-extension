$(document).ready(function() {
  var spotifyApi = new SpotifyWebApi(),
      currentPathName = window.location.pathname,
      currentSong = $('.stationSlides.clearfix .slide')[1];

  console.log('loading Pandora extension!');
  var container = $('#mainContentContainer');
  var table = '<table class="table"><thead><tr><th class="iter"></th><th>Track</th><th>Popularity</th></tr></thead><tbody></tbody></table>';
  var header = '<div id="album-popularity"></div><h2 id="album-name"></h2><div id="artist"></div>';
  $('#topnav').after('<div id="my-content"><div id="contain"><div id="img"><h4 id="album-date"></h4></div><div id="info">'+header+table+'</div></div></div>');
  // $('#my-content').after(container);
  $('#my-content').after('<div id="sidebar"></div>');
  $('#sidebar').append($('.stationContent'));
  $('.skinContainer').hide();
  $('body').append('<img class="spotify" width="100%" height="100%" src="" crossOrigin="anonymous" style="display: inline;">');
  $('body').append('<div id="blocks"></div><div id="single-block"></div>"');
  $('#user_menu_dd ul').append('<li><a href="/feed">Music Feed</a></li>');
  $('#user_menu_dd ul').append('<li><a id="current-station" href="'+currentPathName+'">Current Station</a></li>');
  $('#my-content #img').prepend($(currentSong).find('img.art'));

  // $(window).on('resize', function(){
  //   $('#mainContentContainer').width($(window).width()+190);
  // });

  $('#sidebar').prepend('<div class="show-arrow"></div>');
  $('.show-arrow').click(function(){
    if($(this).hasClass('show')){
      $(this).removeClass('show');
      $('#sidebar').animate({ "left": "-=190px" }, "fast" );
    } else {
      $(this).addClass('show');
      $('#sidebar').animate({ "left": "+=190px" }, "fast" );
    }
  });

  function stripIt(string){
    console.log(string.replace(/\W+/g, " "));
  }

  function pairIt(match){
    console.log('MATCH', match, match.matchCount);
    albumImageUrl = match.images[0]['url'];

    spotifyApi.getAlbum(match.id).then(function(album){
      $('#album-popularity').html(album.popularity);
      $('#album-date').html(moment(album.release_date).format("MMM YYYY"));
    });

    spotifyApi.getAlbumTracks(match.id).then(function(data){
      var trackIds = [];
      $.each(data.items, function(i, item){
        // console.log(item);
        trackIds.push(item.id);
      });
      spotifyApi.getTracks(trackIds).then(function(data){
        // console.log(data);
        $.each(data.tracks, function(i, track){
          // console.log(track);
          if($('#track'+track.track_number).length > 0){
            // console.log($('#track'+track.track_number));
          } else {
            $('#my-content #info tbody').append('<tr id="id'+i+'"><td id="track'+track.track_number+'" class="iter">'+track.track_number+'</td><td>'+track.name+'</td><td><div class="pop" style="width:'+track.popularity+'px;"></div><div>'+track.popularity+'</div></td></tr>');
            if(track.name.toLowerCase() === $('.playerBarSong').text().toLowerCase()){
              stripIt(track.name);
              stripIt($('.playerBarSong').text());
              $('#id'+i).css('background-color', 'rgba(255,255,255,0.2)');
            }
          }
        })
      });
    });

    $('img.spotify').attr('src', albumImageUrl);
    $('img.spotify').load(function(){
      $('#blocks').empty();
      var colorThief = new ColorThief();
      var myImage = $('img.spotify')[0];
      // var singleColor = colorThief.getColor(myImage);
      // console.log('singleColor', singleColor);
      // _.each(['table.table', ''], function(item){
      //
      // });
      // $('#info').css('background-color', 'rgba('+singleColor[0]+','+singleColor[1]+','+singleColor[2]+', 0.2)');
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
      $('#my-content #img').prepend($('img.spotify'));
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
    var albumImageUrl = '';
        allAlbums = [],
        curMaxCount = 1;

    spotifyApi.searchArtists(artist)
      .then(function(data) {
        // console.log(artist, data.artists.items);
        $.each(data.artists.items, function(i, artist){
          // console.log('artist', artist);
          spotifyApi.getArtistAlbums(artist.id, {limit: 50}).then(function(data){
            // console.log('albums', data.items);
            var albumArray = albumName.toLowerCase().replace(':', '').replace('(', '').replace(')', '').split(' ');
            $.each(data.items, function(i, item){
              console.log(item.name);
              var itemAlbumArray = item.name.toLowerCase().replace(':', '').replace('(', '').replace(')', '').split(' ');
              item.matchCount = _.intersection(albumArray, itemAlbumArray).length/itemAlbumArray.length*100;
              allAlbums.push(item);
            });
            var match = _.max(data.items, function(item){ return item.matchCount; });
            if(match.matchCount >= curMaxCount){
              curMaxCount = match.matchCount;
              $('#artist').html('by <a href="'+artist.external_urls.spotify+'" target="_blank">'+artist.name+'</a>');
              $('#album-name').html('<a href="'+match.external_urls.spotify+'" target="_blank">'+albumName+'</a>');
              pairIt(match);
            }
          });
        });
      });

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
