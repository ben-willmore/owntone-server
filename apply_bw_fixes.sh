#!/bin/bash

sed -i.bak "s|d.a.get(\"/api/library/playlists\")|d.a.get(\"/api/library/playlists?foobar=\"+Date.now().toString())|" htdocs/player/js/app.js
if [[ `grep "d.a.get(\"/api/library/playlists?foobar=\"+Date.now().toString())" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi

sed -i.bak "s|d.a.get(\"/api/library/playlists/\"+t)|d.a.get(\"/api/library/playlists/\"+t+\"?foobar=\"+Date.now().toString())|" htdocs/player/js/app.js
if [[ `grep "d.a.get(\"/api/library/playlists/\"+t+\"?foobar=\"+Date.now().toString())" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi

sed -i.bak "s|d.a.get(\"/api/library/playlists/\"+t+\"/tracks\")|d.a.get(\"/api/library/playlists/\"+t+\"/tracks?foobar=\"+Date.now().toString())|" htdocs/player/js/app.js
if [[ `grep "d.a.get(\"/api/library/playlists/\"+t+\"/tracks?foobar=\"+Date.now().toString())" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi

