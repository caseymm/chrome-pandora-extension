$(document).ready(function() {
  var spotifyApi = new SpotifyWebApi();
  console.log('loading Pandora extension!');
  var container = $('#mainContentContainer');
  $('#topnav').after(container);
  $('.skinContainer').hide();
  $('body').append('<img class="spotify" width="175" height="175" src="" crossOrigin="anonymous" style="display: inline;">');
  $('body').append('<div id="blocks"></div>');

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // console.log(mutations, $('.playerBarArt')[0], $('.playerBarArt').attr('src'));
    var albumName = $('.trackData .albumTitle').text();
    // console.log(albumName);
    // spotifyApi.searchAlbums(albumName)
    //   .then(function(data) {
    //     console.log(albumName, data);
    //   }, function(err) {
    //     console.error(err);
    // });

    var artist = $('.info .playerBarArtist').text();
    console.log(artist);
    spotifyApi.searchArtists(artist)
      .then(function(data) {
        // console.log(artist, data.artists.items);
        var match = false,
            count = 0,
            albumImageUrl = '';
        while (!(match) && count < data.artists.items.length){
          console.log(data.artists.items[count]);
          spotifyApi.getArtistAlbums(data.artists.items[count]['id'], {limit: 50}).then(function(data){
            var nAlbumName = albumName.toLowerCase().replace('\'', '').split(' (')[0];
            // map each data items so that they don't inclue the parens either
            _.each(data.items, function(item){
              console.log(item);
              item.name = item.name.toLowerCase().replace('\'', '').split(' (')[0];
            })
            console.log(nAlbumName, data.items, _.findWhere(data.items, {name: nAlbumName}));
            var found = _.findWhere(data.items, {name: nAlbumName});
            if(found){
              match = true;
              albumImageUrl = found.images[0]['url'];

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
                $('body').attr('style', 'background: linear-gradient(270deg, '+colorArr.join(', ')+');');
              });
            }
          });
          count += 1;
        };
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
