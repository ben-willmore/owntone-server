#!/bin/bash



sed -i.bak "s|{text:\"Connection lost. Reconnecting ... (\"+t.reconnect_attempts+\")\",type:\"danger\"|{text:\"Reconnecting...\",type:\"info\"|" htdocs/player/js/app.js
if [[ `grep "{text:\"Reconnecting...\",type:\"info\"" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi

sed -i.bak "s|{text:\"Connecting to forked-daapd\",type:\"info\",topic:\"connection\",timeout:2e3}|{text:\"Connecting...\",type:\"info\",topic:\"connection\",timeout:1e3}|" htdocs/player/js/app.js
if [[ `grep "{text:\"Connecting...\",type:\"info\",topic:\"connection\",timeout:1e3}" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi

sed -i.bak "s|{text:\"Connection to server established\",type:\"primary\",topic:\"connection\",timeout:2e3}|{text:\"Connected\",type:\"primary\",topic:\"connection\",timeout:1e3}|" htdocs/player/js/app.js
if [[ `grep "{text:\"Connected\",type:\"primary\",topic:\"connection\",timeout:1e3}" htdocs/player/js/app.js | wc -l` == 0 ]]; then
  echo No replacement made!
fi
