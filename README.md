# tg4website

This help you add Telegram group chats widget to your website. 

Demo: https://dlp14zgm5vlk5.cloudfront.net/

![](https://i.imgur.com/bPNSFCk.png)

# Installation

Go to: https://my.telegram.org/apps to get and app id and app hash.

# Usage

You can add the javascript files to your head tag.

```
<script src="https://tg4website.s3.amazonaws.com/js/vendors.bundle.js"></script>
<script src="https://tg4website.s3.amazonaws.com/js/app.bundle.js"></script>
<script type="text/javascript">
   Tg4Web.init('earningsfly', '17349', '344583e45741c457fe1862106095a5eb');
</script>
```

Or you can use it as a react component by doing:

```js
import Tg4website from 'tg4website';
import 'tg4website/App.css';

<Tg4website channelUsername={'earningsfly'} telegramApiId={'17349'} telegramApiHash={'344583e45741c457fe1862106095a5eb'} />
```

And that's all.