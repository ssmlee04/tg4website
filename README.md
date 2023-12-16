# tg4website

This helps you add Telegram group chats widget to your website. 

Demo: https://dlp14zgm5vlk5.cloudfront.net/

![](https://i.imgur.com/bPNSFCk.png)

Currently, this supports only group chats for your website. 

# Prerequisite

You need to make sure the group chat is public and has a username with it.

# Installation

* Go to: https://my.telegram.org/apps to get and app id and app hash.
* Invite @tg4website into your group, give it the minimal admin permission, and then do `/initialize`.
* Add the widgets to your website.

# Usage

1. You can use it as a client JS library.

Place the following code between the <head></head> tags of your page:

```
<script src="https://dlp14zgm5vlk5.cloudfront.net/js/vendors.bundle.js" type="text/javascript"></script>
<script src="https://dlp14zgm5vlk5.cloudfront.net/js/app.bundle.js" type="text/javascript"></script>
<script type="text/javascript">
   Tg4Web.init('earningsfly', '17349', '344583e45741c457fe1862106095a5eb');
</script>
```

2. Or, you can use it as a react component by doing:

```js
import Tg4website from 'tg4website';
import 'tg4website/App.css';

<Tg4website channelUsername={'earningsfly'} telegramApiId={'17349'} telegramApiHash={'344583e45741c457fe1862106095a5eb'} />
```

And that's all.

p.s: the telegramApiId and telegramApiHash provided here are sample ids from Telegram. To use it in a live environment you would have to supply your own credentials.

