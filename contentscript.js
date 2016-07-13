$(document).ready(function() {
  var spotifyApi = new SpotifyWebApi(),
      currentPathName = window.location.pathname,
      currentSong = $('.stationSlides.clearfix .slide')[1];
  console.log('loading Pandora extension!');
  var container = $('#mainContentContainer');
  $('#topnav').after('<div id="my-content"><div id="contain"><div id="img"></div><ul id="info"></ul></div></div>');
  $('#my-content').after(container);
  $('.skinContainer').hide();
  $('body').append('<img class="spotify" width="300" height="300" src="" crossOrigin="anonymous" style="display: inline;">');
  $('body').append('<div id="blocks"></div>');
  $('#user_menu_dd ul').append('<li><a href="/feed">Music Feed</a></li>');
  $('#user_menu_dd ul').append('<li><a id="current-station" href="'+currentPathName+'">Current Station</a></li>');
  // $('.homeRightSide').prepend('<div id="current-song"></div>');
  $('#my-content #img').html($(currentSong).find('img.art'));
  // $('#mainContentContainer').width($(window).width()+190);

  // $(window).on('resize', function(){
  //   $('#mainContentContainer').width($(window).width()+190);
  // });

  $('.stationContent').prepend('<div class="show-arrow"></div>');
  $('.show-arrow').click(function(){
    if($(this).hasClass('show')){
      $(this).removeClass('show');
      // $('.stationContent').removeClass('show', 1000);
      $('#mainContentContainer').animate({ "left": "-=190px" }, "fast" );
    } else {
      $(this).addClass('show');
      // $('.stationContent').addClass('show', 1000);
      $('#mainContentContainer').animate({ "left": "+=190px" }, "fast" );
    }
  });

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function(mutations, observer) {
    currentPathName = window.location.pathname;
    $('#current-station').attr('href', currentPathName);
    $('#my-content #info').html('');

    var albumName = $('.trackData .albumTitle').text();
    var artist = $('.info .playerBarArtist').text();
    console.log(artist);
    spotifyApi.searchArtists(artist)
      .then(function(data) {
        // console.log(artist, data.artists.items);
        // var match,
        var count = 0,
            albumImageUrl = '';
        _.each(data.artists.items, function(artist){
          // if(typeof match === 'undefined'){
            spotifyApi.getArtistAlbums(artist.id, {limit: 50}).then(function(data){
              var nAlbumName = albumName.toLowerCase().replace('\'', '');
              // map each data items so that they don't inclue the parens either
              _.each(data.items, function(item){
                // console.log(item);
                item.name = item.name.toLowerCase().replace('\'', '');
              });
              // console.log(nAlbumName, data.items, _.findWhere(data.items, {name: nAlbumName}));
              var match = _.findWhere(data.items, {name: nAlbumName});
              if(match && count === 0){
                count += 1;
                console.log('MATCH', match);
                // match = true;
                albumImageUrl = match.images[0]['url'];

                spotifyApi.getAlbumTracks(match.id).then(function(data){
                  console.log(data);
                  _.each(data.items, function(item){
                    $('#my-content #info').append('<li>'+item.name+'</li>');
                  })
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
                return;
              }
            });
          // }
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
