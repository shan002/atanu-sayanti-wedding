ATANU & SAYANTI — FINAL INVITATION PROJECT V4

PUBLIC LINKS
1. Wedding only (default):
   https://atanu-sayanti-wedding.vercel.app/

2. Wedding + Reception:
   https://atanu-sayanti-wedding.vercel.app/wedding-reception/

3. Wedding + Reception + Color Fest:
   https://atanu-sayanti-wedding.vercel.app/all/

WEDDING-ONLY RSVP
The default wedding-only page:
- does NOT ask "Which event will you attend?"
- uses: "Please let us know if you will be able to attend our wedding."

Multi-event pages still use:
"Please let us know which celebrations you will be joining."

FOLDER STRUCTURE
assets/
- app.js
- config.js
- styles.css
- shubh-vivah-celebration.mp3

images/
- hero.jpg
- couple.jpg
- pic-1.jpg
- pic-2.jpg
- pic-3.jpg
- pic-4.jpg
- share-preview-wedding.png
- share-preview.png
- share-preview-all.png

IMPORTANT
If your personal photos are not included in this ZIP, copy your existing photos into /images
using the exact filenames above.

PHOTO ROLES
hero.jpg   = full-screen hero photo
couple.jpg = vertical photo beside "A Sacred Beginning"
pic-1.jpg  = gallery + countdown background
pic-2.jpg  = gallery
pic-3.jpg  = gallery
pic-4.jpg  = gallery

RSVP WHATSAPP
Edit assets/config.js:
whatsappNumber: "88017XXXXXXXX"

COLOR FEST
Edit the colorFest object in assets/config.js once details are finalized.

DEPLOY
git status
git add .
git commit -m "Clean up final wedding invitation"
git push
