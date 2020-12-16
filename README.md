# PandaCC

A web application to convert between Chinese Simplified and Chinese Traditional. Might add support for Japanese 旧字体 and 新字体 in the future.

Makes heavy use of [OpenCC](https://github.com/BYVoid/OpenCC) and the fork [opencc-js](https://github.com/nk2028/opencc-js).

This repository contains both the server-side node.js code and client-side browser code.
The server handles GET requests to certain URLs in form "/direction?query=abc" and responds with the converted output as a JSON.

※ This is very niche and basically useless. I made this because I was taking a Japanese class and to write my Chinese name in Japanese, I have to use traditional characters. Since I didn't want to add a Traditional input method, every time I wanted to write my name, I would use Google Translate to "translate" between Chinese (Simplified) and Chinese (Traditional) and copy/paste into my Word doc, which was めんどうくさい because of all the buttons you have to press to change languages.
